
import {FormGroup, ValidationErrors} from "@angular/forms";
import {FormError, GetAllFormErrorsFn} from "./index";

export const getFormValidationErrors: GetAllFormErrorsFn = (form: FormGroup): FormError[] => {
    const result: FormError[] = [];
    Object.keys(form.controls).forEach(key => {
        const controlErrors: ValidationErrors | null = form.get(key)!.errors;
        if (controlErrors) {
            Object.keys(controlErrors).forEach(keyError => {
                result.push({
                    control: key,
                    error: keyError,
                    value: controlErrors[keyError]
                });
            });
        }
    });
    return result;
}
