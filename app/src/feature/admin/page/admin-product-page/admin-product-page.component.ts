import { Component } from '@angular/core';
import {ManageProductComponent} from "../../component/manage-product/manage-product.component";
import {
  ManageProductCategoryComponent
} from "../../component/manage-product-category/manage-product-category.component";
import {
  ManagePromotionalCodeComponent
} from "../../component/manage-promotional-code/manage-promotional-code.component";

@Component({
  selector: 'app-admin-product-page',
  standalone: true,
  imports: [
    ManageProductComponent,
    ManageProductCategoryComponent,
    ManagePromotionalCodeComponent
  ],
  templateUrl: './admin-product-page.component.html',
  styleUrl: './admin-product-page.component.scss'
})
export class AdminProductPageComponent {

}
