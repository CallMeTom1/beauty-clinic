import {Component, inject, Input, OnInit} from '@angular/core';
import {CareCategory} from "../../../security/data/model/care-category/care-category.business";
import {SecurityService} from "@feature-security";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-sub-care-cateogry-selector-for-care-category',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './sub-care-cateogry-selector-for-care-category.component.html',
  styleUrl: './sub-care-cateogry-selector-for-care-category.component.scss'
})
export class SubCareCateogrySelectorForCareCategoryComponent implements OnInit {
  @Input() category!: CareCategory;
  protected securityService: SecurityService = inject(SecurityService);

  public isDropdownOpen = false;
  public selectedSubCategories: string[] = [];

  ngOnInit() {
    this.securityService.fetchCareSubCategories().subscribe();
    this.loadInitialSubCategories();
  }

  loadInitialSubCategories() {
    if (this.category && this.category.subCategories) {
      this.selectedSubCategories = this.category.subCategories.map(sub => sub.sub_category_id);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  isSubCategorySelected(subCategoryId: string): boolean {
    return this.selectedSubCategories.includes(subCategoryId);
  }

  onSubCategoryChange(event: Event, subCategoryId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedSubCategories.push(subCategoryId);
    } else {
      this.selectedSubCategories = this.selectedSubCategories.filter(id => id !== subCategoryId);
    }
    this.updateSubCategories();
  }

  removeSubCategory(subCategoryId: string) {
    this.selectedSubCategories = this.selectedSubCategories.filter(id => id !== subCategoryId);
    this.updateSubCategories();
  }

  getSubCategoryName(subCategoryId: string): string {
    const subCategory = this.securityService.careSubCategories$().find(
      sub => sub.sub_category_id === subCategoryId
    );
    return subCategory ? subCategory.name : '';
  }

  private updateSubCategories() {
    const payload = {
      category_id: this.category.category_id,
      subCategoryIds: this.selectedSubCategories
    };

    this.securityService.updateCareCategory(payload).subscribe({
      next: () => {
        this.securityService.fetchCareCategories().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des sous-catégories:', err);
      }
    });
  }
}
