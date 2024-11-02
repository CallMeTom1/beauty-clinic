import {Component, effect, inject, OnInit} from '@angular/core';
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {NgClass} from "@angular/common";
import {ProductService} from "../../product.service";

@Component({
  selector: 'app-product-category-list-selector',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './product-category-list-selector.component.html',
  styleUrl: './product-category-list-selector.component.scss'
})
export class ProductCategoryListSelectorComponent {
  protected productService: ProductService = inject(ProductService);

  selectCategory(category: CategoryProduct | null) {
    // Si on clique sur la catégorie déjà sélectionnée ou sur "Tous" quand aucune catégorie n'est sélectionnée
    if (this.isSelected(category)) {
      this.productService.categorySelected$.set(null); // Déselectionner
    } else {
      this.productService.categorySelected$.set(category); // Sélectionner nouvelle catégorie
    }
  }

  isSelected(category: CategoryProduct | null): boolean {
    const currentSelected = this.productService.categorySelected$();
    if (!category && !currentSelected) return true;
    if (!category || !currentSelected) return false;
    return currentSelected.product_category_id === category.product_category_id;
  }

}
