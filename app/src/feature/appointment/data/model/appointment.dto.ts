import {AppointmentStatus} from "../../appointment-status.enum";
import {UserDetail} from "./user.detail";
import {CareDetail} from "./care.detail";

export interface AppointmentDto {
  appointment_id: string;
  care_id: string;
  user_id: string;
  start_time: string;  // 'YYYY-MM-DD HH:mm:ss' format
  end_time?: string;     // 'YYYY-MM-DD HH:mm:ss' format
  status: AppointmentStatus;
  notes?: string;
  userDetail?: UserDetail;
  careDetail?: CareDetail;


}
