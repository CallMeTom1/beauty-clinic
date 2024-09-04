import {FormControl} from "@angular/forms";

export interface BusinessHoursForm {
  opening_time: FormControl<string | null>;  // e.g., '09:00:00'
  closing_time: FormControl<string | null>;  // e.g., '17:00:00'
  is_open: FormControl<string | null>;  // Indicates whether the business is open on this day
}
