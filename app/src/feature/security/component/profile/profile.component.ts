import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SecurityService } from '@feature-security';
import { lastValueFrom } from 'rxjs';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { UserAvatarComponent } from "../../../shared/ui/user-avatar/user-avatar.component";
import { FormcontrolSimpleConfig } from "@shared-ui";
import { FloatingLabelInputTestComponent } from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import { ModifyProfilePayload } from "../../data/payload/user/modify-profile.payload";
import { User } from '../../data/model/user';
import {ModifyPasswordPayload} from "../../data/payload/user/modify-password.payload";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TranslateModule, UserAvatarComponent, ReactiveFormsModule, FloatingLabelInputTestComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

  // Formulaire de profil
  public profileFormGroup: FormGroup = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      //Validators.pattern(/^[0-9]{10}$/), // Exemple de validation pour un numéro à 10 chiffres
    ]),
  });

  // Formulaire de mot de passe
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
  });

  public profileFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.firstname.label'),
      formControl: this.profileFormGroup.get('firstname') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.lastname.label'),
      formControl: this.profileFormGroup.get('lastname') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.phoneNumber.label'),
      formControl: this.profileFormGroup.get('phoneNumber') as FormControl,
      inputType: 'tel',
      placeholder: '',
    }
  ];

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

  protected profileImageForm: FormGroup = new FormGroup({
    profileImage: new FormControl(null, Validators.required)
  });

  protected showUploadButton: boolean = false;
  protected avatarAlt: string = 'security-feature-avatar-alt';
  protected changeAvatar: string = 'security-feature-change-avatar';

  constructor() {
    // Utilisation de 'effect' pour surveiller les changements sur 'account$'
    effect(() => {
      const account = this.securityService.account$();
      if (account && account.firstname) {
        this.updateFormWithAccountData(account);
      }
    });
  }

  ngOnInit() {
    // Appel de la méthode 'me()' pour charger les données utilisateur
    this.securityService.me().subscribe();
  }

  private updateFormWithAccountData(account: User): void {
    // Mettre à jour les valeurs du formulaire
    this.profileFormGroup.patchValue({
      firstname: account.firstname,
      lastname: account.lastname,
      phoneNumber: account.phoneNumber,
    });

    // Mettre à jour les placeholders
    this.profileFormControlConfigs = [
      {
        label: this.translateService.instant('form.firstname.label'),
        formControl: this.profileFormGroup.get('firstname') as FormControl,
        inputType: 'text',
        placeholder: account.firstname,
      },
      {
        label: this.translateService.instant('form.lastname.label'),
        formControl: this.profileFormGroup.get('lastname') as FormControl,
        inputType: 'text',
        placeholder: account.lastname,
      },
      {
        label: this.translateService.instant('form.phoneNumber.label'),
        formControl: this.profileFormGroup.get('phoneNumber') as FormControl,
        inputType: 'tel',
        placeholder: account.phoneNumber,
      }
    ];
  }

  // Soumettre le formulaire de profil
  onSubmitProfile(): void {
    if (this.profileFormGroup.valid) {
      // Créer le payload à partir des valeurs du formulaire
      const payload: ModifyProfilePayload = {
        firstname: this.profileFormGroup.get('firstname')?.value,
        lastname: this.profileFormGroup.get('lastname')?.value,
        phoneNumber: this.profileFormGroup.get('phoneNumber')?.value,
      };

      // Appeler la méthode pour modifier le profil
      this.securityService.modifyProfile(payload).subscribe({
        next: (response) => {
          console.log('Profil modifié avec succès', response);
        },
        error: (err) => {
          console.error('Erreur lors de la modification du profil', err);
        }
      });
    }
  }

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

  // Gérer le changement d'image de profil
  onProfileImageChange(event: any): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageForm.patchValue({
        profileImage: file
      });
      this.uploadProfileImage().then();
    }
  }

  // Upload de l'image de profil
  async uploadProfileImage(): Promise<void> {
    if (this.profileImageForm.valid) {
      const formData: FormData = new FormData();
      const profileImage = this.profileImageForm.get('profileImage')?.value;
      if (profileImage) {
        formData.append('profileImage', profileImage);
        try {
          await lastValueFrom(this.securityService.uploadProfileImage(formData));
          location.reload(); // Rafraîchir pour afficher la nouvelle image
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'image de profil', error);
        }
      }
    }
  }
}
