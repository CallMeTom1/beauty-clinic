import { FormControl } from "@angular/forms";

export interface CareForm {
  name: FormControl<string | null>;
  beauty_care_machine: FormControl<string | null>;
  category: FormControl<string | null>;
  zone: FormControl<string | null>;
  sessions: FormControl<number | null>;
  price: FormControl<number | null>;
  duration: FormControl<string | null>;
  time_between: FormControl<string | null>;
}
