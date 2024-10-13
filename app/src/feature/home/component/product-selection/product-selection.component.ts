import {Component, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {ProductCardComponent} from "../../../product/component/product-card/product-card.component";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-product-selection',
  standalone: true,
  imports: [
    ProductCardComponent,
    ProductCardComponent,
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './product-selection.component.html',
  styleUrl: './product-selection.component.scss'
})
export class ProductSelectionComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  products: any[] = [];
  currentIndex = 0;

  ngOnInit() {
    this.securityService.fetchProductsPublished().subscribe(() => {
      this.products = this.securityService.ProductsPublished$();
    });
  }

  navigate(direction: number) {
    // Naviguer dans la liste de produits, avec un effet carousel en boucle
    this.currentIndex = (this.currentIndex + direction + this.products.length) % this.products.length;
  }
}
