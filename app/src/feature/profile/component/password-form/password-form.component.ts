import {Component, inject} from '@angular/core';
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SecurityService} from "@feature-security";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {ModifyPasswordPayload} from "../../../security/data/payload/user/modify-password.payload";

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [
    FloatingLabelInputTestComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss'
})
export class PasswordFormComponent {

  protected securityService: SecurityService = inject(SecurityService)
  protected translateService: TranslateService = inject(TranslateService);

  public passwordFormGroup: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
    ])
  }, {validators: MustMatch('newPassword', 'confirmPassword')});

  public passwordFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.oldPassword.label'),
      formControl: this.passwordFormGroup.get('oldPassword') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.oldPassword.placeholder'),
    },
    {
      label: this.translateService.instant('form.newPassword.label'),
      formControl: this.passwordFormGroup.get('newPassword') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.newPassword.placeholder'),
    },
    {
      label: this.translateService.instant('form.confirmPassword.label'),
      formControl: this.passwordFormGroup.get('confirmPassword') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.confirmPassword.placeholder'),
    }
  ];

  // Soumettre le formulaire de mot de passe
  onSubmitPassword(): void {
    if (this.passwordFormGroup.valid &&
      this.passwordFormGroup.get('newPassword')?.value === this.passwordFormGroup.get('confirmPassword')?.value) {
      const payload: ModifyPasswordPayload = {
        oldPassword: this.passwordFormGroup.get('oldPassword')?.value,
        newPassword: this.passwordFormGroup.get('newPassword')?.value
      };

      this.securityService.changePassword(payload).subscribe({
        next: (response) => {
          console.log('Mot de passe modifié avec succès', response);
        },
        error: (err) => {
          console.error('Erreur lors du changement de mot de passe', err);
        }
      });
    }
  }

}

export function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const matchingControl = formGroup.controls[matchingControlName];
    const originalControl = formGroup.controls[controlName];

    if (!matchingControl || !originalControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // If another validator has already found an error on the matchingControl
      return null;
    }

    // Set error on matchingControl if validation fails
    if (originalControl.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  };
}
