import {Component, computed, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {SecurityService} from "@feature-security";
import {AddressFormComponent} from "../../../shared/ui/form/component/address-form/address-form.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {ModifyProfilePayload} from "../../../security/data/payload/user/modify-profile.payload";
import {Address} from "../../../security/data/model/user/address.business";

@Component({
  selector: 'app-order-confirmation-address',
  standalone: true,
  imports: [
    AddressFormComponent,
    ModalComponent
  ],
  templateUrl: './order-confirmation-address.component.html',
  styleUrl: './order-confirmation-address.component.scss'
})
export class OrderConfirmationAddressComponent implements OnInit {
  @Output() addressesValidated = new EventEmitter<boolean>();
  @Output() proceedToPayment = new EventEmitter<void>();

  protected readonly securityService = inject(SecurityService);
  protected readonly shippingAddress = computed(() =>
    this.securityService.account$().addresses.find(addr => addr.isShippingAddress)
  );
  protected readonly billingAddress = computed(() =>
    this.securityService.account$().addresses.find(addr => addr.isBillingAddress)
  );

  displayShippingModifyForm = false;
  displayShippingAddForm = false;
  displayBillingModifyForm = false;
  displayBillingAddForm = false;
  isAddressesValid = false;
  private _isBillingSameAsShipping = false;

  ngOnInit() {
    this.checkAddressesValidity();
  }

  checkAddressesValidity() {
    this.isAddressesValid = this.isShippingAddressComplete() &&
      (this.isBillingSameAsShipping() || this.isBillingAddressComplete());
    this.addressesValidated.emit(this.isAddressesValid);
  }

  validateAndProceedToPayment() {
    if (this.isAddressesValid) {
      this.proceedToPayment.emit();
    }
  }

  isShippingAddressComplete(): boolean {
    const shipping = this.shippingAddress();
    return !!shipping &&
      !!shipping.firstname &&
      !!shipping.lastname &&
      !!shipping.road &&
      !!shipping.nb &&
      !!shipping.cp &&
      !!shipping.town &&
      !!shipping.country;
  }

  isBillingAddressComplete(): boolean {
    const billing = this.billingAddress();
    return !!billing &&
      !!billing.firstname &&
      !!billing.lastname &&
      !!billing.road &&
      !!billing.nb &&
      !!billing.cp &&
      !!billing.town &&
      !!billing.country;
  }

  handleAddressSubmission(event: { type: 'shipping' | 'billing', address: Partial<Address> } | any) {
    if (!event?.type || !event?.address) {
      this.closeAllModals();
      return;
    }

    const phoneNumber = this.securityService.account$().phonenumber;

    const payload: ModifyProfilePayload = {
      firstname: event.address.firstname,
      lastname: event.address.lastname,
      phonenumber: phoneNumber || undefined, // Conversion explicite de null en undefined
      Address: {
        road: event.address.road!,
        nb: event.address.nb!,
        cp: event.address.cp!,
        town: event.address.town!,
        country: event.address.country!,
        complement: event.address.complement
      },
      addressType: event.type,
      label: event.address.label,
      isDefault: 'true'
    };

    this.securityService.modifyProfile(payload).subscribe({
      next: () => {
        this.checkAddressesValidity();
        this.closeAllModals();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de l\'adresse', error);
      }
    });
  }

  isBillingSameAsShipping(): boolean {
    return this._isBillingSameAsShipping;
  }

  toggleBillingSameAsShipping(): void {
    this._isBillingSameAsShipping = !this._isBillingSameAsShipping;

    if (this._isBillingSameAsShipping) {
      const shipping = this.shippingAddress();
      const phoneNumber = this.securityService.account$().phonenumber;

      if (shipping) {
        const payload: ModifyProfilePayload = {
          firstname: shipping.firstname,
          lastname: shipping.lastname,
          phonenumber: phoneNumber || undefined, // Conversion explicite de null en undefined
          Address: {
            road: shipping.road,
            nb: shipping.nb,
            cp: shipping.cp,
            town: shipping.town,
            country: shipping.country,
            complement: shipping.complement
          },
          addressType: 'billing',
          label: shipping.label,
          isDefault: 'true'
        };

        this.securityService.modifyProfile(payload).subscribe({
          next: () => this.checkAddressesValidity(),
          error: (error) => console.error('Erreur lors de la copie de l\'adresse', error)
        });
      }
    }

    this.checkAddressesValidity();
  }

  // Modal management methods
  showShippingAddForm() { this.displayShippingAddForm = true; }
  showShippingModifyForm() { this.displayShippingModifyForm = true; }
  showBillingAddForm() { this.displayBillingAddForm = true; }
  showBillingModifyForm() { this.displayBillingModifyForm = true; }

  closeShippingAddModal() { this.displayShippingAddForm = false; }
  closeShippingModifyModal() { this.displayShippingModifyForm = false; }
  closeBillingAddModal() { this.displayBillingAddForm = false; }
  closeBillingModifyModal() { this.displayBillingModifyForm = false; }

  private closeAllModals(): void {
    this.displayShippingAddForm = false;
    this.displayShippingModifyForm = false;
    this.displayBillingAddForm = false;
    this.displayBillingModifyForm = false;
  }
}
