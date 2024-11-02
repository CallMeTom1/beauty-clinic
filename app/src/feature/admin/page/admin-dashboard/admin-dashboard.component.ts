import { Component } from '@angular/core';
import {CalendarAppointmentComponent} from "../../component/calendar-appointment/calendar-appointment.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CalendarAppointmentComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

}
