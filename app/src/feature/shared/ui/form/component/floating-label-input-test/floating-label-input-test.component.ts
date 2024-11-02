import {Component, Input} from '@angular/core';
import {FormErrorComponent} from "../form-error/form-error.component";
import {ReactiveFormsModule} from "@angular/forms";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-floating-label-input-test',
  standalone: true,
  imports: [
    FormErrorComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './floating-label-input-test.component.html',
  styleUrl: './floating-label-input-test.component.scss'
})
export class FloatingLabelInputTestComponent {
  @Input({required: true}) config!: FormcontrolSimpleConfig;
  @Input() label!: FormcontrolSimpleConfig;
  public inputFocus: boolean = false;

}
