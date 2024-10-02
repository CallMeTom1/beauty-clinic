import {Component, Input} from '@angular/core';
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;

  getErrorKeys(errors: ValidationErrors | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

}
