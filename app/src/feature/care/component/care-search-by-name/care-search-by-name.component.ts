import { Component, inject, signal, WritableSignal } from '@angular/core';
import { SecurityService } from "@feature-security";
import { Care } from "../../data/model/care.business";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import {FloatingLabelInputComponent, FormcontrolSimpleConfig} from "@shared-ui";
import {CareService} from "../../care.service";

@Component({
  selector: 'app-care-search-by-name',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FloatingLabelInputComponent
  ],
  templateUrl: './care-search-by-name.component.html',
  styleUrls: ['./care-search-by-name.component.scss']
})
export class CareSearchByNameComponent {

  private careService: CareService = inject(CareService);

  // FormControl pour gérer le champ de recherche
  searchControl = new FormControl('');

  constructor() {
    // Écouter les changements dans le FormControl et mettre à jour le terme de recherche dans CareService
    this.searchControl.valueChanges.subscribe(value => {
      console.log(value);
      this.careService.setSearchTerm(value || '');
    });
  }

  // Getter pour accéder à la liste des soins filtrés depuis le service
  get filteredCares(): Care[] {
    return this.careService.filteredCares$();
  }
}
