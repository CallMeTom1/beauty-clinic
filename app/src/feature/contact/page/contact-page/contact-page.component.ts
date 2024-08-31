import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    TranslateModule
  ],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    // Création du formulaire réactif avec des validations intégrées et personnalisées
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Valide que les mots de passe correspondent
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted', this.form.value);
    } else {
      this.form.markAllAsTouched();  // Marquer tous les champs comme touchés pour afficher les erreurs
    }
  }

  // Fonction pour récupérer les erreurs d'un champ spécifique
  getErrorsForControl(controlName: string): string[] {
    const control = this.form.get(controlName);
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
    if (controlName === 'confirmPassword' && this.form.hasError('passwordMismatch') && (control!.dirty || control!.touched)) {
      errors.push(this.translate.instant('form.errors.passwordMismatch'));
    }

    return errors;
  }
}
