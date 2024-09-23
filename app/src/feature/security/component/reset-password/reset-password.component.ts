import {Component, inject, signal, WritableSignal} from '@angular/core';
import {SecurityService, SignInPayload} from "@feature-security";
import {FloatingLabelInputComponent, FormcontrolSimpleConfig, FormError, handleFormError} from "@shared-ui";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ResetPasswordPayload} from "../../data/payload/user/reset-password.payload";
import {AppNode} from "@shared-routes";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FloatingLabelInputComponent,
    TranslateModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  protected securityService: SecurityService = inject(SecurityService);
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected route: ActivatedRoute = inject(ActivatedRoute); // Injecte ActivatedRoute pour obtenir le token
  protected router: Router = inject(Router); // Injecte Router pour la redirection

  public formError$: WritableSignal<FormError[]> = signal([]);

  public formGroup: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
  });

  formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('security-feature-form-password-label'),
      formControl: this.formGroup.get('newPassword') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('security-feature-form-password-placeholder')
    }
  ];

  private token: string | null; // Stocke le token

  constructor() {
    // Récupère le token depuis l'URL
    this.token = this.route.snapshot.paramMap.get('token');
    handleFormError(this.formGroup, this.formError$);
  }

  public error(): FormError[] {
    return this.formError$();
  }

  onSubmit(): void {
    if (this.formGroup.valid && this.token) {
      const newPassword = this.formGroup.get('newPassword')?.value;

      const payload: ResetPasswordPayload = {
        token: this.token,
        newPassword
      };

      // Appelle le service pour réinitialiser le mot de passe
      this.securityService.resetPassword(payload).subscribe();
    }
  }

}


