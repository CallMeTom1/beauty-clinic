import {Component, computed, effect, inject, signal} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {Wishlist} from "../../../security/data/model/wishlist/wishlist.business";
import {SecurityService} from "@feature-security";
import {Care} from "../../../security/data/model/care/care.business";
import {Product} from "../../../security/data/model/product/product.business";
import {ModalService} from "../modal.service";
import {AppRoutes} from "@shared-routes";

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
  private readonly modalService = inject(ModalService);

  dropdownOpen = signal(false);
  wishlist = signal<Wishlist | null>(null);
  private closeTimeout: any;

  // Signals dérivés
  protected readonly validProducts = computed(() =>
    this.wishlist()?.products?.filter(p => p.product_id) || []
  );

  protected readonly validCares = computed(() =>
    this.wishlist()?.cares?.filter(c => c.care_id) || []
  );

  protected readonly totalItems = computed(() =>
    this.validProducts().length + this.validCares().length
  );

  protected readonly userId = computed(() =>
    this.securityService.account$()?.idUser || ''
  );

  protected readonly isAuthenticated = computed(() =>
    this.userId() !== ''
  );

  constructor() {
    // Initialiser la wishlist si l'utilisateur est connecté
    if (this.isAuthenticated()) {
      this.securityService.fetchWishlist().subscribe();
    }

    // Observer les changements de la wishlist
    effect(() => {
      this.wishlist.set(this.securityService.wishList$());
    }, { allowSignalWrites: true });
  }

  onMouseEnter(): void {
    // N'ouvrir le dropdown que si l'utilisateur est authentifié
    if (!this.isAuthenticated()) {
      return;
    }

    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.dropdownOpen.set(true);
  }

  onMouseLeave(): void {
    this.closeTimeout = setTimeout(() => {
      this.dropdownOpen.set(false);
    }, 300);
  }

  navigateToWishlist(): void {
    if (!this.isAuthenticated()) {
      console.log('Opening auth modal from wishlist navigation');
      this.modalService.openAuthModal(); // Utilisera le message par défaut pour la wishlist
      this.dropdownOpen.set(false);
      return;
    }

    this.securityService.navigate(AppRoutes.MY_WISHLIST);
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

  // Méthodes utilitaires
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
}
