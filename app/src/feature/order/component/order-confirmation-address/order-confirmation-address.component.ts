import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {SecurityService} from "@feature-security";
import {AddressFormComponent} from "../../../shared/ui/form/component/address-form/address-form.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {ModifyProfilePayload} from "../../../security/data/payload/user/modify-profile.payload";

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

  protected readonly securityService: SecurityService = inject(SecurityService);
  displayShippingModifyForm = false;
  displayShippingAddForm = false;
  isAddressesValid: boolean = false;

  displayBillingModifyForm = false;
  displayBillingAddForm = false;
  private _isBillingSameAsShipping: boolean = false;


  checkAddressesValidity() {
    this.isAddressesValid = this.isShippingAddressComplete() &&
      (this.isBillingSameAsShipping() || this.isBillingAddressComplete());
    this.proceedToPayment.emit();
  }

  validateAndProceedToPayment() {
    if (this.isAddressesValid) {
      console.log('isAddressValid', this.isAddressesValid)
      this.proceedToPayment.emit();
    }
  }

  // Assurez-vous d'appeler checkAddressesValidity() dans le ngOnInit et après chaque modification d'adresse
  ngOnInit() {
    setTimeout(() => {
      this.checkAddressesValidity();
    }, 500);
  }
  showShippingAddForm() {
    this.displayShippingAddForm = true;
  }

  showShippingModifyForm() {
    this.displayShippingModifyForm = true;
  }

  showBillingAddForm() {
    this.displayBillingAddForm = true;
  }

  showBillingModifyForm() {
    this.displayBillingModifyForm = true;
  }

  handleAddressSubmission(event: any) {
    const addressData = event?.type && event?.address ? event : null;

    if (!addressData) {
      this.closeAllModals();
      return;
    }
    this.checkAddressesValidity();


    console.log(addressData);

    const payload: ModifyProfilePayload = {
      firstname: addressData.address.firstname,
      lastname: addressData.address.lastname,
      phoneNumber: addressData.address.phoneNumber,
      Address: {
        road: addressData.address.address.road,
        nb: addressData.address.address.nb,
        cp: addressData.address.address.cp,
        town: addressData.address.address.town,
        country: addressData.address.address.country,
        complement: addressData.address.address.complement
      },
      addressType: addressData.type // Utilisez le type fourni par l'événement
    };

    this.securityService.modifyProfile(payload).subscribe({
      next: (response) => {
        console.log('Profil mis à jour avec succès', response);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil', error);
      },
      complete: () => {
        this.closeAllModals();
      }
    });
  }

  private closeAllModals(): void {
    this.displayShippingAddForm = false;
    this.displayShippingModifyForm = false;
    this.displayBillingAddForm = false;
    this.displayBillingModifyForm = false;
  }


  closeShippingAddModal(): void {
    this.displayShippingAddForm = false;  // Ferme le modal pour l'adresse de livraison
  }

  closeShippingModifyModal(): void {
    this.displayShippingModifyForm = false;  // Ferme le modal pour l'adresse de livraison
  }

  closeBillingAddModal(): void {
    this.displayBillingAddForm = false;  // Ferme le modal pour l'adresse de facturation
  }

  closeBillingModifyModal(): void {
    this.displayBillingModifyForm = false;  // Ferme le modal pour l'adresse de facturation
  }

  isShippingAddressComplete(): boolean {
    const account = this.securityService.account$()
    return !!(account && account.firstname && account.lastname
      && account.phoneNumber && account.shippingAddress && account.shippingAddress.road && account.shippingAddress.nb && account.shippingAddress.cp && account.shippingAddress.town && account.shippingAddress.country);
  }

  isBillingAddressComplete(): boolean {
    const account = this.securityService.account$()
    return !!(account && account.firstname && account.lastname && account.phoneNumber && account.billingAddress && account.billingAddress.road && account.billingAddress.nb && account.billingAddress.cp && account.billingAddress.town && account.billingAddress.country);
  }

  isBillingSameAsShipping(): boolean {
    return this._isBillingSameAsShipping;
  }

  toggleBillingSameAsShipping(): void {
    this._isBillingSameAsShipping = !this._isBillingSameAsShipping;
    this.checkAddressesValidity();

    if (this._isBillingSameAsShipping) {
      const payload = this.copyShippingToBilling();
      if (payload) {
        this.securityService.modifyProfile(payload).subscribe({
          next: (response) => {
            console.log('Adresse de facturation mise à jour avec succès', response);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'adresse de facturation', error);
          }
        });
      }
    }
  }

  private copyShippingToBilling(): ModifyProfilePayload | null {
    const account = this.securityService.account$();
    if (!account || !account.shippingAddress) {
      return null; // Pas d'adresse de livraison à copier
    }

    // Vérifier si les adresses sont déjà identiques
    if (this.areAddressesIdentical(account.shippingAddress, account.billingAddress)) {
      return null; // Pas besoin de copier, les adresses sont déjà identiques
    }

    // Construire le payload pour la mise à jour
    const payload: ModifyProfilePayload = {
      Address: {
        road: account.shippingAddress.road,
        nb: account.shippingAddress.nb,
        cp: account.shippingAddress.cp,
        town: account.shippingAddress.town,
        country: account.shippingAddress.country,
        complement: account.shippingAddress.complement
      },
      addressType: 'billing' // Toujours 'billing' car on copie vers l'adresse de facturation
    };

    return payload;
  }

  private areAddressesIdentical(address1: any, address2: any): boolean {
    if (!address1 || !address2) return false;
    return (
      address1.road === address2.road &&
      address1.nb === address2.nb &&
      address1.cp === address2.cp &&
      address1.town === address2.town &&
      address1.country === address2.country &&
      address1.complement === address2.complement
    );
  }

}
