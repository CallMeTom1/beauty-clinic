import {FormControl} from "@angular/forms";

export interface SignupForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  mail: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  firstname: FormControl<string | null>;
  lastname: FormControl<string | null>;

}
