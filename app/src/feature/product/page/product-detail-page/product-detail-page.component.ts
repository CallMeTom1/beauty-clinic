import {Component, effect, inject, signal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../product.service";
import {SecurityService} from "@feature-security";
import {Product} from "../../../security/data/model/product/product.business";
import {CurrencyPipe} from "@angular/common";
import {AddToWishlistPayload} from "../../../security/data/payload/wishlist/add-to-wishlist.payload";
import {RemoveFromWishlistPayload} from "../../../security/data/payload/wishlist/remowe-from-wishlist.payload";
import {ProductReviewsComponent} from "../../component/product-reviews/product-reviews.component";
import {HomeProductSliderComponent} from "../../../home/component/home-product-slider/home-product-slider.component";
import {ProductSelectionComponent} from "../../../home/component/product-selection/product-selection.component";
import {WishlistButtonComponent} from "../../../shared/ui/wishlist-button/wishlist-button.component";

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    ProductReviewsComponent,
    HomeProductSliderComponent,
    ProductSelectionComponent,
    WishlistButtonComponent
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss'
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private securityService = inject(SecurityService);

  quantity = signal(1);
  product = signal<Product | null>(null);

  constructor() {
    // Ajout de l'option allowSignalWrites
    effect(() => {
      const productName = this.route.snapshot.params['productName'];
      const product = this.productService.products$()
        .find(p => this.formatProductName(p.name) === productName);
      this.product.set(product || null);
    }, { allowSignalWrites: true }); // Ajout de cette option
  }

  private formatProductName(name: string): string {
    return name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  incrementQuantity() {
    if (this.quantity() < (this.product()?.quantity_stored || 0)) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.securityService.addProductToCart({
        productId: product.product_id,
        quantity: this.quantity()
      }).subscribe();
    }
  }

  isInWishlist(): boolean {
    const product = this.product();
    if (!product) return false;

    const wishlist = this.securityService.wishList$();
    return wishlist.products.some(p => p.product_id === product.product_id);
  }

  toggleWishlist() {
    const product = this.product();
    if (!product) return;

    if (this.isInWishlist()) {
      const payload: RemoveFromWishlistPayload = { productId: product.product_id }
      this.securityService.removeFromWishList(payload).subscribe();
    } else {
      const payload: AddToWishlistPayload = { productId: product.product_id }
      this.securityService.addToWishList(payload).subscribe();
    }
  }
}
