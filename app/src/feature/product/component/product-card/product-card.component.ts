import {Component, inject, Input} from '@angular/core';
import {Product} from "../../../security/data/model/product/product.business";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {CurrencyPipe, NgClass, NgIf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {AddCartItemPayload} from "../../../security/data/payload/cart/add-cart-item.payload";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  protected readonly securityService: SecurityService = inject(SecurityService);

  addProductToCart(product: Product): void {
    // Utilisation de product_id à la place de id
    const payload: AddCartItemPayload = {
      productId: product.product_id!,  // Utilisation de product_id ici
      quantity: 1  // Vous pouvez permettre de choisir la quantité
    };
    this.securityService.addProductToCart(payload).subscribe({
      next: () => {
        console.log('Produit ajouté au panier avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du produit au panier:', err);
      }
    });
  }


  getProductImage(product: Product): string {
    if (product.product_image && typeof product.product_image === 'string') {
      // Si l'image est déjà encodée en base64, on la retourne directement
      return product.product_image;
    } else {
      // Si aucune image n'est disponible, on retourne une image par défaut
      return './assets/default-category.png';
    }
  }

  getDiscountedPrice(product: Product): number {
    if (typeof product.price === 'number' && typeof product.promo_percentage === 'number') {
      return product.price - (product.price * product.promo_percentage / 100);
    } else {
      console.warn('Price or promo percentage is invalid for product:', product);
      return product.price; // Retourne le prix normal en cas de problème
    }
  }


}
