import {Component, effect, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {User} from "../../../../../security/data/model/user";
import {Address} from "../../../../../security/data/model/user/address.business";

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent implements OnInit {
  @Input() formType: 'shipping' | 'billing' = 'shipping';
  @Input() addOrUpdate: 'add' | 'update' = 'add';
  @Output() addressSubmitted = new EventEmitter<{
    type: 'shipping' | 'billing';
    address: Partial<Address>;
    addOrUpdate: 'add' | 'update';
  }>();

  protected securityService: SecurityService = inject(SecurityService);
  addressForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  constructor() {
    effect(() => {
      const account = this.securityService.account$();
      if (account && account.addresses?.length) {
        this.updateFormWithAccountData(account);
      }
    });
  }

  private updateFormWithAccountData(account: User): void {
    const addressToUse = account.addresses.find(addr =>
      this.formType === 'shipping' ? addr.isShippingAddress : addr.isBillingAddress
    );

    if (addressToUse) {
      this.addressForm.patchValue({
        firstname: addressToUse.firstname,
        lastname: addressToUse.lastname,
        label: addressToUse.label || '',
        isDefault: addressToUse.isDefault || 'false',
        road: addressToUse.road,
        nb: addressToUse.nb,
        cp: addressToUse.cp,
        town: addressToUse.town,
        country: addressToUse.country,
        complement: addressToUse.complement
      });
    } else {
      // Si pas d'adresse, on pré-remplit juste le nom/prénom avec les infos du compte
      this.addressForm.patchValue({
        firstname: account.firstname,
        lastname: account.lastname
      });
    }
  }

  createForm() {
    this.addressForm = new FormGroup({
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
      complement: new FormControl('')
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const formValue = this.addressForm.value;

      const addressData: Partial<Address> = {
        ...formValue,
        isShippingAddress: this.formType === 'shipping',
        isBillingAddress: this.formType === 'billing'
      };

      this.addressSubmitted.emit({
        type: this.formType,
        address: addressData,
        addOrUpdate: this.addOrUpdate
      });
    }
  }
}
