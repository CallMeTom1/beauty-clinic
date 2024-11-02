import { Injectable } from '@angular/core';
import {loadStripe, Stripe} from "@stripe/stripe-js";

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private readonly stripePromise: Promise<Stripe | null>;
  protected clientSecret: string = ''
  constructor() {
    this.stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');
  }

  async createPayment(clientSecret: string, cardElement: any) {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe could not be loaded');
    }

    // Créer le paiement avec Stripe.js
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Customer Name',
        },
      },
    });

    if (error) {
      return { error };
    }
    return { paymentIntent };
  }
}
