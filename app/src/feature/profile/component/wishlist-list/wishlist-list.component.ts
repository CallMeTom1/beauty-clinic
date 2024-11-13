import {Component, computed, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {RouterLink} from "@angular/router";
import {CurrencyPipe} from "@angular/common";
import {RemoveFromWishlistPayload} from "../../../security/data/payload/wishlist/remowe-from-wishlist.payload";
import {AddCartItemPayload} from "../../../security/data/payload/cart/add-cart-item.payload";
import {AppRoutes} from "@shared-routes";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-wishlist-list',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './wishlist-list.component.html',
  styleUrl: './wishlist-list.component.scss'
})
export class WishlistListComponent implements OnInit {
  protected securityService = inject(SecurityService);

  protected readonly validProducts = computed(() =>
    this.securityService.wishList$()?.products?.filter(p => p.product_id) || []
  );

  protected readonly validCares = computed(() =>
    this.securityService.wishList$()?.cares?.filter(c => c.care_id) || []
  );

  protected readonly totalItems = computed(() =>
    this.validProducts().length + this.validCares().length
  );

  ngOnInit() {
    if (this.securityService.account$().idUser) {
      this.securityService.fetchWishlist().subscribe();
    }
  }

  formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h${remainingMinutes}min`
        : `${hours}h`;
    }
    return `${minutes}min`;
  }

  removeFromWishlist(type: 'product' | 'care', id: string) {
    const payload: RemoveFromWishlistPayload = type === 'product'
      ? { productId: id }
      : { careId: id };

    // Utiliser switchMap pour enchaîner les appels et mettre à jour la wishlist
    this.securityService.removeFromWishList(payload)
      .pipe(
        switchMap(() => this.securityService.fetchWishlist())
      )
      .subscribe();
  }

  addToCart(type: 'product' | 'care', id: string) {
    if (type === 'product') {
      const payload: AddCartItemPayload = {
        productId: id,
        quantity: 1
      };
      this.securityService.addProductToCart(payload).subscribe();
    } else {
      this.securityService.navigate(`cares/${id}/booking`);
    }
  }

  navigateToProduct(): void {
    return this.securityService.navigate(AppRoutes.PRODUCTS)
  }

  navigateToCare(): void {
    return this.securityService.navigate(AppRoutes.CARES)
  }
}
