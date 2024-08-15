import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {
  FloatingLabelInputComponent,
  FormcontrolSimpleConfig,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-security-form',
    standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputComponent,
    LabelWithParamPipe,
    LabelWithParamComponent,
    TranslateModule,
  ],
    templateUrl: './security-form.component.html',
    styleUrl: './security-form.component.scss'
})
export class SecurityFormComponent {

    @Input({required: true}) formGroup!: FormGroup;
    @Input({required: true}) config!: FormcontrolSimpleConfig[];
    @Input() icon: string = 'fa-solid fa-unlock';
    @Input() title: string = 'security-feature-form-title'
    @Input() redirect: string = 'security-feature-form-redirect';
    @Output() initiateSubmit: EventEmitter<void> = new EventEmitter<void>();
    @Output() redirectSignup: EventEmitter<void> = new EventEmitter<void>();

    triggerFormSubmission(): void {
        if (!this.formGroup.invalid) {
            this.initiateSubmit.emit();
        }
    }
}
