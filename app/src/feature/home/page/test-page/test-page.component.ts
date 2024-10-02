import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatingLabelInputComponent, FormcontrolSimpleConfig} from "@shared-ui";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputComponent,
    FloatingLabelInputTestComponent
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss'
})
export class TestPageComponent {
  form: FormGroup;

  // Définir la configuration du champ "name" en utilisant FormcontrolSimpleConfig
  nameConfig: FormcontrolSimpleConfig;

  constructor() {
    // Initialisation du formulaire avec un champ "name" qui est requis
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    // Configuration du champ "name"
    this.nameConfig = {
      label: 'Nom',
      formControl: this.form.get('name') as FormControl, // Lier le contrôle de formulaire
      inputType: 'text',
      placeholder: 'Entrez votre nom'
    };
  }

  submitForm() {
    if (this.form.valid) {
      console.log('Formulaire valide', this.form.value);
    } else {
      console.log('Formulaire invalide');
    }
  }
}
