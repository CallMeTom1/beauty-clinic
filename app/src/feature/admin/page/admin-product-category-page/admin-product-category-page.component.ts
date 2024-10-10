import { Component } from '@angular/core';
import {
  ManageProductCategoryComponent
} from "../../component/manage-product-category/manage-product-category.component";

@Component({
  selector: 'app-admin-product-category-page',
  standalone: true,
  imports: [
    ManageProductCategoryComponent
  ],
  templateUrl: './admin-product-category-page.component.html',
  styleUrl: './admin-product-category-page.component.scss'
})
export class AdminProductCategoryPageComponent {

}
