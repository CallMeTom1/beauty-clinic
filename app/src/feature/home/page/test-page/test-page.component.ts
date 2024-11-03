import {Component, effect, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatingLabelInputComponent, FormcontrolSimpleConfig} from "@shared-ui";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {AddressFormComponent} from "../../../shared/ui/form/component/address-form/address-form.component";

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [


  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss'
})
export class TestPageComponent {


}
