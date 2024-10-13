import {Component, inject, Input} from '@angular/core';
import {CartItem} from "../../../security/data/model/cart/cart-item.business";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {SecurityService} from "@feature-security";
import {TranslateService} from "@ngx-translate/core";
import {RemoveCartItemPayload} from "../../../security/data/payload/cart/remove-cart-item.payload";
import {CurrencyPipe} from "@angular/common";
import {UpdateCartItemPayload} from "../../../security/data/payload/cart/update-cart-item.payload";

@Component({
  selector: 'app-product-item-sub',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  templateUrl: './product-item-sub.component.html',
  styleUrl: './product-item-sub.component.scss'
})
export class ProductItemSubComponent {
  @Input() cartItem!: CartItem;

  protected translateService: TranslateService = inject(TranslateService);
  protected readonly securityService: SecurityService = inject(SecurityService);

  // Méthode pour calculer le total pour chaque item (prix unitaire * quantité)
  protected getTotal(cartItem: CartItem): number {
    return cartItem.product.price * cartItem.quantity;
  }

  // Méthode pour supprimer un article du panier
  protected removeCartItem(cartItem: CartItem) {
    const payload: RemoveCartItemPayload = {
      cartItemId: cartItem.idCartItem
    };
    this.securityService.removeCartItem(payload).subscribe(() => {
      console.log('Article supprimé du panier');
    });
  }

  // Méthode pour modifier la quantité d'un article
  protected changeQuantity(cartItem: CartItem, quantity: number): void {
    if (quantity > 0) {
      const payload: UpdateCartItemPayload = { cartItemId: cartItem.idCartItem, newQuantity: quantity };
      this.securityService.changeQuantity(payload).subscribe(() => {
        console.log('Quantité modifiée');
      });
    }
  }

  // Méthode pour obtenir l'image du produit
  protected getImage(cartItem: CartItem): string {
    return cartItem.product.product_image || './assets/default-product-image.png'; // Image par défaut si non disponible
  }
}
