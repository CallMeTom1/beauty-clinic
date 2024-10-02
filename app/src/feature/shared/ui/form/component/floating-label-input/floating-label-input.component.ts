import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import {FormcontrolSimpleConfig} from "../../data";
import {FormErrorComponent} from "../form-error/form-error.component";

@Component({
  selector: 'app-floating-label-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './floating-label-input.component.html',
  styleUrls: ['./floating-label-input.component.scss']
})
export class FloatingLabelInputComponent  {
  @Input({required: true}) config!: FormcontrolSimpleConfig;
  @Input() label!: FormcontrolSimpleConfig;
  public inputFocus: boolean = false;

}
