import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './data/model/payment.entity';
import Stripe from 'stripe';
import {ConfigKey, configManager} from "@common/config";
import {ulid} from "ulid";
import {User} from "@feature/user/model";

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        // Initialisation de Stripe avec la clé API récupérée des variables d'environnement
        const stripeApiKey = configManager.getValue(ConfigKey.STRIPE_SECRET_KEY);
        this.stripe = new Stripe(stripeApiKey, {
            apiVersion: '2024-09-30.acacia',
        });
    }

    // Créer un PaymentIntent avec Stripe et sauvegarder le paiement en base de données
    async createPayment(amount: number, currency: string, userId: string): Promise<{ clientSecret: string }> {
        const user = await this.userRepository.findOne({ where: { idUser: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            payment_method_types: ['card'],
            metadata: { userId },
        });

        const payment = this.paymentRepository.create({
            idPayment: ulid(),
            stripePaymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: 'pending',
            paymentDate: new Date(),
            user,
        });

        await this.paymentRepository.save(payment);

        return {
            clientSecret: paymentIntent.client_secret,
        };
    }

    async findPaymentById(paymentId: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({ where: { idPayment: paymentId } });
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }
        return payment;
    }

    async refundPayment(paymentId: string): Promise<Payment> {
        const payment = await this.findPaymentById(paymentId);

        // Effectuer le remboursement via Stripe
        await this.stripe.refunds.create({
            payment_intent: payment.stripePaymentIntentId,
        });

        payment.status = 'refunded';
        payment.refundDate = new Date();
        return this.paymentRepository.save(payment);
    }




    async getPaymentsForOrder(orderId: string): Promise<Payment[]> {
        return this.paymentRepository.find({ where: { order: { idOrder: orderId } } });
    }
}
