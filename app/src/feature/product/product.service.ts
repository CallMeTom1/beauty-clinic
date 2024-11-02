import {computed, effect, inject, Injectable, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {CategoryProduct} from "../security/data/model/category-product/category-product.business";
import {ProductCategoryUtils} from "../security/utils/product-category.utils";
import {SecurityService} from "@feature-security";
import {Product} from "../security/data/model/product/product.business";
import {compute} from "three/examples/jsm/nodes/gpgpu/ComputeNode";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  protected securityService: SecurityService = inject(SecurityService);

  // Signals existants
  public categorySelected$: WritableSignal<CategoryProduct | null> = signal(null);
  public searchTerm$: WritableSignal<string> = signal('');

  public categories$: Signal<CategoryProduct[]> = computed(
    () => this.securityService.CategoryProductsPublished$()
  );

  public products$: Signal<Product[]> = computed(
    () => this.securityService.ProductsPublished$()
  );

  // Signal modifié pour prendre en compte la recherche
  public productsToShow$: Signal<Product[]> = computed(() => {
    const selectedCategory = this.categorySelected$();
    const searchTerm = this.searchTerm$().toLowerCase().trim();
    const allProducts = this.products$();

    let filteredProducts = allProducts;

    // Filtrer par catégorie si sélectionnée
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product =>
        product.categories.some(category =>
          category.product_category_id === selectedCategory.product_category_id
        )
      );
    }

    // Filtrer par terme de recherche si présent
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredProducts;
  });

  constructor() {
    this.securityService.fetchProductsPublished().subscribe();
    this.securityService.fetchCategoryProductsPublished().subscribe();
  }

  // Méthodes pour gérer la recherche
  setSearchTerm(term: string) {
    this.searchTerm$.set(term);
    if (term.trim()) {
      this.categorySelected$.set(null); // Réinitialiser la catégorie si on recherche
    }
  }


}
