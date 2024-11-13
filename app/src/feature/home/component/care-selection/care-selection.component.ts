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

    return allCategories
      .filter(category => {
        return this.SELECTED_CATEGORY_NAMES.includes(category.name);
      })
      .slice(0, 3);
  });

  constructor(private securityService: SecurityService) {
    this.securityService.fetchCareCategories().subscribe()
  }
}
