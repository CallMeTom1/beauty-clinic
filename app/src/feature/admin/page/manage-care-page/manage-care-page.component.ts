import { Component } from '@angular/core';
import {ManageCareComponent} from "../../component/manage-care/manage-care.component";
import {ManageCareCategoryComponent} from "../../component/manage-care-category/manage-care-category.component";
import {
  ManageCareSubCategoryComponent
} from "../../component/manage-care-sub-category/manage-care-sub-category.component";
import {ManageCareBodyZoneComponent} from "../../component/manage-care-body-zone/manage-care-body-zone.component";
import {ManageCareMachineComponent} from "../../component/manage-care-machine/manage-care-machine.component";

@Component({
  selector: 'app-manage-care-page',
  standalone: true,
  imports: [
    ManageCareComponent,
    ManageCareCategoryComponent,
    ManageCareSubCategoryComponent,
    ManageCareBodyZoneComponent,
    ManageCareMachineComponent
  ],
  templateUrl: './manage-care-page.component.html',
  styleUrl: './manage-care-page.component.scss'
})
export class ManageCarePageComponent {

}
