import {Component, OnInit} from "@angular/core";
import {SecurityService} from "@feature-security";
import {Router} from "@angular/router";
import {CareSubCategory} from "../../../security/data/model/care-sub-category/care-sub-category.business";
import {CareCategory} from "../../../security/data/model/care-category/care-category.business";
import {NgClass, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-care-page',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle
  ],
  templateUrl: './care-page.component.html',
  styleUrls: ['./care-page.component.scss']
})
export class CarePageComponent implements OnInit {
  selectedCategory: CareCategory | null = null;
  selectedSubCategory: CareSubCategory | null = null;

  constructor(
    protected securityService: SecurityService,
    private router: Router
  ) {}

  ngOnInit() {
    // Charger les données au démarrage
    this.securityService.fetchCareCategories().subscribe(() => {
      // Sélectionner la première catégorie par défaut
      const categories = this.securityService.careCategories$();
      if (categories.length > 0) {
        this.selectCategory(categories[0]);
      }
    });
    this.securityService.fetchCareSubCategories().subscribe();
  }

  getImageForCategory(category: CareCategory): string {
    return category.category_image || './assets/images/default/default-category.png';
  }

  getImageForSubCategory(subCategory: CareSubCategory): string {
    return subCategory.sub_category_image || './assets/images/default/default-subcategory.png';
  }

  selectCategory(category: CareCategory) {
    this.selectedCategory = category;
    this.selectedSubCategory = null;

    // Si la catégorie a des sous-catégories, sélectionner la première
    if (this.hasSubCategories(category)) {
      const subCategories = this.getSubCategoriesForCategory(category.category_id);
      if (subCategories.length > 0) {
        this.selectSubCategory(subCategories[0]);
      }
    }
  }

  selectSubCategory(subCategory: CareSubCategory) {
    this.selectedSubCategory = subCategory;
  }

  hasSubCategories(category: CareCategory): boolean {
    const subCategories = this.getSubCategoriesForCategory(category.category_id);
    return subCategories.length > 0;
  }

  getSubCategoriesForCategory(categoryId: string): CareSubCategory[] {
    return this.securityService.careSubCategories$().filter(subCategory =>
        subCategory.isPublished && (
          // Vérifier si la sous-catégorie appartient à la catégorie
          subCategory.category_id === categoryId ||
          // Ou vérifier via la relation inverse dans la catégorie
          this.selectedCategory?.subCategories?.some(
            sc => sc.sub_category_id === subCategory.sub_category_id
          )
        )
    );
  }

  navigateToBooking(categoryName: string) {
    this.router.navigate(['rendez-vous'], {
      queryParams: { category: categoryName.toLowerCase() }
    });
  }
}
