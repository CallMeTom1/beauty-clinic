import {Component, inject, Input, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Care} from "../../../security/data/model/care/care.business";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {
  UpdateCareCategoriesPayload,
} from "../../../security/data/payload/care/update-care-category.payload";

@Component({
  selector: 'app-care-category-selector',
  standalone: true,
  imports: [
    TranslateModule,
    NgForOf
  ],
  templateUrl: './care-category-selector.component.html',
  styleUrl: './care-category-selector.component.scss'
})
export class CareCategorySelectorComponent implements OnInit {
  @Input() careId!: string;
  protected securityService: SecurityService = inject(SecurityService);

  public selectedCategories: string[] = [];
  public categoryFormGroup: FormGroup = new FormGroup({
    categories: new FormControl([], [Validators.required])
  });

  public isDropdownOpen = false;

  ngOnInit() {
    this.securityService.fetchCareCategories().subscribe();
    this.loadInitialCategories();
  }

  loadInitialCategories() {
    // Trouver le soin par son careId dans la liste des soins
    const cares: Care[] = this.securityService.cares$();
    const care = cares.find(c => c.care_id === this.careId);

    if (care && care.categories) {
      // Extraire les catégories liées au soin
      this.selectedCategories = care.categories.map(cat => cat.category_id);
      this.categoryFormGroup.get('categories')!.setValue(this.selectedCategories);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCategoryChange(event: Event, categoryId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.categoryFormGroup.get('categories')!.setValue(this.selectedCategories);
    this.updateCategoriesOnServer();
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  updateCategoriesOnServer() {
    const payload: UpdateCareCategoriesPayload = {
      care_id: this.careId,
      category_ids: this.selectedCategories
    };

    this.securityService.updateCareCategories(payload).subscribe({
      next: (response) => {
        if (response.result) {
          console.log('Catégories de soin mises à jour avec succès:', response.data);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des catégories:', err);
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.securityService.careCategories$().find(
      cat => cat.category_id === categoryId
    );
    return category ? category.name : '';
  }

  removeCategory(categoryId: string) {
    this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    this.categoryFormGroup.get('categories')!.setValue(this.selectedCategories);
    this.updateCategoriesOnServer();
  }
}
