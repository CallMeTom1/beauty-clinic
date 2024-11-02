import {Component, effect, inject} from '@angular/core';
import {ProductItemSubComponent} from "../../component/product-item-sub/product-item-sub.component";
import {SecurityService} from "@feature-security";
import {CartItem} from "../../../security/data/model/cart/cart-item.business";
import {CurrencyPipe, NgIf} from "@angular/common";
import {PaymentFormComponent} from "../../../security/component/payment-form/payment-form.component";
import {ProgressStepsComponent} from "../../../shared/ui/progress-steps/progress-steps.component";
import {AppNode} from "@shared-routes";
import {SummaryCartComponent} from "../../component/summary-cart/summary-cart.component";
import {ApplyPromoCodeComponent} from "../../../order/component/apply-promo-code/apply-promo-code.component";

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    ProductItemSubComponent,
    CurrencyPipe,
    NgIf,
    PaymentFormComponent,
    ProgressStepsComponent,
    SummaryCartComponent,
    ApplyPromoCodeComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  protected readonly securityService: SecurityService = inject(SecurityService);
  protected cartItems: CartItem[] = [];
  protected calculatedTotal: number = 0;
  protected calculatedTvafees: number = 0;
  protected calculatedTotalOrder: number = 0;
  protected readonly shippingFees: number = 10;

  constructor() {
    this.securityService.fetchCart().subscribe()
    effect(() => {
      // Récupérer et trier les items par ID
      this.cartItems = [...this.securityService.cart$().items].sort((a, b) =>
        a.idCartItem.localeCompare(b.idCartItem)
      );
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
  protected trackByCartItemId(_index: number, item: CartItem): string {
    return item.idCartItem;
  }

  private updateCalculations(): void {
    // Calcul du total en tenant compte des promotions
    this.calculatedTotal = this.cartItems.reduce((total, item) => {
      const price = item.product.is_promo ? item.product.price_discounted : item.product.initial_price;
      return total + (item.quantity * price);
    }, 0);

    // Calcul de la TVA et du total de la commande
    this.calculatedTvafees = this.calculatedTotal * 0.2; // TVA 20%
    this.calculatedTotalOrder = this.calculatedTotal + this.shippingFees + this.calculatedTvafees;
  }

  protected confirmCart(): void {
    this.securityService.navigate(AppNode.CONFIRM_ORDER);
  }
}
