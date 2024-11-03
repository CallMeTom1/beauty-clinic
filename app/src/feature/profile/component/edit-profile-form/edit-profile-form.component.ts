import {Component, effect, inject} from '@angular/core';
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {SecurityService} from "@feature-security";
import {User} from "../../../security/data/model/user";
import {ModifyProfilePayload} from "../../../security/data/payload/user/modify-profile.payload";
import {Address} from "../../../security/data/model/user/address.business";

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
    phonenumber: new FormControl('', [
      Validators.required,
    ]),
    label: new FormControl(''),
    isDefault: new FormControl('false'),
    road: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    nb: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    cp: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    town: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    country: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    complement: new FormControl(''),
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
      label: this.translateService.instant('form.phonenumber.label'),
      formControl: this.profileFormGroup.get('phonenumber') as FormControl,
      inputType: 'tel',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.label.label'),
      formControl: this.profileFormGroup.get('label') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.road.label'),
      formControl: this.profileFormGroup.get('road') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.nb.label'),
      formControl: this.profileFormGroup.get('nb') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.cp.label'),
      formControl: this.profileFormGroup.get('cp') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.town.label'),
      formControl: this.profileFormGroup.get('town') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.country.label'),
      formControl: this.profileFormGroup.get('country') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
    {
      label: this.translateService.instant('form.address.complement.label'),
      formControl: this.profileFormGroup.get('complement') as FormControl,
      inputType: 'text',
      placeholder: '',
    },
  ];

  private updateFormWithAccountData(account: User): void {
    const shippingAddress = account.addresses.find(addr => addr.isShippingAddress);

    this.profileFormGroup.patchValue({
      firstname: account.firstname,
      lastname: account.lastname,
      phonenumber: account.phonenumber,
      label: shippingAddress?.label || '',
      isDefault: shippingAddress?.isDefault || 'false',
      road: shippingAddress?.road || '',
      nb: shippingAddress?.nb || '',
      cp: shippingAddress?.cp || '',
      town: shippingAddress?.town || '',
      country: shippingAddress?.country || '',
      complement: shippingAddress?.complement || '',
    });

    this.profileFormControlConfigs = this.profileFormControlConfigs.map(config => ({
      ...config,
      placeholder: this.profileFormGroup.get(config.formControl.value)?.value || ''
    }));
  }

  onSubmitProfile(): void {
    if (this.profileFormGroup.valid) {
      const formValue = this.profileFormGroup.value;

      const payload: ModifyProfilePayload = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        phonenumber: formValue.phonenumber,
        addressType: 'shipping',
        label: formValue.label,
        isDefault: formValue.isDefault,
        Address: {
          road: formValue.road,
          nb: formValue.nb,
          cp: formValue.cp,
          town: formValue.town,
          country: formValue.country,
          complement: formValue.complement,
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
