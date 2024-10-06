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

  // Liste de configurations pour les champs
  fieldConfigs: FormcontrolSimpleConfig[];

  constructor() {
    // Initialisation du formulaire avec plusieurs champs
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    // Configuration des champs
    this.fieldConfigs = [
      {
        label: 'Nom',
        formControl: this.form.get('name') as FormControl,
        inputType: 'text',
        placeholder: 'Entrez votre nom'
      },
      {
        label: 'Email',
        formControl: this.form.get('email') as FormControl,
        inputType: 'email',
        placeholder: 'Entrez votre email'
      },
      {
        label: 'Mot de passe',
        formControl: this.form.get('password') as FormControl,
        inputType: 'password',
        placeholder: 'Entrez votre mot de passe'
      }
    ];
  }

  submitForm() {
    if (this.form.valid) {
      console.log('Formulaire valide', this.form.value);
    } else {
      console.log('Formulaire invalide');
    }
  }
}
