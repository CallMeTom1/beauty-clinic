import { Component } from '@angular/core';
import {ManageHolidayComponent} from "../../component/manage-holiday/manage-holiday.component";

@Component({
  selector: 'app-manage-holiday-page',
  standalone: true,
  imports: [
    ManageHolidayComponent
  ],
  templateUrl: './manage-holiday-page.component.html',
  styleUrl: './manage-holiday-page.component.scss'
})
export class ManageHolidayPageComponent {

}
