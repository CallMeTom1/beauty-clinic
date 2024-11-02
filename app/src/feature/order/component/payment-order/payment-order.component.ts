import { Component } from '@angular/core';
import {PaymentFormComponent} from "../../../security/component/payment-form/payment-form.component";

@Component({
  selector: 'app-payment-order',
  standalone: true,
  imports: [
    PaymentFormComponent
  ],
  templateUrl: './payment-order.component.html',
  styleUrl: './payment-order.component.scss'
})
export class PaymentOrderComponent {

}
