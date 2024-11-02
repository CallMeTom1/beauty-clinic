import { Component } from '@angular/core';
import {ManageShippingFeeComponent} from "../../component/manage-shipping-fee/manage-shipping-fee.component";
import {ManageOrderComponent} from "../../component/manage-order/manage-order.component";

@Component({
  selector: 'app-manage-order-page',
  standalone: true,
  imports: [
    ManageShippingFeeComponent,
    ManageOrderComponent
  ],
  templateUrl: './manage-order-page.component.html',
  styleUrl: './manage-order-page.component.scss'
})
export class ManageOrderPageComponent {

}
