import {Component, effect, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {User} from "../../../../../security/data/model/user";

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
export class AddressFormComponent implements OnInit{
  @Input() formType: 'shipping' | 'billing' = 'shipping'; // Type d'adresse (livraison ou facturation)
  @Output() addressSubmitted = new EventEmitter<any>(); // Événement émis lors de la soumission
  @Input() addOrUpdate: 'add' | 'update' = 'add'; // Type d'adresse (livraison ou facturation)
  protected securityService:SecurityService = inject(SecurityService);

  addressForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }
  constructor() {
    effect(() => {
      const account = this.securityService.account$();
      if (account && account.firstname) {
        this.updateFormWithAccountData(account);
      }
    });
  }

  private updateFormWithAccountData(account: User): void {
    const addressToUse = this.formType === 'shipping' ? account.shippingAddress : account.billingAddress;

    this.addressForm.patchValue({
      firstname: account.firstname,
      lastname: account.lastname,
      phoneNumber: account.phoneNumber,
      address: addressToUse ? {
        road: addressToUse.road,
        nb: addressToUse.nb,
        cp: addressToUse.cp,
        town: addressToUse.town,
        country: addressToUse.country,
        complement: addressToUse.complement
      } : {}
    });
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
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.addressSubmitted.emit({
        type: this.formType, // Envoie le type d'adresse
        address: this.addressForm.value, // Envoie les données du formulaire
        addOrdUpdate: this.addOrUpdate
      });
    }
  }
}
