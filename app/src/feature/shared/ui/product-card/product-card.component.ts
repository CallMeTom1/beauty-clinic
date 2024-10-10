import {Component, inject, Input} from '@angular/core';
import {Product} from "../../../security/data/model/product/product.business";
import {SecurityService} from "@feature-security";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;

  protected securityService: SecurityService = inject(SecurityService);
  navigateToProduct() {
    this.securityService.navigate('/product/{productId}');
  }

  addToCart(event: Event) {
    event.stopPropagation(); // Empêche la navigation vers la page du produit
    // Ajoutez ici la logique pour ajouter le produit au panier
    console.log('Produit ajouté au panier:', this.product.name);
  }

}
