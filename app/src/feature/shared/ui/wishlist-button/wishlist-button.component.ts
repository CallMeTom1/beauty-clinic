import {Component, computed, inject, Input} from '@angular/core';
import {SecurityService} from "@feature-security";
import {RemoveFromWishlistPayload} from "../../../security/data/payload/wishlist/remowe-from-wishlist.payload";
import {AddToWishlistPayload} from "../../../security/data/payload/wishlist/add-to-wishlist.payload";
import {ModalComponent} from "../modal/modal/modal.component";
import {NgIf} from "@angular/common";
import {ModalService} from "../modal.service";

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [
    ModalComponent,
    NgIf
  ],
  templateUrl: './wishlist-button.component.html',
  styleUrl: './wishlist-button.component.scss'
})
export class WishlistButtonComponent {
  @Input() productId!: string;
  @Input() inProductCard: boolean = true; // Par défaut, on considère qu'il est dans une carte produit

  protected readonly securityService: SecurityService = inject(SecurityService);
  private readonly modalService = inject(ModalService);

  protected readonly wishlist = computed(() => {
    return this.securityService.wishList$();
  });

  protected readonly isInWishlist = computed(() => {
    return this.wishlist()?.products?.some(p => p.product_id === this.productId) ?? false;
  });

  protected readonly userId = computed(() => {
    return this.securityService.account$()?.idUser || '';
  });

  handleWishlistClick(event: Event): void {
    event.stopPropagation();
    console.log('Wishlist click, userId:', this.userId());

    if (this.userId() === '') {
      console.log('Opening auth modal from wishlist button');
      this.modalService.openAuthModal();
      return;
    }

    this.toggleWishlist();
  }

  private toggleWishlist(): void {
    if (this.isInWishlist()) {
      const payload: RemoveFromWishlistPayload = {
        productId: this.productId
      };
      this.securityService.removeFromWishList(payload).subscribe({
        next: () => {
          this.securityService.fetchWishlist().subscribe();
        }
      });
    } else {
      const payload: AddToWishlistPayload = {
        productId: this.productId
      };
      this.securityService.addToWishList(payload).subscribe({
        next: () => {
          this.securityService.fetchWishlist().subscribe();
        }
      });
    }
  }
}
