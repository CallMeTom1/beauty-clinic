import { Component } from '@angular/core';
import {ManageBusinessHoursComponent} from "../../component/manage-business-hours/manage-business-hours.component";

@Component({
  selector: 'app-manage-business-hours-page',
  standalone: true,
  imports: [
    ManageBusinessHoursComponent
  ],
  templateUrl: './manage-business-hours-page.component.html',
  styleUrl: './manage-business-hours-page.component.scss'
})
export class ManageBusinessHoursPageComponent {

}
