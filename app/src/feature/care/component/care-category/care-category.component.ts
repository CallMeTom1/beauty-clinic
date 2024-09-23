import {Component, computed, inject, signal} from '@angular/core';
import {CareService} from "../../care.service";
import {NgForOf} from "@angular/common";
import {CareCategory, CareCategoryTranslations} from "../../enum/care-category.enum";
import {compute} from "three/examples/jsm/nodes/gpgpu/ComputeNode";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-care-category',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule
  ],
  templateUrl: './care-category.component.html',
  styleUrl: './care-category.component.scss'
})
export class CareCategoryComponent {
  private careService: CareService = inject(CareService);

  protected categories: CareCategory[] = Object.values(CareCategory);

  selectCategory(category: CareCategory): void {
    this.careService.setCategory(category);
  }



  getCategoryTranslation(category: CareCategory): string {
    return CareCategoryTranslations[category];
  }

  getCareCount(category: CareCategory): number {
    return this.careService.getCareCountByCategory(category);
  }

  isSelected(category: CareCategory): boolean {
    return this.careService.getCategorySelected() === category;
  }

}
