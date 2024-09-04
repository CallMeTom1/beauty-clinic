import {CareCategory} from "../../../care/enum/care-category.enum";
import {FormControl} from "@angular/forms";

export interface ContactForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  careCategory: FormControl<CareCategory | null>;
  message: FormControl<string | null>;
}
