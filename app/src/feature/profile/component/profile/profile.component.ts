import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SecurityService } from "@feature-security";
import { FloatingLabelInputTestComponent } from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import { FormcontrolSimpleConfig } from "@shared-ui";
import { ModifyPasswordPayload } from "../../../security/data/payload/user/modify-password.payload";
import { ModifyProfilePayload } from "../../../security/data/payload/user/modify-profile.payload";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  protected readonly securityService = inject(SecurityService);
  protected readonly translateService = inject(TranslateService);
  protected hasChanges = false;
  protected userEmail = '';

  protected userInfoForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    phonenumber: new FormControl('', [
      Validators.pattern(/^(\+33|0)[1-9](\d{8})$/)
    ])
  });

  protected passwordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  });

  protected userInfoConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.profile.username.label'),
      formControl: this.userInfoForm.get('username') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.profile.username.placeholder')
    },
    {
      label: this.translateService.instant('form.profile.firstname.label'),
      formControl: this.userInfoForm.get('firstname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.profile.firstname.placeholder')
    },
    {
      label: this.translateService.instant('form.profile.lastname.label'),
      formControl: this.userInfoForm.get('lastname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.profile.lastname.placeholder')
    },
    {
      label: this.translateService.instant('form.profile.phone.label'),
      formControl: this.userInfoForm.get('phonenumber') as FormControl,
      inputType: 'tel',
      placeholder: this.translateService.instant('form.profile.phone.placeholder')
    }
  ];

  protected passwordConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.profile.currentPassword.label'),
      formControl: this.passwordForm.get('oldPassword') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.profile.currentPassword.placeholder')
    },
    {
      label: this.translateService.instant('form.profile.newPassword.label'),
      formControl: this.passwordForm.get('newPassword') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.profile.newPassword.placeholder')
    },
    {
      label: this.translateService.instant('form.profile.confirmPassword.label'),
      formControl: this.passwordForm.get('confirmPassword') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.profile.confirmPassword.placeholder')
    }
  ];

  ngOnInit() {
    const user = this.securityService.account$();
    if (user) {
      this.userEmail = user.mail;
      this.userInfoForm.patchValue({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber || ''
      });
    }

    // Validation du mot de passe de confirmation
    this.passwordForm.get('confirmPassword')?.addValidators(
      (control) => {
        const newPassword = this.passwordForm.get('newPassword')?.value;
        return control.value === newPassword ? null : { passwordMismatch: true };
      }
    );

    // Observer les changements du formulaire
    this.userInfoForm.valueChanges.subscribe(() => {
      this.hasChanges = this.userInfoForm.dirty;
    });
  }

  onSubmitUserInfo() {
    if (this.userInfoForm.valid && this.hasChanges) {
      const payload: ModifyProfilePayload = {
        username: this.userInfoForm.get('username')?.value,
        firstname: this.userInfoForm.get('firstname')?.value,
        lastname: this.userInfoForm.get('lastname')?.value,
        phonenumber: this.userInfoForm.get('phonenumber')?.value
      };

      this.securityService.modifyProfile(payload).subscribe({
        next: () => {
          this.hasChanges = false;
          this.userInfoForm.markAsPristine();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour des informations', error);
        }
      });
    }
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      const payload: ModifyPasswordPayload = {
        oldPassword: this.passwordForm.get('oldPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value
      };

      this.securityService.changePassword(payload).subscribe({
        next: () => {
          this.passwordForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du mot de passe', error);
        }
      });
    }
  }
}
