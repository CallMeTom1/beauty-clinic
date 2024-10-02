import {FormControl} from "@angular/forms";

export interface SignupForm {
  mail: FormControl<string | null>;
  password: FormControl<string | null>;
}
