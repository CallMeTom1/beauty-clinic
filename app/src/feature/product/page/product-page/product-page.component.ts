import { Component } from '@angular/core';
import {
  ProductCategoryListSelectorComponent
} from "../../component/product-category-list-selector/product-category-list-selector.component";
import {ProductSearchComponent} from "../../component/product-search/product-search.component";
import {ProductListComponent} from "../../component/product-list/product-list.component";

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    ProductCategoryListSelectorComponent,
    ProductSearchComponent,
    ProductListComponent
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

}
