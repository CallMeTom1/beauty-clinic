import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SecurityService } from "@feature-security";
import { FloatingLabelInputTestComponent } from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import { FormcontrolSimpleConfig } from "@shared-ui";
import { ModifyPasswordPayload } from "../../../security/data/payload/user/modify-password.payload";
import { ModifyProfilePayload } from "../../../security/data/payload/user/modify-profile.payload";
import {RouterLink} from "@angular/router";
import {User} from "../../../security/data/model/user";

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
  protected userInfoConfigs: FormcontrolSimpleConfig[] = [];
  protected passwordConfigs: FormcontrolSimpleConfig[] = [];

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
      Validators.pattern(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
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
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  });

  ngOnInit() {
    // Initialiser les configs après que les traductions sont chargées
    this.translateService.get([
      'form.profile.username.label',
      'form.profile.username.placeholder',
      'form.profile.firstname.label',
      'form.profile.firstname.placeholder',
      'form.profile.lastname.label',
      'form.profile.lastname.placeholder',
      'form.profile.phone.label',
      'form.profile.phone.placeholder',
      'form.profile.currentPassword.label',
      'form.profile.currentPassword.placeholder',
      'form.profile.newPassword.label',
      'form.profile.newPassword.placeholder',
      'form.profile.confirmPassword.label',
      'form.profile.confirmPassword.placeholder'
    ]).subscribe(translations => {
      this.initializeConfigs(translations);
    });

    this.securityService.me().subscribe()
    const user: User = this.securityService.account$();
    if (user) {
      console.log(user)
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

  private initializeConfigs(translations: any) {
    this.userInfoConfigs = [
      {
        label: translations['form.profile.username.label'],
        formControl: this.userInfoForm.get('username') as FormControl,
        inputType: 'text',
        placeholder: translations['form.profile.username.placeholder']
      },
      {
        label: translations['form.profile.firstname.label'],
        formControl: this.userInfoForm.get('firstname') as FormControl,
        inputType: 'text',
        placeholder: translations['form.profile.firstname.placeholder']
      },
      {
        label: translations['form.profile.lastname.label'],
        formControl: this.userInfoForm.get('lastname') as FormControl,
        inputType: 'text',
        placeholder: translations['form.profile.lastname.placeholder']
      },
      {
        label: translations['form.profile.phone.label'],
        formControl: this.userInfoForm.get('phonenumber') as FormControl,
        inputType: 'tel',
        placeholder: translations['form.profile.phone.placeholder']
      }
    ];

    this.passwordConfigs = [
      {
        label: translations['form.profile.currentPassword.label'],
        formControl: this.passwordForm.get('oldPassword') as FormControl,
        inputType: 'password',
        placeholder: translations['form.profile.currentPassword.placeholder']
      },
      {
        label: translations['form.profile.newPassword.label'],
        formControl: this.passwordForm.get('newPassword') as FormControl,
        inputType: 'password',
        placeholder: translations['form.profile.newPassword.placeholder']
      },
      {
        label: translations['form.profile.confirmPassword.label'],
        formControl: this.passwordForm.get('confirmPassword') as FormControl,
        inputType: 'password',
        placeholder: translations['form.profile.confirmPassword.placeholder']
      }
    ];
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
