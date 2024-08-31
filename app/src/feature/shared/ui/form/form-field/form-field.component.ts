import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
  @Input() labelKey!: string; // Clé de traduction pour le label
  @Input() controlName!: string; // Nom du contrôle de formulaire
  @Input() formGroup!: FormGroup; // Le groupe de formulaire parent
  @Input() type: string = 'text'; // Type d'input (text, email, password, etc.)

  constructor(private translate: TranslateService) {}

  // Récupère le contrôle en tant que FormControl
  get control(): FormControl | null {
    const control = this.formGroup.get(this.controlName);
    return control instanceof FormControl ? control : null;
  }

  // Récupère les messages d'erreur pour ce champ
  getErrorMessages(): string[] {
    const control = this.control;
    const errors: string[] = [];

    if (control?.hasError('required') && (control.dirty || control.touched)) {
      errors.push(this.translate.instant('form.errors.required'));
    }
    if (control?.hasError('minlength') && (control.dirty || control.touched)) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      errors.push(this.translate.instant('form.errors.minlength', { length: requiredLength }));
    }
    if (control?.hasError('email') && (control.dirty || control.touched)) {
      errors.push(this.translate.instant('form.errors.email'));
    }
    if (control?.hasError('passwordMismatch') && (control.dirty || control.touched)) {
      errors.push(this.translate.instant('form.errors.passwordMismatch'));
    }

    return errors;
  }
}
