import {FormGroup} from '@angular/forms';
import {DestroyRef, WritableSignal} from '@angular/core';
export interface FormError {
    control: string;
    value: any;
    error: string;
}
export type HandleValueChangeFn = (form:FormGroup, signal:WritableSignal<FormError[]>)=> void;
export type GetAllFormErrorsFn = (form: FormGroup) => FormError[];
