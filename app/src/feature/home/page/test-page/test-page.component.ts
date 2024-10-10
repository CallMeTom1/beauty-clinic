import {Component, effect, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatingLabelInputComponent, FormcontrolSimpleConfig} from "@shared-ui";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {SecurityService} from "@feature-security";
import {ProductCategoryCardComponent} from "../../../shared/ui/product-category-card/product-category-card.component";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {environment} from "@env";

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputComponent,
    FloatingLabelInputTestComponent,
    ProductCategoryCardComponent
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss'
})
export class TestPageComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected categories: CategoryProduct[] = [];

  constructor() {
    effect(() => {
      this.categories = this.securityService.CategoryProducts$(); // Réagit aux changements dans le signal
      console.log('Categories updated:', this.categories); // Vérifiez dans la console
    });
  }

}
