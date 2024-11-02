import {UpdateShippingFeePayload} from "./data/payload/update-shipping-fee.payload";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {ShippingFee} from "./data/model/shipping-fee.entity";
import {Repository} from "typeorm";
import {ulid} from "ulid";

@Injectable()
export class ShippingFeeService {
    private readonly logger = new Logger(ShippingFeeService.name);

    private readonly DEFAULT_SHIPPING_FEE = {
        amount: 4.99,
        freeShippingThreshold: 50.00,
        description: 'Frais de livraison standard - Gratuit à partir de 50€'
    };

    constructor(
        @InjectRepository(ShippingFee)
        private readonly shippingFeeRepository: Repository<ShippingFee>
    ) {}

    async getShippingFee(): Promise<ShippingFee> {
        try {
            const fees = await this.shippingFeeRepository.find();

            if (!fees.length) {
                this.logger.log('Aucun frais de livraison trouvé, création des frais par défaut');
                return this.createDefaultShippingFee();
            }

            return fees[0];
        } catch (error) {
            this.logger.error('Erreur lors de la récupération des frais de livraison', error);
            throw new NotFoundException('Erreur lors de la récupération des frais de livraison');
        }
    }

    private async createDefaultShippingFee(): Promise<ShippingFee> {
        const defaultFee = this.shippingFeeRepository.create({
            shipping_fee_id: ulid(),
            ...this.DEFAULT_SHIPPING_FEE
        });

        try {
            const savedFee = await this.shippingFeeRepository.save(defaultFee);
            this.logger.log(`Frais de livraison par défaut créés avec l'ID: ${savedFee.shipping_fee_id}`);
            return savedFee;
        } catch (error) {
            this.logger.error('Erreur lors de la création des frais de livraison par défaut', error);
            throw error;
        }
    }

    async calculateShippingFee(orderTotal: number): Promise<number> {
        const fee = await this.getShippingFee();
        return orderTotal >= fee.freeShippingThreshold ? 0 : fee.amount;
    }

    async updateShippingFee(payload: UpdateShippingFeePayload): Promise<ShippingFee> {
        try {
            const existingFee = await this.getShippingFee();

            // Mettre à jour les frais existants plutôt que d'en créer de nouveaux
            Object.assign(existingFee, {
                amount: payload.amount,
                freeShippingThreshold: payload.freeShippingThreshold,
                description: payload.description
            });

            const updatedFee = await this.shippingFeeRepository.save(existingFee);
            this.logger.log(`Frais de livraison mis à jour avec succès`);
            return updatedFee;

        } catch (error) {
            this.logger.error('Erreur lors de la mise à jour des frais de livraison', error);
            throw error;
        }
    }
}