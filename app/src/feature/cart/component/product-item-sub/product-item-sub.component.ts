import {Component, inject, Input, signal, WritableSignal} from '@angular/core';
import {CartItem} from "../../../security/data/model/cart/cart-item.business";
import {SecurityService} from "@feature-security";
import {TranslateService} from "@ngx-translate/core";
import {RemoveCartItemPayload} from "../../../security/data/payload/cart/remove-cart-item.payload";
import {CurrencyPipe, NgIf} from "@angular/common";
import {UpdateCartItemPayload} from "../../../security/data/payload/cart/update-cart-item.payload";

@Component({
  selector: 'app-product-item-sub',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './product-item-sub.component.html',
  styleUrl: './product-item-sub.component.scss'
})
export class ProductItemSubComponent {
  @Input() cartItem!: CartItem;


  protected translateService: TranslateService = inject(TranslateService);
  protected readonly securityService: SecurityService = inject(SecurityService);
  protected message: WritableSignal<string | null> = signal(null)



  // Méthode pour supprimer un article du panier
  protected removeCartItem(cartItem: CartItem) {
    const payload: RemoveCartItemPayload = {
      cartItemId: cartItem.idCartItem
    };
    console.log()
    this.securityService.removeCartItem(payload).subscribe(() => {
      console.log('Article supprimé du panier');
    });
  }

  protected canDecrease(cartItem: CartItem): boolean {
    return cartItem.quantity > cartItem.product.minQuantity;
  }

  // Méthode pour vérifier si on peut augmenter la quantité
  protected canIncrease(cartItem: CartItem): boolean {
    return cartItem.quantity < cartItem.product.maxQuantity &&
      cartItem.quantity < cartItem.product.quantity_stored;
  }

  // Méthode pour calculer le total pour chaque item
  protected getTotal(cartItem: CartItem): number {
    const unitPrice = cartItem.product.is_promo
      ? cartItem.product.price_discounted
      : cartItem.product.initial_price;
    return unitPrice * cartItem.quantity;
  }

  // Méthode pour modifier la quantité d'un article
  protected changeQuantity(cartItem: CartItem, quantity: number): void {
    // Vérifier que la quantité est dans les limites
    const newQuantity = Math.min(
      Math.max(quantity, cartItem.product.minQuantity),
      Math.min(cartItem.product.maxQuantity, cartItem.product.quantity_stored)
    );

    if (newQuantity !== cartItem.quantity) {
      const payload: UpdateCartItemPayload = {
        cartItemId: cartItem.idCartItem,
        newQuantity: newQuantity
      };
      this.securityService.changeQuantity(payload).subscribe(() => {
        console.log('Quantité modifiée');
      });
    }
  }

  // Méthode pour obtenir l'image du produit
  protected getImage(cartItem: CartItem): string {
    return cartItem.product.product_image || './assets/default-product-image.png'; // Image par défaut si non disponible
  }

  protected readonly Math = Math;
}
