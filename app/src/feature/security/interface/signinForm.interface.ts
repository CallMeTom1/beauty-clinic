import {FormControl} from "@angular/forms";

export interface SigninForm {
  mail: FormControl<string | null>;
  password: FormControl<string | null>;
}
