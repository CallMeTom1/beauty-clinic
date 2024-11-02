import {Component, computed, inject, Input, signal} from '@angular/core';
import {Product} from "../../../security/data/model/product/product.business";
import {SecurityService} from "@feature-security";
import {ModalService} from "../../../shared/ui/modal.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Review} from "../../../security/data/model/review/review.business";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent {
  @Input({ required: true }) product!: Product;

  private readonly securityService = inject(SecurityService);
  private readonly modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  reviews: Review[] = [];
  currentRating = signal(0);
  hoverRating = signal(0);

  reviewForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  protected readonly sortedReviews = computed(() => {
    return [...this.product.reviews].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  protected readonly averageRating = computed(() => {
    if (!this.product.reviews?.length) return 0;
    const total = this.product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return +(total / this.product.reviews.length).toFixed(1);
  });

  protected readonly isUserLoggedIn = computed(() => {
    return !!this.securityService.account$()?.idUser;
  });

  protected readonly hasUserReviewed = computed(() => {
    const userId = this.securityService.account$()?.idUser;
    return this.product.reviews?.some(review => review.user.idUser === userId);
  });

  setRating(rating: number): void {
    this.currentRating.set(rating);
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.currentRating()) {
      // Implémentation de la soumission de l'avis
      const review = {
        rating: this.currentRating(),
        comment: this.reviewForm.get('comment')?.value,
        product_id: this.product.product_id
      };

      // TODO: Appel API pour soumettre l'avis
      console.log('Review submitted:', review);

      // Reset form
      this.reviewForm.reset();
      this.currentRating.set(0);
    }
  }

  openAuthModal(): void {
    this.modalService.openAuthModal();
  }
}
