import {Component, Input} from '@angular/core';
import {Product} from "../../../security/data/model/product/product.business";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {CurrencyPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;

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
