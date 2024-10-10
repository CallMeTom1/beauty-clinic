import { Component } from '@angular/core';
import {ManageProductComponent} from "../../component/manage-product/manage-product.component";

@Component({
  selector: 'app-admin-product-page',
  standalone: true,
  imports: [
    ManageProductComponent
  ],
  templateUrl: './admin-product-page.component.html',
  styleUrl: './admin-product-page.component.scss'
})
export class AdminProductPageComponent {

}
