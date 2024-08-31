import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormFieldComponent } from '../form-field/form-field.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    NgForOf,
    TranslateModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() config: any[] = []; // Configuration des champs du formulaire
  form: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private translate: TranslateService) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.config.forEach(field => {
      const validators = this.getValidators(field.validators);
      this.form.addControl(field.name, this.fb.control('', validators));
    });
  }

  getValidators(validatorsConfig: any): any[] {
    const validators = [];
    if (validatorsConfig?.required) {
      validators.push(Validators.required);
    }
    if (validatorsConfig?.minlength) {
      validators.push(Validators.minLength(validatorsConfig.minlength));
    }
    if (validatorsConfig?.maxlength) {
      validators.push(Validators.maxLength(validatorsConfig.maxlength));
    }
    if (validatorsConfig?.email) {
      validators.push(Validators.email);
    }
    return validators;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
