import { Component } from '@angular/core';
import {ManageCustomerComponent} from "../../component/manage-customer/manage-customer.component";

@Component({
  selector: 'app-manage-customer-page',
  standalone: true,
  imports: [
    ManageCustomerComponent
  ],
  templateUrl: './manage-customer-page.component.html',
  styleUrl: './manage-customer-page.component.scss'
})
export class ManageCustomerPageComponent {

}
