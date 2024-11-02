import {Component, effect, inject} from '@angular/core';
import {CurrencyPipe, NgClass, NgIf} from "@angular/common";
import {PaymentFormComponent} from "../../../security/component/payment-form/payment-form.component";
import {SecurityService} from "@feature-security";
import {CartItem} from "../../../security/data/model/cart/cart-item.business";
import {ShippingFee} from "../../../security/data/model/shipping-fee/shipping-fee.business";
import {ApplyPromoCodeComponent} from "../apply-promo-code/apply-promo-code.component";

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    PaymentFormComponent,
    NgClass,
    ApplyPromoCodeComponent
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  protected readonly securityService: SecurityService = inject(SecurityService);
  protected cartItems: CartItem[] = [];
  protected calculatedTotal: number = 0;
  protected calculatedTvafees: number = 0;
  protected calculatedTotalOrder: number = 0;
  protected currentShippingFee: ShippingFee | null = null;
  protected isShippingFree: boolean = false;

  constructor() {
    // Fetch shipping fees on init
    this.securityService.fetchShippingFees().subscribe();

    effect(() => {
      this.cartItems = this.securityService.cart$().items;
      this.currentShippingFee = this.securityService.shippingFees$();
      this.updateCalculations();
    });

    effect(() => {
      if (this.securityService.sucesMessage$()) {
        setTimeout(() => this.securityService.sucesMessage$.set(null), 3000);
      }
      if (this.securityService.error$()) {
        setTimeout(() => this.securityService.error$.set(null), 3000);
      }
    });
  }

  private updateCalculations(): void {
    // Calcul du total en tenant compte des promotions
    this.calculatedTotal = this.cartItems.reduce((total, item) => {
      const price = item.product.is_promo ? item.product.price_discounted : item.product.initial_price;
      return total + (item.quantity * price);
    }, 0);

    // Vérifier si la livraison est gratuite
    if (this.currentShippingFee) {
      this.isShippingFree = this.calculatedTotal >= this.currentShippingFee.freeShippingThreshold;
    }



    const shippingAmount = this.isShippingFree ? 0 : (this.currentShippingFee?.amount || 0);
    this.calculatedTotalOrder = this.calculatedTotal + shippingAmount;
  }

  protected getShippingAmount(): number {
    if (!this.currentShippingFee) return 0;
    return this.isShippingFree ? 0 : this.currentShippingFee.amount;
  }
}

