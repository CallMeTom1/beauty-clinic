import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ApiResponse} from "@shared-api";
import {SecurityService} from "@feature-security";

@Component({
  selector: 'app-apply-promo-code',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './apply-promo-code.component.html',
  styleUrl: './apply-promo-code.component.scss'
})
export class ApplyPromoCodeComponent {
  protected readonly securityService = inject(SecurityService);

  promoCodeForm = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ])
  });

  loading = false;
  hasPromoCode = false;
  currentDiscount = 0;

  applyPromoCode(): void {
    if (this.promoCodeForm.valid && !this.loading) {
      this.loading = true;

      const payload = {
        code: this.promoCodeForm.get('code')?.value || ''
      };
      console.log(payload);

      this.securityService.applyPromoCodeToCart(payload).subscribe({
        next: (response: ApiResponse) => {
          if (response.result) {
            this.hasPromoCode = true;
            this.currentDiscount = response.data.promoCode?.percentage || 0;
            this.promoCodeForm.reset();
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  removePromoCode(): void {
    this.loading = true;

    this.securityService.removePromoCodeFromCart().subscribe({
      next: (response: ApiResponse) => {
        if (response.result) {
          this.hasPromoCode = false;
          this.currentDiscount = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
