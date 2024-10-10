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

  selectCategory(cat: CategoryProduct) {
    this.productService.categorySelected$.set(cat);
  }

  isSelected(cat: CategoryProduct): boolean {
    return this.productService.categorySelected$() === cat;
  }

}
