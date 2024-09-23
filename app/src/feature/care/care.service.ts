import {computed, inject, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {SecurityService} from "@feature-security";
import {Care} from "./data/model/care.business";
import {CareCategory} from "./enum/care-category.enum";

@Injectable({
  providedIn: 'root'
})
export class CareService {
  protected securityService: SecurityService = inject(SecurityService);

  // Signal pour la chaîne de recherche
  protected searchTerm$: WritableSignal<string> = signal('');

  // Signal pour la catégorie sélectionnée
  protected selectedCategory$: WritableSignal<CareCategory | null> = signal(null);

  // Signal pour la liste des soins filtrés
  public filteredCares$: Signal<Care[]> = computed(() => {
    const searchTerm = this.searchTerm$().toLowerCase();
    const selectedCategory = this.selectedCategory$();
    const cares = this.securityService.cares$();

    // Filtrer les soins en fonction du terme de recherche
    const filteredBySearchTerm = cares.filter(care =>
      care.name.toLowerCase().includes(searchTerm)
    );

    // Filtrer les soins en fonction de la catégorie sélectionnée
    return selectedCategory
      ? filteredBySearchTerm.filter(care => care.category === selectedCategory)
      : filteredBySearchTerm;
  });

  // Méthode pour mettre à jour le terme de recherche
  public setSearchTerm(term: string): void {
    console.log('term', term);
    this.searchTerm$.set(term);
    console.log('filtered cares', this.filteredCares$());
  }

  // Méthode pour mettre à jour la catégorie sélectionnée
  public setCategory(category: CareCategory | null): void {
    console.log('selected category', category);
    this.selectedCategory$.set(category);
    console.log('filtered cares', this.filteredCares$());
  }

  public getCategorySelected() {
    return this.selectedCategory$();
  }

  getCareCountByCategory(category: CareCategory): number {
    const cares = this.securityService.cares$();
    return cares.filter(care => care.category === category).length;
  }

}
