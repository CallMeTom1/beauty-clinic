import {Component, computed, effect, inject, Injector, OnInit, runInInjectionContext} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {CartItem} from "../../../security/data/model/cart/cart-item.business";
import {AppNode, AppRoutes} from "@shared-routes";
import {ModalService} from "../modal.service";

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
  private readonly modalService = inject(ModalService);
  private readonly injector = inject(Injector);

  dropdownOpen: boolean = false;
  cartItems: CartItem[] = [];
  productAddedDetected: boolean = false;
  private closeTimeout: any;
  private messageTimeout: any;
  private previousTotalQuantity: number = 0;
  private effectInitialized = false;

  // Computed property for authentication status
  protected readonly isAuthenticated = computed(() =>
    this.securityService.account$().idUser !== ''
  );

  constructor() {
    // Fetch initial cart data only if user is authenticated
    if (this.isAuthenticated()) {
      this.securityService.fetchCart().subscribe(() => {
        setTimeout(() => {
          this.initializeEffect();
        }, 100);
      });
    }
  }

  private initializeEffect() {
    if (this.effectInitialized) return;

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const newItems = this.securityService.cart$().items;
        const newTotalQuantity = this.calculateTotalQuantity(newItems);

        if (this.effectInitialized && newTotalQuantity > this.previousTotalQuantity) {
          this.showAddedToCartMessage();
        }

        this.effectInitialized = true;
        this.previousTotalQuantity = newTotalQuantity;
        this.cartItems = newItems;
      });
    });
  }

  private calculateTotalQuantity(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  private showAddedToCartMessage() {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    if (this.closeTimeout) clearTimeout(this.closeTimeout);

    this.dropdownOpen = true;
    this.productAddedDetected = true;

    this.messageTimeout = setTimeout(() => {
      this.productAddedDetected = false;
    }, 3000);

    this.closeTimeout = setTimeout(() => {
      this.dropdownOpen = false;
    }, 5000);
  }

  onMouseEnter() {
    // Only open dropdown if user is authenticated
    if (!this.isAuthenticated()) {
      return;
    }

    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.dropdownOpen = true;
  }

  onMouseLeave() {
    this.closeTimeout = setTimeout(() => {
      this.dropdownOpen = false;
    }, 300);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + ((item.product.is_promo ? item.product.price_discounted : item.product.initial_price) * item.quantity);
    }, 0);
  }

  navigateCart() {
    if (!this.isAuthenticated()) {
      console.log('Opening auth modal from cart navigation');
      this.modalService.openAuthModal({
        title: 'Connexion requise',
        message: 'Pour accéder à votre panier, veuillez vous connecter ou créer un compte.'
      });
      this.dropdownOpen = false;
      return;
    }

    this.securityService.navigate(AppNode.CART);
  }
}
