import {Component, effect, inject, OnInit} from '@angular/core';
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {SecurityService} from "@feature-security";
import {User} from "../../../security/data/model/user";
import {ModifyProfilePayload} from "../../../security/data/payload/user/modify-profile.payload";

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [
    FloatingLabelInputTestComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.scss'
})
export class EditProfileFormComponent {

  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

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
    ]),
    address: new FormGroup({
      road: new FormControl('', [Validators.maxLength(50)]),
      nb: new FormControl('', [Validators.maxLength(10)]),
      cp: new FormControl('', [Validators.maxLength(10)]),
      town: new FormControl('', [Validators.maxLength(30)]),
      country: new FormControl('', [Validators.maxLength(30)]),
      complement: new FormControl(''),
    }),
  });

  constructor() {
    effect(() => {
      const account = this.securityService.account$();
      if (account && account.firstname) {
        this.updateFormWithAccountData(account);
      }
    });
  }

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
    },
    {
      label: this.translateService.instant('form.address.road.label'),
      formControl: this.profileFormGroup.get('address.road') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.nb.label'),
      formControl: this.profileFormGroup.get('address.nb') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.cp.label'),
      formControl: this.profileFormGroup.get('address.cp') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.town.label'),
      formControl: this.profileFormGroup.get('address.town') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.country.label'),
      formControl: this.profileFormGroup.get('address.country') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.complement.label'),
      formControl: this.profileFormGroup.get('address.complement') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
  ];

  private updateFormWithAccountData(account: User): void {
    this.profileFormGroup.patchValue({
      firstname: account.firstname,
      lastname: account.lastname,
      phoneNumber: account.phoneNumber,
      address: account.shippingAddress ? account.shippingAddress : {}, // Remplacer avec l'adresse si existante
    });

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
        placeholder: account.phoneNumber ? account.phoneNumber : '',
      },
      {
        label: this.translateService.instant('form.address.road.label'),
        formControl: this.profileFormGroup.get('address.road') as FormControl,
        inputType: 'text',
        placeholder: account.shippingAddress?.road ? account.shippingAddress.road : '',
      },
      {
        label: this.translateService.instant('form.address.nb.label'),
        formControl: this.profileFormGroup.get('address.nb') as FormControl,
        inputType: 'text',
        placeholder: account.shippingAddress?.nb ? account.shippingAddress.nb : '',
      },
      {
        label: this.translateService.instant('form.address.cp.label'),
        formControl: this.profileFormGroup.get('address.cp') as FormControl,
        inputType: 'text',
        placeholder: account.shippingAddress?.cp ? account.shippingAddress.cp : '',
      },
      {
        label: this.translateService.instant('form.address.town.label'),
        formControl: this.profileFormGroup.get('address.town') as FormControl,
        inputType: 'text',
        placeholder: account.shippingAddress?.town ? account.shippingAddress.town : '',
      },
      {
        label: this.translateService.instant('form.address.country.label'),
        formControl: this.profileFormGroup.get('address.country') as FormControl,
        inputType: 'text',
        placeholder: account.shippingAddress?.country ? account.shippingAddress.country : '',
      },
      {
        label: this.translateService.instant('form.address.complement.label'),
        formControl: this.profileFormGroup.get('address.complement') as FormControl,
        inputType: 'text',
        placeholder: account.shippingAddress?.complement ? account.shippingAddress.complement : '',
      }
    ];
  }

  onSubmitProfile(): void {
    if (this.profileFormGroup.valid) {
      const payload: ModifyProfilePayload = {
        firstname: this.profileFormGroup.get('firstname')?.value,
        lastname: this.profileFormGroup.get('lastname')?.value,
        phoneNumber: this.profileFormGroup.get('phoneNumber')?.value,
        Address: {
          road: this.profileFormGroup.get('address.road')?.value,
          nb: this.profileFormGroup.get('address.nb')?.value,
          cp: this.profileFormGroup.get('address.cp')?.value,
          town: this.profileFormGroup.get('address.town')?.value,
          country: this.profileFormGroup.get('address.country')?.value,
          complement: this.profileFormGroup.get('address.complement')?.value,
        }
      };

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
}
