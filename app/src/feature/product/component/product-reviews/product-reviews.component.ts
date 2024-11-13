import { Component, computed, inject, Input, signal } from '@angular/core';
import { Product } from "../../../security/data/model/product/product.business";
import { SecurityService } from "@feature-security";
import { ModalService } from "../../../shared/ui/modal.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Review } from "../../../security/data/model/review/review.business";
import { DatePipe } from "@angular/common";

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
  @Input({ required: true }) set product(value: Product) {
    this._product = value;
    this.reviews.set(value.reviews || []);
  }
  get product(): Product {
    return this._product;
  }
  private _product!: Product;

  protected readonly securityService = inject(SecurityService);
  private readonly modalService = inject(ModalService);
  private readonly fb = inject(FormBuilder);

  reviews = signal<Review[]>([]);
  currentRating = signal(0);
  hoverRating = signal(0);
  editingReview: Review | null = null;

  reviewForm: FormGroup = this.fb.group({
    comment: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1000)
    ]]
  });

  protected readonly sortedReviews = computed(() => {
    return [...this.reviews()].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  protected readonly averageRating = computed(() => {
    if (!this.reviews().length) return 0;
    const total = this.reviews().reduce((sum, review) => sum + review.rating, 0);
    return +(total / this.reviews().length).toFixed(1);
  });

  protected readonly isUserLoggedIn = computed(() => {
    return !!this.securityService.account$()?.idUser;
  });

  protected readonly hasUserReviewed = computed(() => {
    const userId = this.securityService.account$()?.idUser;
    return this.reviews().some(review => review.user.idUser === userId);
  });

  protected readonly userReview = computed(() => {
    const userId = this.securityService.account$()?.idUser;
    return this.reviews().find(review => review.user.idUser === userId);
  });

  setRating(rating: number): void {
    this.currentRating.set(rating);
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.currentRating()) {
      const payload = {
        rating: this.currentRating(),
        comment: this.reviewForm.get('comment')?.value,
        product_id: this.product.product_id
      };

      if (this.editingReview) {
        this.securityService.updateReview({
          review_id: this.editingReview.review_id,
          ...payload
        }).subscribe({
          next: (response) => {
            if (response.result && response.data) {
              const updatedReviews = this.reviews().map(review =>
                review.review_id === response.data.review_id ? response.data : review
              );
              this.reviews.set(updatedReviews);
              this.resetForm();
            }
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'avis', error);
          }
        });
      } else {
        this.securityService.createReview(payload).subscribe({
          next: (response) => {
            if (response.result && response.data) {
              this.reviews.set([response.data, ...this.reviews()]);
              this.resetForm();
            }
          },
          error: (error) => {
            console.error('Erreur lors de la création de l\'avis', error);
          }
        });
      }
    }
  }

  editReview(review: Review): void {
    this.editingReview = review;
    this.currentRating.set(review.rating);
    this.reviewForm.patchValue({
      comment: review.comment
    });
  }

  deleteReview(reviewToDelete: Review): void {
    this.securityService.deleteReview({
      review_id: reviewToDelete.review_id
    }).subscribe({
      next: () => {
        const updatedReviews = this.reviews()
          .filter(review => review.review_id !== reviewToDelete.review_id);
        this.reviews.set(updatedReviews);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de l\'avis', error);
      }
    });
  }

  private resetForm(): void {
    this.reviewForm.reset();
    this.currentRating.set(0);
    this.editingReview = null;
  }

  openAuthModal(): void {
    this.modalService.openAuthModal({
      title: 'Connexion requise',
      message: 'Pour laisser un avis sur ce produit, veuillez vous connecter ou créer un compte.'
    });
  }

  get isEditing(): boolean {
    return !!this.editingReview;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}
