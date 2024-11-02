import { Component } from '@angular/core';
import {ManageClinicComponent} from "../../component/manage-clinic/manage-clinic.component";
import {ManageBusinessHoursComponent} from "../../component/manage-business-hours/manage-business-hours.component";
import {ManageHolidayComponent} from "../../component/manage-holiday/manage-holiday.component";

@Component({
  selector: 'app-manage-clinic-page',
  standalone: true,
  imports: [
    ManageClinicComponent,
    ManageBusinessHoursComponent,
    ManageHolidayComponent
  ],
  templateUrl: './manage-clinic-page.component.html',
  styleUrl: './manage-clinic-page.component.scss'
})
export class ManageClinicPageComponent {

}
