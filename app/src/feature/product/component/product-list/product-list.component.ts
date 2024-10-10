import {Component, inject} from '@angular/core';
import {ProductService} from "../../product.service";
import {ProductCardComponent} from "../product-card/product-card.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductCardComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  protected productService: ProductService = inject(ProductService);

}
