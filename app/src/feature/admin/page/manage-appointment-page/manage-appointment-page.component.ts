import { Component } from '@angular/core';
import {ManageAppointmentComponent} from "../../component/manage-appointment/manage-appointment.component";

@Component({
  selector: 'app-manage-appointment-page',
  standalone: true,
  imports: [
    ManageAppointmentComponent
  ],
  templateUrl: './manage-appointment-page.component.html',
  styleUrl: './manage-appointment-page.component.scss'
})
export class ManageAppointmentPageComponent {

}
