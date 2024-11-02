import { Component } from '@angular/core';
import {OrderConfirmationComponent} from "../../component/order-confirmation/order-confirmation.component";

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [
    OrderConfirmationComponent
  ],
  templateUrl: './order-confirmation-page.component.html',
  styleUrl: './order-confirmation-page.component.scss'
})
export class OrderConfirmationPageComponent {

}
