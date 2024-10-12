import {Component, inject, Input, OnInit} from '@angular/core';
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {Product} from "../../../security/data/model/product/product.business";
import {UpdateProductCategoryPayload} from "../../../security/data/payload/product/update-product-category.payload";

@Component({
  selector: 'app-product-category-selector',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './product-category-selector.component.html',
  styleUrl: './product-category-selector.component.scss'
})
export class ProductCategorySelectorComponent implements OnInit {
  @Input() productId!: string; // ID du produit à lier aux catégories
  protected securityService: SecurityService = inject(SecurityService);

  public selectedCategories: string[] = []; // Catégories sélectionnées pour le produit
  public categoryFormGroup: FormGroup = new FormGroup({
    categories: new FormControl([], [Validators.required])
  });

  ngOnInit() {
    this.securityService.fetchCategoryProducts().subscribe();
    this.loadInitialCategories(); // Charger les catégories déjà liées au produit
  }

  loadInitialCategories() {
    // Trouver le produit par son productId dans la liste des produits provenant du signal
    const products: Product[] = this.securityService.Products$(); // Obtenir la liste des produits
    const product = products.find(prod => prod.product_id === this.productId);

    if (product && product.categories) {
      // Extraire les catégories liées au produit et mettre à jour selectedCategories
      this.selectedCategories = product.categories.map(cat => cat.product_category_id);
      // Mettre à jour le formulaire avec les catégories sélectionnées
      this.categoryFormGroup.get('categories')!.setValue(this.selectedCategories);
    }
  }

  onCategoryChange(event: Event, categoryId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      // Ajouter la catégorie à la liste des catégories sélectionnées
      this.selectedCategories.push(categoryId);
    } else {
      // Retirer la catégorie de la liste des catégories sélectionnées
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    // Mettre à jour le formulaire avec la nouvelle liste de catégories sélectionnées
    this.categoryFormGroup.get('categories')!.setValue(this.selectedCategories);

    this.updateCategoriesOnServer();

  }

  isCategorySelected(categoryId: string): boolean {
    // Vérifier si une catégorie est déjà sélectionnée
    return this.selectedCategories.includes(categoryId);
  }

  updateCategoriesOnServer() {
    const payload: UpdateProductCategoryPayload = {
      product_id: this.productId,
      category_ids: this.selectedCategories
    };

    console.log('payload', payload)

    this.securityService.updateProductCategories(payload).subscribe({
      next: (response) => {
        if (response.result) {
          console.log('Catégories mises à jour avec succès:', response.data);
        } else {
          console.error('Erreur lors de la mise à jour des catégories:', response.code);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la communication avec le serveur:', err);
      }
    });
  }
}
