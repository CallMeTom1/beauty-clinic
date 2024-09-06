// Validator function to validate HH:mm format
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function timeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(control.value);
    return isValidTime ? null : { invalidTime: true };
  };
}
