import {Business} from "@shared-core";
import {AppointmentStatus} from "../../appointment-status.enum";
import {Care} from "../../../security/data/model/care/care.business";
import {User} from "../../../security/data/model/user";

export interface Appointment extends Business {
  appointment_id: string;
  care_id: string;
  user_id: string;
  start_time: string;  // 'YYYY-MM-DD HH:mm:ss' format
  end_time?: string;     // 'YYYY-MM-DD HH:mm:ss' format
  status: AppointmentStatus;
  notes?: string;
  user: User;
  care: Care;

}
