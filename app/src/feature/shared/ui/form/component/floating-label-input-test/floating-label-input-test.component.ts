import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-floating-label-input-test',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './floating-label-input-test.component.html',
  styleUrl: './floating-label-input-test.component.scss'
})
export class FloatingLabelInputTestComponent {
  @Input() config!: any;
  @Input() formControl!: AbstractControl | null;  // Accepter AbstractControl

  inputFocus = false;

  // Vérifie si le contrôle est un FormControl
  get formControlAsFormControl(): FormControl | null {
    return this.formControl instanceof FormControl ? this.formControl : null;
  }
}
