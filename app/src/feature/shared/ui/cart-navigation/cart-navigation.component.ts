import {Component, effect, inject, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {CartItem} from "../../../security/data/model/cart/cart-item.business";

@Component({
  selector: 'app-cart-navigation',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe
],
  templateUrl: './cart-navigation.component.html',
  styleUrl: './cart-navigation.component.scss'
})
export class CartNavigationComponent {

  protected readonly securityService: SecurityService = inject(SecurityService);

  dropdownOpen: boolean = false;
  cartItems: CartItem[] = [];

  constructor() {
    this.securityService.fetchCart().subscribe()
    effect(() => {
      this.cartItems = this.securityService.cart$().items;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
