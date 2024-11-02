import {Component, effect, inject} from '@angular/core';
import {SecurityService} from "@feature-security";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {CareCardComponent} from "../../../shared/ui/care-card/care-card.component";

@Component({
  selector: 'app-product-category-slider',
  standalone: true,
  imports: [
    CareCardComponent,
  ],
  templateUrl: './product-category-slider.component.html',
  styleUrl: './product-category-slider.component.scss'
})
export class ProductCategorySliderComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected categories: CategoryProduct[] = [];

  constructor() {
    this.securityService.fetchCategoryProductsPublished().subscribe();
    effect(() => {
      this.categories = this.securityService.CategoryProductsPublished$(); // Réagit aux changements dans le signal
      console.log('Categories updated:', this.categories); // Vérifiez dans la console
    });
  }
}
