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

  public categorySelected$ :WritableSignal<CategoryProduct | null> = signal(null);

  public categories$: Signal<CategoryProduct[]> = computed(
    () => this.securityService.CategoryProductsPublished$()
  );

  public products$: Signal<Product[]> = computed(
    () => this.securityService.ProductsPublished$()
  );

  // Signal pour les produits à afficher, en fonction de la catégorie sélectionnée
  public productsToShow$: Signal<Product[]> = computed(
    () => {
      const selectedCategory = this.categorySelected$();
      const allProducts = this.products$();

      // Si aucune catégorie sélectionnée, retourner tous les produits publiés
      if (!selectedCategory) {
        return allProducts;
      }

      // Filtrer les produits par la catégorie sélectionnée
      return allProducts.filter(product =>
        product.categories.some(category => category.product_category_id === selectedCategory.product_category_id)
      );
    }
  );

  constructor() {
    this.securityService.fetchProductsPublished().subscribe()
    this.securityService.fetchCategoryProductsPublished().subscribe();

  }
}
