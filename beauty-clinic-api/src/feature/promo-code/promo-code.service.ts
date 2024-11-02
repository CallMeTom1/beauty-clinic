// promo-code.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCode } from './data/model/promo-code.entity';
import { Cart } from '../cart/data/model/cart.entity';
import { ulid } from 'ulid';
import {CreatePromoCodePayload} from "./data/payload/create-promo-code.payload";
import {UpdatePromoCodePayload} from "./data/payload/update-promo-code.payload";

@Injectable()
export class PromoCodeService {
    constructor(
        @InjectRepository(PromoCode)
        private readonly promoCodeRepository: Repository<PromoCode>
    ) {}


    async getAllPromoCodes(): Promise<PromoCode[]> {
        return this.promoCodeRepository.find({
            order: {
                isActive: 'DESC',
                validTo: 'DESC',
                code: 'ASC'
            }
        });
    }

    async validateAndCalculateDiscount(code: string, cart: Cart): Promise<{ promoCode: PromoCode, discountAmount: number }> {
        // Vérifier si le panier existe et n'est pas vide
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new BadRequestException('Le panier est vide');
        }
        console.log('ici')

        console.log(cart)

        console.log('la')

        const promoCode = await this.promoCodeRepository.findOne({
            where: { code, isActive: true }
        });
        console.log('apres promocode')

        if (!promoCode) {
            throw new BadRequestException('Code promo invalide ou inactif');
        }

        const now = new Date();
        if (now < promoCode.validFrom || now > promoCode.validTo) {
            throw new BadRequestException('Code promo expiré ou pas encore valide');
        }

        if (promoCode.usedCount >= promoCode.maxUses) {
            throw new BadRequestException('Ce code promo a atteint son nombre maximum d\'utilisations');
        }
        console.log('apres if')


        // Calculer le total du panier
        const cartTotal = cart.items.reduce((total, item) => {
            const price = item.product.is_promo ? item.product.price_discounted : item.product.initial_price;
            return total + (price * item.quantity);
        }, 0);
        console.log('laaa')

        // Calculer la réduction
        const discountAmount = Number((cartTotal * promoCode.percentage / 100).toFixed(2));

        return { promoCode, discountAmount };
    }

    async incrementUsage(promoCodeId: string): Promise<void> {
        await this.promoCodeRepository.increment(
            { promo_code_id: promoCodeId },
            'usedCount',
            1
        );
    }

    async createPromoCode(payload: CreatePromoCodePayload): Promise<PromoCode> {
        const now = new Date();

        // Validations supplémentaires
        if (payload.validFrom < now) {
            throw new BadRequestException('La date de début doit être future');
        }

        if (payload.validTo < payload.validFrom) {
            throw new BadRequestException('La date de fin doit être postérieure à la date de début');
        }

        const existingCode = await this.promoCodeRepository.findOne({
            where: { code: payload.code }
        });

        if (existingCode) {
            throw new BadRequestException('Ce code promo existe déjà');
        }

        const promoCode = this.promoCodeRepository.create({
            promo_code_id: ulid(),
            ...payload,
            isActive: true,
            usedCount: 0
        });

        return this.promoCodeRepository.save(promoCode);
    }

    async getPromoCodeById(id: string): Promise<PromoCode> {
        const promoCode = await this.promoCodeRepository.findOne({
            where: { promo_code_id: id }
        });

        if (!promoCode) {
            throw new NotFoundException('Code promo non trouvé');
        }

        return promoCode;
    }

    async updatePromoCode(payload: UpdatePromoCodePayload): Promise<PromoCode> {
        const promoCode = await this.getPromoCodeById(payload.promo_code_id);
        const now = new Date();

        // Validations supplémentaires
        if (payload.validTo) {
            if (payload.validTo < now) {
                throw new BadRequestException('La date de fin doit être future');
            }
            if (payload.validTo < promoCode.validFrom) {
                throw new BadRequestException('La date de fin doit être postérieure à la date de début');
            }
        }

        if (payload.maxUses && payload.maxUses < promoCode.usedCount) {
            throw new BadRequestException('Le nombre maximum d\'utilisations ne peut pas être inférieur au nombre d\'utilisations actuelles');
        }

        Object.assign(promoCode, {
            percentage: payload.percentage ?? promoCode.percentage,
            maxUses: payload.maxUses ?? promoCode.maxUses,
            validTo: payload.validTo ?? promoCode.validTo,
            isActive: payload.isActive ?? promoCode.isActive,
        });

        return this.promoCodeRepository.save(promoCode);
    }

    async deletePromoCode(id: string): Promise<void> {
        const promoCode = await this.getPromoCodeById(id);

        if (promoCode.usedCount > 0) {
            throw new BadRequestException('Impossible de supprimer un code promo déjà utilisé');
        }

        await this.promoCodeRepository.remove(promoCode);
    }
}