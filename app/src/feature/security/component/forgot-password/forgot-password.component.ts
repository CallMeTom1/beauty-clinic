import { Component, inject, signal, WritableSignal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { SecurityService } from '@feature-security';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPasswordPayload } from '../../data/payload/user/forgot-password.payload';
import { FormcontrolSimpleConfig, FormError } from '@shared-ui';
import { FloatingLabelInputTestComponent } from '../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FloatingLabelInputTestComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  protected securityService: SecurityService = inject(SecurityService);
  protected readonly translateService: TranslateService = inject(TranslateService);

  public formError$: WritableSignal<FormError[]> = signal([]);

  public formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: 'Adresse e-mail',
      formControl: this.formGroup.get('email') as FormControl,
      inputType: 'email',
      placeholder: 'Entrez votre adresse e-mail'
    }
  ];

  // Variables pour le logo et la marque
  protected logoSrc: string = './assets/icon/logo-beauty-clinic.svg';
  protected alt: string = 'Logo de la marque';
  protected brand: string = 'Izzy Beauty';

  // Messages d'état
  public successMessage: string = '';
  public errorMessage: string = '';

  public error(): FormError[] {
    return this.formError$();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const email = this.formGroup.get('email')?.value;

      const payload: ForgotPasswordPayload = { email };

      // Reset des messages
      this.successMessage = '';
      this.errorMessage = '';

      this.securityService.forgotPassword(payload).subscribe({
        next: (response) => {
          // En cas de succès, afficher un message de succès
          if (response.result) {
            this.successMessage = 'Un e-mail vous a été envoyé pour réinitialiser votre mot de passe. Veuillez vérifier votre boîte de réception.';
          } else {
            // Affiche un message d'erreur si nécessaire
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        },
        error: () => {
          // Gestion des erreurs
          this.errorMessage = 'Impossible d\'envoyer l\'e-mail de réinitialisation. Veuillez vérifier votre adresse e-mail et réessayer.';
        }
      });
    } else {
      this.errorMessage = 'Veuillez entrer une adresse e-mail valide.';
    }
  }
}
