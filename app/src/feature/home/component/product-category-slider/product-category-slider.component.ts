import {Component, effect, inject} from '@angular/core';
import {SecurityService} from "@feature-security";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {CareCardComponent} from "../../../shared/ui/care-card/care-card.component";
import {ProductCategoryCardComponent} from "../../../shared/ui/product-category-card/product-category-card.component";

@Component({
  selector: 'app-product-category-slider',
  standalone: true,
  imports: [
    CareCardComponent,
    ProductCategoryCardComponent
  ],
  templateUrl: './product-category-slider.component.html',
  styleUrl: './product-category-slider.component.scss'
})
export class ProductCategorySliderComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected categories: CategoryProduct[] = [];

  constructor() {
    effect(() => {
      this.categories = this.securityService.CategoryProducts$(); // Réagit aux changements dans le signal
      console.log('Categories updated:', this.categories); // Vérifiez dans la console
    });
  }
}
