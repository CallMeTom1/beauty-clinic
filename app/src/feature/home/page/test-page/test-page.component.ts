import {Component, effect, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatingLabelInputComponent, FormcontrolSimpleConfig} from "@shared-ui";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {SecurityService} from "@feature-security";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {AddressFormComponent} from "../../../shared/ui/form/component/address-form/address-form.component";

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputComponent,
    FloatingLabelInputTestComponent,
    AddressFormComponent
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss'
})
export class TestPageComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected categories: CategoryProduct[] = [];

  constructor() {
    effect(() => {
      this.categories = this.securityService.CategoryProducts$(); // Réagit aux changements dans le signal
      console.log('Categories updated:', this.categories); // Vérifiez dans la console
    });
  }

  handleAddressSubmission(event: { type: 'shipping' | 'billing'; data: any }) {
    console.log('Address submitted:', event.type, event.data);
    // Traitez l'adresse soumise ici (par exemple, enregistrer dans le backend)
  }

}
