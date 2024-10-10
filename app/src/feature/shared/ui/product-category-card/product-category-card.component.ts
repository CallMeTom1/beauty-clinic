import {Component, inject, Input, OnInit} from '@angular/core';
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {SecurityService} from "@feature-security";

@Component({
  selector: 'app-product-category-card',
  standalone: true,
  imports: [],
  templateUrl: './product-category-card.component.html',
  styleUrls: ['./product-category-card.component.scss']
})
export class ProductCategoryCardComponent {
  @Input() productCategory!: CategoryProduct;
  protected securityService: SecurityService = inject(SecurityService);


  navigateToCategory() {
    this.securityService.navigate(`/category/${this.productCategory.product_category_id}`);
  }

  getCategoryImage(): string {
    const image = this.productCategory.product_category_image;

    if (typeof image === 'string') {
      // Si l'image est déjà encodée en base64, on la retourne directement
      return image;
    } else {
      // Si aucune image n'est disponible, on retourne une image par défaut
      return './assets/default-category.png';
    }
  }

}
