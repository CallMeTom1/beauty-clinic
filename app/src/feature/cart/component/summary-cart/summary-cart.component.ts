import {Component, effect, inject, Input} from '@angular/core';
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {CartItem} from "../../../security/data/model/cart/cart-item.business";
import {AppNode} from "@shared-routes";
import {SecurityService} from "@feature-security";
import {ShippingFee} from "../../../security/data/model/shipping-fee/shipping-fee.business";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {Cart} from "../../../security/data/model/cart/cart.business";

@Component({
  selector: 'app-summary-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    TranslateModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './summary-cart.component.html',
  styleUrl: './summary-cart.component.scss'
})
export class SummaryCartComponent {
  @Input() showConfirmButton: boolean = true;  // true par défaut pour maintenir le comportement actuel
  protected readonly securityService = inject(SecurityService);
  protected cart?: Cart;
  protected cartItems: CartItem[] = [];
  protected calculatedSubTotal: number = 0;
  protected calculatedTotal: number = 0;
  protected currentShippingFee: ShippingFee | null = null;
  protected isShippingFree: boolean = false;
  protected remainingForFreeShipping: number = 0;

  // Code promo
  protected loading = false;
  protected discountAmount = 0;
  protected promoName: string = '';
  protected discountPercentage: number = 0;

  promoCodeForm = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ])
  });

  constructor() {
    this.securityService.fetchShippingFees().subscribe();

    effect(() => {
      this.cart = this.securityService.cart$();
      if (this.cart) {
        this.cartItems = this.cart.items;
        this.discountAmount = Number(this.cart.discountAmount || 0);
        // Vérifier si promoCode existe avant d'accéder à ses propriétés
        if (this.cart.promoCode) {
          this.promoName = this.cart.promoCode.code;
          this.discountPercentage = Number(this.cart.promoCode.percentage);
        } else {
          this.promoName = '';
          this.discountPercentage = 0;
        }
        this.currentShippingFee = this.securityService.shippingFees$();
        this.updateCalculations();
      }
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
    if (!this.cartItems?.length) {
      this.calculatedSubTotal = 0;
      this.calculatedTotal = 0;
      return;
    }

    // Calcul du sous-total (prix déjà TTC)
    this.calculatedSubTotal = this.cartItems.reduce((total, item) => {
      const price = item.product.is_promo ? Number(item.product.price_discounted) : Number(item.product.initial_price);
      return total + (Number(item.quantity) * price);
    }, 0);

    // Application du discount amount s'il existe
    if (this.cart?.discountAmount) {
      this.discountAmount = Number(this.cart.discountAmount);
      this.calculatedTotal = this.calculatedSubTotal - this.discountAmount;
    } else {
      this.calculatedTotal = this.calculatedSubTotal;
    }

    // Vérifier si la livraison est gratuite
    if (this.currentShippingFee) {
      this.isShippingFree = this.calculatedTotal >= Number(this.currentShippingFee.freeShippingThreshold);
      this.remainingForFreeShipping = this.isShippingFree ?
        0 :
        Number(this.currentShippingFee.freeShippingThreshold - this.calculatedTotal);
    }
  }

  protected getShippingAmount(): number {
    if (!this.currentShippingFee) return 0;
    return this.isShippingFree ? 0 : Number(this.currentShippingFee.amount);
  }

  protected getTotalOrder(): number {
    const shippingAmount = this.getShippingAmount();
    return this.calculatedTotal + shippingAmount;
  }

  protected confirmCart(): void {
    this.securityService.navigate(AppNode.CONFIRM_ORDER);
  }

  protected applyPromoCode(): void {
    if (this.promoCodeForm.valid && !this.loading) {
      this.loading = true;
      const payload = {
        code: this.promoCodeForm.get('code')?.value || ''
      };

      this.securityService.applyPromoCodeToCart(payload).subscribe({
        next: () => {
          this.promoCodeForm.reset();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  protected removePromoCode(): void {
    if (!this.loading) {
      this.loading = true;
      this.securityService.removePromoCodeFromCart().subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }


}
