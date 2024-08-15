import {Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  FloatingLabelInputComponent,
  FormcontrolSimpleConfig, FormError, handleFormError,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FloatingLabelInputComponent,
    TranslateModule,
    LabelWithParamComponent,
    LabelWithParamPipe
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  @Input({required: true}) formGroup!: FormGroup;
  @Input({required: true}) config!: FormcontrolSimpleConfig[];
  @Output() initiateSubmit: EventEmitter<void> = new EventEmitter<void>();

  triggerFormSubmission(): void {
    if (!this.formGroup.invalid) {
      this.initiateSubmit.emit();
    }
  }
}
