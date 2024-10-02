import {FormControl} from "@angular/forms";

export interface FormcontrolSimpleConfig{
  label?: string ;
  formControl: FormControl;
  inputType: string;
  placeholder?: string;
  readonly?: boolean;
  options?: { value: string | number; label: string }[];
}
