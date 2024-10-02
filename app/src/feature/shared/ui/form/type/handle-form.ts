import {FormGroup} from '@angular/forms';
import {FormError, HandleValueChangeFn} from '../type';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {WritableSignal} from '@angular/core';
import {map, tap} from 'rxjs';
import {getFormValidationErrors} from "./form-validator";

export const handleFormError: HandleValueChangeFn = (form: FormGroup, signal:
  WritableSignal<FormError[]>): void => {
  form.valueChanges
    .pipe(
      // that's mean kill this observer when component is destroyed
      takeUntilDestroyed(),
      // transform the value to FormError array
      map(() => getFormValidationErrors(form)),
      // send signal with new errors
      tap((errors: FormError[]) => signal.set(errors)))
    .subscribe();
}
