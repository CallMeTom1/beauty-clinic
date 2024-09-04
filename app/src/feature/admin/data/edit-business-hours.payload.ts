import {Payload} from "@shared-core";
import {DayOfWeekEnum} from "../../business-hours/day-of-week.enum";

export interface EditBusinessHoursPayload extends Payload {
  opening_time: string;  // e.g., '09:00:00'
  closing_time: string;  // e.g., '17:00:00'
  is_open: boolean;  // Indicates whether the business is open on this day

}
