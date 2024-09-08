import { AppointmentDto } from "../../appointment/data/model/appointment.dto";
import { Appointment } from "../../appointment/data/model/appointment.business";
import { AppointmentStatus } from "../../appointment/appointment-status.enum";

export class AppointmentUtils {

  public static fromDto(dto: AppointmentDto): Appointment {
    return {
      appointment_id: dto.appointment_id,
      care_id: dto.care_id,
      user_id: dto.user_id,
      start_time: dto.start_time,
      end_time: dto.end_time ?? '',  // Provide an empty string by default if end_time is null
      status: dto.status,
      notes: dto.notes ?? '',        // Provide an empty string by default if notes are null
      userDetail: dto.userDetail ?? undefined,  // Handle undefined properly
      careDetail: dto.careDetail ?? undefined   // Handle undefined properly
    };
  };

  public static getEmpty(): Appointment {
    return {
      appointment_id: '',
      care_id: '',
      user_id: '',
      start_time: '',                // Format 'YYYY-MM-DD HH:mm:ss'
      end_time: '',                  // Format 'YYYY-MM-DD HH:mm:ss', optional
      status: AppointmentStatus.PENDING,  // Default status
      notes: '',
      userDetail: undefined,         // Properly initialized as undefined
      careDetail: undefined          // Properly initialized as undefined
    };
  };

  public static toDto(appointment: Appointment): AppointmentDto {
    return {
      appointment_id: appointment.appointment_id,
      care_id: appointment.care_id,
      user_id: appointment.user_id,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status,
      notes: appointment.notes,
      userDetail: appointment.userDetail ?? undefined,  // Ensure proper null handling
      careDetail: appointment.careDetail ?? undefined   // Ensure proper null handling
    };
  };

  public static getEmpties(): Appointment[] {
    return [this.getEmpty()];
  };
}
