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
  protected productService: ProductService = inject(ProductService);

  searchTerm: string = ''; // Le terme de recherche de produit
  filteredProducts: Product[] = [];

  constructor() {
    // Effect pour filtrer les produits en fonction de la recherche
    effect(() => {
      if (this.searchTerm.trim()) {
        this.filteredProducts = this.productService.products$().filter(product =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        // Si une recherche est effectuée, désélectionner la catégorie
        this.productService.categorySelected$.set(null);
      } else {
        this.filteredProducts = this.productService.products$(); // Si pas de recherche, montrer tous les produits
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredProducts = this.productService.products$(); // Réinitialiser la recherche et afficher tous les produits
  }


}
