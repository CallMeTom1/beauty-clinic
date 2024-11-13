import {Component, computed, inject, Input, Signal} from '@angular/core';
import {Product} from "../../../security/data/model/product/product.business";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {AddCartItemPayload} from "../../../security/data/payload/cart/add-cart-item.payload";
import {RemoveFromWishlistPayload} from "../../../security/data/payload/wishlist/remowe-from-wishlist.payload";
import {AddToWishlistPayload} from "../../../security/data/payload/wishlist/add-to-wishlist.payload";
import {WishlistButtonComponent} from "../../../shared/ui/wishlist-button/wishlist-button.component";
import {AppRoutes} from "@shared-routes";
import {ModalService} from "../../../shared/ui/modal.service";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    NgClass,
    NgForOf,
    WishlistButtonComponent
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  protected readonly securityService: SecurityService = inject(SecurityService);
  private readonly modalService = inject(ModalService);

  protected readonly isAuthenticated = computed(() =>
    this.securityService.account$().idUser !== ''
  );

  getAverageRating(): number {
    if (!this.product.reviews || this.product.reviews.length === 0) return 0;
    const sum = this.product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.product.reviews.length;
  }

  getStarsArray(): number[] {
    const rating = this.getAverageRating();
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  addProductToCart(product: Product): void {
    if (this.isAuthenticated()) {
      const payload: AddCartItemPayload = {
        productId: product.product_id!,
        quantity: 1
      };
      this.securityService.addProductToCart(payload).subscribe({
        next: () => {
          console.log('Produit ajouté au panier avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du produit au panier:', err);
        }
      });
    } else {
      this.modalService.openAuthModal({
        title: 'Connexion requise',
        message: 'Pour ajouter des produits à votre panier, veuillez vous connecter ou créer un compte.'
      });
    }
  }

  getProductImage(product: Product): string {
    if (product.product_image && typeof product.product_image === 'string') {
      return product.product_image;
    }
    return './assets/default-product.png';
  }

  navigateToDetail(): void {
    const formattedName = this.formatProductName(this.product.name);
    this.securityService.navigate(`/produits/${formattedName}`);
  }

  private formatProductName(name: string): string {
    return name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
