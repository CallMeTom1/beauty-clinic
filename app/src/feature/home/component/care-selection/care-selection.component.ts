import {Component, computed} from '@angular/core';
import {SecurityService} from "@feature-security";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-care-selection',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './care-selection.component.html',
  styleUrl: './care-selection.component.scss'
})
export class CareSelectionComponent {
  private readonly SELECTED_CATEGORY_NAMES = ['Diagnostique gratuit', 'Epilation', 'Amincissant'];

  selectedCares = computed(() => {
    const allCategories = this.securityService.careCategories$();
    console.log('Toutes les catégories:', allCategories);

    const filteredCategories = allCategories
      .filter(category => {
        console.log('Vérification de la catégorie:', category.name);
        return this.SELECTED_CATEGORY_NAMES.includes(category.name);
      })
      .slice(0, 3);

    console.log('Catégories filtrées:', filteredCategories);
    return filteredCategories;
  });

  constructor(private securityService: SecurityService) {
    this.securityService.fetchCareCategories().subscribe()
    // Log initial des catégories
    console.log('État initial des catégories:', this.securityService.careCategories$());
  }
}
