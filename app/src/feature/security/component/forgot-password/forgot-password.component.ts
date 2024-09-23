import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FloatingLabelInputComponent, FormcontrolSimpleConfig, FormError} from "@shared-ui";
import {SecurityService} from "@feature-security";
import {TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ForgotPasswordPayload} from "../../data/payload/user/forgot-password.payload";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FloatingLabelInputComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  protected securityService: SecurityService = inject(SecurityService);
  protected readonly translateService: TranslateService = inject(TranslateService);

  public formError$: WritableSignal<FormError[]> = signal([]);

  public formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Utilise Validators.email pour validation
  });

  formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('security-feature-form-mail-label'),
      formControl: this.formGroup.get('email') as FormControl,
      inputType: 'email', // Assure-toi d'utiliser 'email' comme input type
      placeholder: this.translateService.instant('security-feature-form-mail-placeholder')
    }
  ];

  // Variables pour stocker l'état du message
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
            this.successMessage = 'An email has been sent to reset your password. Please check your inbox.';
          } else {
            // Affiche un message d'erreur si nécessaire
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        },
        error: () => {
          // Gestion des erreurs
          this.errorMessage = 'Failed to send reset email. Please check your email address and try again.';
        }
      });
    }
  }
}
