import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatingLabelInputComponent} from "@shared-ui";
import {
  FloatingLabelInputTestComponent
} from "../form/component/floating-label-input-test/floating-label-input-test.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-form-test',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputComponent,
    FloatingLabelInputTestComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './form-test.component.html',
  styleUrl: './form-test.component.scss'
})
export class FormTestComponent {
  @Input() config!: any[];  // Configuration pour les champs
  formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({});
    this.config.forEach(field => {
      const control = this.fb.control('', this.getValidators(field.validators));
      this.formGroup.addControl(field.formControlName, control);
    });
  }

  getValidators(validatorsConfig: any): any[] {
    const validators = [];
    if (validatorsConfig?.required) {
      validators.push(Validators.required);
    }
    if (validatorsConfig?.minlength) {
      validators.push(Validators.minLength(validatorsConfig.minlength));
    }
    if (validatorsConfig?.maxlength) {
      validators.push(Validators.maxLength(validatorsConfig.maxlength));
    }
    if (validatorsConfig?.email) {
      validators.push(Validators.email);
    }
    return validators;
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      // Logique de soumission du formulaire
      console.log('Formulaire soumis avec succès', this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();  // Marquer tous les champs comme touchés pour afficher les erreurs
    }
  }
}
