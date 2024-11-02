import { Appointment } from "../../appointment/data/model/appointment.business";
import { AppointmentStatus } from "../../appointment/appointment-status.enum";
import {UserUtils} from "@feature-security";
import {CareUtils} from "./care.utils";

export class AppointmentUtils {


  public static getEmpty(): Appointment {
    return {
      appointment_id: '',
      care_id: '',
      user_id: '',
      start_time: '',                // Format 'YYYY-MM-DD HH:mm:ss'
      end_time: '',                  // Format 'YYYY-MM-DD HH:mm:ss', optional
      status: AppointmentStatus.PENDING,  // Default status
      notes: '',
      user: UserUtils.getEmpty(),         // Properly initialized as undefined
      care: CareUtils.getEmpty()          // Properly initialized as undefined
    };
  };


  public static getEmpties(): Appointment[] {
    return [this.getEmpty()];
  };
}
