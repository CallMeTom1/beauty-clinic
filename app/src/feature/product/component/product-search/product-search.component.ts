import {Component, effect, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {ProductService} from "../../product.service";
import {Product} from "../../../security/data/model/product/product.business";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent {
  protected productService = inject(ProductService);

}
