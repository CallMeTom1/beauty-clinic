import {Component, effect, inject} from '@angular/core';
import {ProductItemSubComponent} from "../../component/product-item-sub/product-item-sub.component";
import {SecurityService} from "@feature-security";
import {CartItem} from "../../../security/data/model/cart/cart-item.business";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    ProductItemSubComponent,
    CurrencyPipe
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
    effect(() => {
      this.cartItems = this.securityService.cart$().items;
      this.updateCalculations();
    });
  }

  private updateCalculations(): void {
    this.calculatedTotal = this.cartItems.reduce((total, item) => total + (item.quantity * item.product.price), 0);
    this.calculatedTvafees = this.calculatedTotal * 0.2; // Assuming 20% TVA
    this.calculatedTotalOrder = this.calculatedTotal + this.shippingFees;
  }

  protected onOrder(): void {
    // Implement order logic here
    console.log('Order placed');
    // You might want to call a service method here to process the order
  }
}
