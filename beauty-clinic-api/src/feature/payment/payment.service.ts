import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './data/model/payment.entity';
import Stripe from 'stripe';
import {ConfigKey, configManager} from "@common/config";

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {
        // Initialisation de Stripe avec la clé API récupérée des variables d'environnement
        const stripeApiKey = configManager.getValue(ConfigKey.STRIPE_SECRET_KEY);
        this.stripe = new Stripe(stripeApiKey, {
            apiVersion: '2024-09-30.acacia',
        });
    }

    // Créer un PaymentIntent avec Stripe et sauvegarder le paiement en base de données
    async createPaymentIntent(amount: number, currency: string, orderId: string): Promise<Payment> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount * 100,  // Stripe traite les montants en centimes
            currency,
            payment_method_types: ['card'],
        });

        const payment = this.paymentRepository.create({
            idPayment: paymentIntent.id,  // Utiliser l'ID du PaymentIntent comme identifiant de paiement
            stripePaymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: 'pending',  // Statut initial
            paymentDate: new Date(),
            order: { idOrder: orderId },  // Associer l'ID de la commande
        });

        return this.paymentRepository.save(payment);
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

    //test payment without client
    // Créer et confirmer un Payment Intent pour tester les paiements
    async createAndConfirmPayment(amount: number, currency: string, orderId: string): Promise<Payment> {
        // Créer le Payment Intent
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount * 100,  // Stripe traite les montants en centimes
            currency,
            payment_method_types: ['card'],  // Type de paiement : carte
        });

        // Créer un Payment Method avec une carte de test
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242',  // Numéro de carte de test Stripe
                exp_month: 12,
                exp_year: 2024,
                cvc: '123',
            },
        });

        // Confirmer le Payment Intent avec l'ID du Payment Method
        await this.stripe.paymentIntents.confirm(paymentIntent.id, {
            payment_method: paymentMethod.id,  // Utiliser l'ID du Payment Method
        });

        // Sauvegarder le paiement dans la base de données
        const payment = this.paymentRepository.create({
            idPayment: paymentIntent.id,
            stripePaymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: 'succeeded',  // Le paiement a réussi
            paymentDate: new Date(),
            order: { idOrder: orderId },
        });

        return this.paymentRepository.save(payment);
    }

    async getPaymentsForOrder(orderId: string): Promise<Payment[]> {
        return this.paymentRepository.find({ where: { order: { idOrder: orderId } } });
    }
}
