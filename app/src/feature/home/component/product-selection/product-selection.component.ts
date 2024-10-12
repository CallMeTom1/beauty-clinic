import {Component, inject} from '@angular/core';
import {SecurityService} from "@feature-security";
import {ProductCardComponent} from "../../../product/component/product-card/product-card.component";

@Component({
  selector: 'app-product-selection',
  standalone: true,
  imports: [
    ProductCardComponent,
    ProductCardComponent
  ],
  templateUrl: './product-selection.component.html',
  styleUrl: './product-selection.component.scss'
})
export class ProductSelectionComponent {
  protected securityService: SecurityService = inject(SecurityService);

  constructor() {
    this.securityService.fetchProductsPublished().subscribe();
  }

}
