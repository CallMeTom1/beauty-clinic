import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
  Appearance,
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
  StripeElementStyle, StripePaymentElement,
  StripePaymentElementOptions
} from "@stripe/stripe-js";
import {NgIf} from "@angular/common";
import {StripeService} from "../../stripe.service";
import {HttpClient} from "@angular/common/http";
import {SecurityService} from "@feature-security";
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent implements OnInit{
  @ViewChild('paymentElement') paymentElementRef!: ElementRef;
  elements!: StripeElements;
  stripe: Stripe | null = null;
  clientSecret: string | null = null;
  paymentElement!: StripePaymentElement;
  customerName: string = '';
  username: string = ''; // Nouvelle propriété pour le nom d'utilisateur

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  async ngOnInit() {
    const loadedStripe = await loadStripe('pk_test_51Q7Rfv2NpSZDouvvOdBl5caoa5maAWtlonVjLCMscP3ePld7pQk6tZXiP9N39nFoRQDkQBM99xdlCVMxcKAKiEdh00EVzddhJX');
    if (loadedStripe) {
      this.stripe = loadedStripe;
      await this.initializePaymentElement();
    } else {
      console.error('Failed to load Stripe');
    }
  }

  async initializePaymentElement() {
    if (this.stripe) {
      const response = await this.securityService.initiatePaymentIntent().toPromise();
      if (response) {
        this.clientSecret = response;
        this.elements = this.stripe.elements({ clientSecret: this.clientSecret });

        const paymentElementOptions: StripePaymentElementOptions = {
          paymentMethodOrder: ['card'],
        };

        this.paymentElement = this.elements.create('payment', paymentElementOptions);
        this.paymentElement.mount(this.paymentElementRef.nativeElement);
      }
    }
  }


  async handlePayment() {
    if (!this.clientSecret || !this.stripe) {
      console.error('Client secret or Stripe is not set.');
      return;
    }

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: 'https://localhost:4200/cart',
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error('Error confirming payment:', error);
      //this.router.navigate(['/cart'], { queryParams: { payment_status: 'error' } });
    } else if (paymentIntent) {
      // Récupération du statut et du PaymentIntent ID
      const status = paymentIntent.status;
      const paymentIntentId = paymentIntent.id;
      console.log(paymentIntent)
      // Envoi des informations au backend
      this.securityService.createOrder(status, paymentIntentId).subscribe()
    }
  }
}
