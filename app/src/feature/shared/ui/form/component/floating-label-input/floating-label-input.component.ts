import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import {FormcontrolSimpleConfig} from "../../data";
import {NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-floating-label-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgSwitch, NgSwitchCase, TranslateModule, NgForOf],
  templateUrl: './floating-label-input.component.html',
  styleUrls: ['./floating-label-input.component.scss']
})
export class FloatingLabelInputComponent  {
  @Input({required: true}) config!: FormcontrolSimpleConfig;
  @Input() label!: FormcontrolSimpleConfig;
  public inputFocus: boolean = false;

}
