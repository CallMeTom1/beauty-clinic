import {Business} from "@shared-core";
import {DayOfWeekEnum} from "../../day-of-week.enum";

export interface BusinessHours extends Business{
  businessHours_id: string;
  day_of_week: DayOfWeekEnum;
  opening_time: string;  // e.g., '09:00:00'
  closing_time: string;  // e.g., '17:00:00'
  is_open: boolean;  // Indicates whether the business is open on this day
}
