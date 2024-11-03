import {FormControl} from "@angular/forms";

export interface SignupForm {
  username: FormControl<string | null>;
  firstname: FormControl<string | null>;
  lastname: FormControl<string | null>;
  mail: FormControl<string | null>;
  password: FormControl<string | null>;
}

/*
{
  "username": "string",
  "firstname": "string",
  "lastname": "string",
  "mail": "string",
  "password": "string"
}
 */
