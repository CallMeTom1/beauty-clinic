import {Component, effect, inject} from '@angular/core';
import {PaymentFormComponent} from "../../../security/component/payment-form/payment-form.component";
import {CurrencyPipe, NgIf} from "@angular/common";
import {
  OrderConfirmationAddressComponent
} from "../../component/order-confirmation-address/order-confirmation-address.component";
import {OrderSummaryComponent} from "../../component/order-summary/order-summary.component";
import {SummaryCartComponent} from "../../../cart/component/summary-cart/summary-cart.component";

@Component({
  selector: 'app-confirm-payment-page',
  standalone: true,
  imports: [
    PaymentFormComponent,
    CurrencyPipe,
    NgIf,
    OrderConfirmationAddressComponent,
    OrderSummaryComponent,
    SummaryCartComponent
  ],
  templateUrl: './confirm-payment-page.component.html',
  styleUrl: './confirm-payment-page.component.scss'
})
export class ConfirmPaymentPageComponent {

  protected addressValidated: boolean = false;
  protected showPaymentForm: boolean = false;

  onAddressesValidated(isValid: boolean) {
    this.addressValidated = isValid;
  }

  onProceedToPayment() {
    this.showPaymentForm = true;
  }

}
