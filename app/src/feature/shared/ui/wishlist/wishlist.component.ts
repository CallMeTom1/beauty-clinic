import {Component, computed, effect, inject, signal} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {Wishlist} from "../../../security/data/model/wishlist/wishlist.business";
import {SecurityService} from "@feature-security";
import {Care} from "../../../security/data/model/care/care.business";
import {Product} from "../../../security/data/model/product/product.business";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  protected readonly securityService: SecurityService = inject(SecurityService);
  dropdownOpen = signal(false);
  wishlist = signal<Wishlist | null>(null);
  private closeTimeout: any;

  protected readonly validProducts = computed(() => {
    return this.wishlist()?.products?.filter(p => p.product_id) || [];
  });

  protected readonly validCares = computed(() => {
    return this.wishlist()?.cares?.filter(c => c.care_id) || [];
  });

  protected readonly totalItems = computed(() => {
    return this.validProducts().length + this.validCares().length;
  });

  constructor() {
    if(this.securityService.account$().idUser != '') {
      this.securityService.fetchWishlist().subscribe();
    }
    effect(() => {
      this.wishlist.set(this.securityService.wishList$());
    }, { allowSignalWrites: true });
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

  onMouseEnter() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.dropdownOpen.set(true);
  }

  onMouseLeave() {
    this.closeTimeout = setTimeout(() => {
      this.dropdownOpen.set(false);
    }, 300);
  }

  isWishlistEmpty(): boolean {
    return this.totalItems() === 0;
  }

  hasProducts(): boolean {
    return this.validProducts().length > 0;
  }

  hasCares(): boolean {
    return this.validCares().length > 0;
  }

  getValidProducts(): Product[] {
    return this.validProducts();
  }

  getValidCares(): Care[] {
    return this.validCares();
  }

  getTotalItems(): number {
    return this.totalItems();
  }

  navigateToWishlist(): void {
    this.securityService.navigate('wishlist');
  }
}
