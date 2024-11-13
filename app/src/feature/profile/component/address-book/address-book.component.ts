import {Component, inject, OnInit} from '@angular/core';
import {Address} from "../../../security/data/model/user/address.business";
import {SecurityService} from "@feature-security";
import {TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {RouterLink} from "@angular/router";
import {ModalService} from "../../../shared/ui/modal.service";
import {
  AddAddressPayload,
  DeleteAddressPayload,
  ModifyAddressPayload
} from "../../../security/data/payload/address/address.payload";
import {AddressPayload} from "../../../security/data/payload/user/modify-profile.payload";

@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    RouterLink
  ],
  templateUrl: './address-book.component.html',
  styleUrl: './address-book.component.scss'
})
export class AddressBookComponent implements OnInit {
  protected readonly securityService = inject(SecurityService);
  protected readonly translateService = inject(TranslateService);
  protected readonly modalService = inject(ModalService);

  protected showAddressForm = false;
  protected editingAddress: Address | null = null;
  protected addressType: 'shipping' | 'billing' = 'shipping';

  protected shippingAddresses: Address[] = [];
  protected billingAddresses: Address[] = [];

  protected addressForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    road: new FormControl('', [Validators.required]),
    nb: new FormControl('', [Validators.required]),
    cp: new FormControl('', [Validators.required]),
    town: new FormControl('', [Validators.required]),
    country: new FormControl('France', [Validators.required]),
    complement: new FormControl(''),
    label: new FormControl(''),
    isDefault: new FormControl(false)
  });

  protected addressFormConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.address.firstname.label'),
      formControl: this.addressForm.get('firstname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.firstname.placeholder')
    },
    {
      label: this.translateService.instant('form.address.lastname.label'),
      formControl: this.addressForm.get('lastname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.lastname.placeholder')
    },
    {
      label: this.translateService.instant('form.address.road.label'),
      formControl: this.addressForm.get('road') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.road.placeholder')
    },
    {
      label: this.translateService.instant('form.address.nb.label'),
      formControl: this.addressForm.get('nb') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.nb.placeholder')
    },
    {
      label: this.translateService.instant('form.address.cp.label'),
      formControl: this.addressForm.get('cp') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.cp.placeholder')
    },
    {
      label: this.translateService.instant('form.address.town.label'),
      formControl: this.addressForm.get('town') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.town.placeholder')
    },
    {
      label: this.translateService.instant('form.address.country.label'),
      formControl: this.addressForm.get('country') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.country.placeholder')
    },
    {
      label: this.translateService.instant('form.address.complement.label'),
      formControl: this.addressForm.get('complement') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.complement.placeholder')
    },
    {
      label: this.translateService.instant('form.address.label.label'),
      formControl: this.addressForm.get('label') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.label.placeholder')
    }
  ];

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    const user = this.securityService.account$();
    if (user) {
      this.shippingAddresses = user.addresses.filter(addr => addr.isShippingAddress);
      this.billingAddresses = user.addresses.filter(addr => addr.isBillingAddress);
    }
  }

  openAddressForm(type: 'shipping' | 'billing') {
    this.addressType = type;
    this.addressForm.reset();
    this.addressForm.patchValue({ country: 'France' });
    this.showAddressForm = true;
    this.editingAddress = null;
  }

  editAddress(address: Address, type: 'shipping' | 'billing') {
    this.addressType = type;
    this.editingAddress = address;
    this.addressForm.patchValue({
      firstname: address.firstname,
      lastname: address.lastname,
      road: address.road,
      nb: address.nb,
      cp: address.cp,
      town: address.town,
      country: address.country,
      complement: address.complement,
      label: address.label,
      isDefault: address.isDefault === 'true'
    });
    this.showAddressForm = true;
  }

  deleteAddress(address: Address) {
    if (address.address_id) {
      const payload: DeleteAddressPayload = { addressId: address.address_id };

      this.securityService.deleteAddress(address.address_id!).subscribe({
        next: () => {
          // Mise à jour locale des adresses
          if (address.isShippingAddress) {
            this.shippingAddresses = this.shippingAddresses.filter(addr => addr.address_id !== address.address_id);
          }
          if (address.isBillingAddress) {
            this.billingAddresses = this.billingAddresses.filter(addr => addr.address_id !== address.address_id);
          }

          // Mise à jour du state global après
          this.securityService.me().subscribe();
        },
        error: (error) => console.error('Erreur lors de la suppression de l\'adresse', error)
      });
    }
  }

  onSubmitAddress() {
    if (this.addressForm.valid) {
      const formValues = this.addressForm.value;

      if (this.editingAddress) {
        // Modification d'une adresse existante
        const modifyPayload: ModifyAddressPayload = {
          addressId: this.editingAddress.address_id!,
          ...formValues,
          isShippingAddress: this.addressType === 'shipping',
          isBillingAddress: this.addressType === 'billing'
        };

        this.securityService.modifyAddress(modifyPayload).subscribe({
          next: (response) => {
            // Mise à jour locale des adresses
            const updatedAddress = response.data;
            if (this.addressType === 'shipping') {
              this.shippingAddresses = this.shippingAddresses.map(addr =>
                addr.address_id === updatedAddress.address_id ? updatedAddress : addr
              );
            } else {
              this.billingAddresses = this.billingAddresses.map(addr =>
                addr.address_id === updatedAddress.address_id ? updatedAddress : addr
              );
            }

            this.showAddressForm = false;
            this.addressForm.reset();

            // Mise à jour du state global après
            this.securityService.me().subscribe();
          },
          error: (error) => console.error('Erreur lors de la modification de l\'adresse', error)
        });
      } else {
        // Création d'une nouvelle adresse
        const addPayload: AddAddressPayload = {
          ...formValues,
          isShippingAddress: this.addressType === 'shipping',
          isBillingAddress: this.addressType === 'billing'
        };

        this.securityService.addAddress(addPayload).subscribe({
          next: (response) => {
            // Mise à jour locale des adresses
            const newAddress = response.data;
            if (this.addressType === 'shipping') {
              this.shippingAddresses = [...this.shippingAddresses, newAddress];
            } else {
              this.billingAddresses = [...this.billingAddresses, newAddress];
            }

            this.showAddressForm = false;
            this.addressForm.reset();

            // Mise à jour du state global après
            this.securityService.me().subscribe();
          },
          error: (error) => console.error('Erreur lors de l\'ajout de l\'adresse', error)
        });
      }
    }
  }

  formatAddress(address: Address): string {
    return `${address.road} ${address.nb}, ${address.cp} ${address.town}, ${address.country}`;
  }
}
