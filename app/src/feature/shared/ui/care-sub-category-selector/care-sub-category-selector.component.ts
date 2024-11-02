import {Component, inject, Input, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Care} from "../../../security/data/model/care/care.business";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {UpdateCareSubCategoriesPayload} from "../../../security/data/payload/care/update-care-sub-category.payload";

@Component({
  selector: 'app-care-sub-category-selector',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule
  ],
  templateUrl: './care-sub-category-selector.component.html',
  styleUrl: './care-sub-category-selector.component.scss'
})
export class CareSubcategorySelectorComponent implements OnInit {
  @Input() careId!: string;
  protected securityService: SecurityService = inject(SecurityService);

  public selectedSubcategories: string[] = [];
  public subcategoryFormGroup: FormGroup = new FormGroup({
    subcategories: new FormControl([], [Validators.required])
  });

  public isDropdownOpen = false;

  ngOnInit() {
    this.securityService.fetchCareSubCategories().subscribe();
    this.loadInitialSubcategories();
  }

  loadInitialSubcategories() {
    const cares: Care[] = this.securityService.cares$();
    const care = cares.find(c => c.care_id === this.careId);

    if (care && care.subCategories) {
      this.selectedSubcategories = care.subCategories.map(sub => sub.sub_category_id);
      this.subcategoryFormGroup.get('subcategories')!.setValue(this.selectedSubcategories);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSubcategoryChange(event: Event, subcategoryId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedSubcategories.push(subcategoryId);
    } else {
      this.selectedSubcategories = this.selectedSubcategories.filter(id => id !== subcategoryId);
    }
    this.subcategoryFormGroup.get('subcategories')!.setValue(this.selectedSubcategories);
    this.updateSubcategoriesOnServer();
  }

  isSubcategorySelected(subcategoryId: string): boolean {
    return this.selectedSubcategories.includes(subcategoryId);
  }

  updateSubcategoriesOnServer() {
    const payload:UpdateCareSubCategoriesPayload  = {
      care_id: this.careId,
      sub_category_ids: this.selectedSubcategories
    };

    this.securityService.updateCareSubCategories(payload).subscribe({
      next: (response) => {
        if (response.result) {
          console.log('Sous-catégories de soin mises à jour avec succès:', response.data);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des sous-catégories:', err);
      }
    });
  }

  getSubcategoryName(subcategoryId: string): string {
    const subcategory = this.securityService.careSubCategories$().find(
      sub => sub.sub_category_id === subcategoryId
    );
    return subcategory ? subcategory.name : '';
  }

  removeSubcategory(subcategoryId: string) {
    this.selectedSubcategories = this.selectedSubcategories.filter(id => id !== subcategoryId);
    this.subcategoryFormGroup.get('subcategories')!.setValue(this.selectedSubcategories);
    this.updateSubcategoriesOnServer();
  }
}
