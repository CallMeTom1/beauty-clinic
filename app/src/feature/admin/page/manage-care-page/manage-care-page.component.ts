import { Component } from '@angular/core';
import {ManageCareComponent} from "../../component/manage-care/manage-care.component";

@Component({
  selector: 'app-manage-care-page',
  standalone: true,
  imports: [
    ManageCareComponent
  ],
  templateUrl: './manage-care-page.component.html',
  styleUrl: './manage-care-page.component.scss'
})
export class ManageCarePageComponent {

}
