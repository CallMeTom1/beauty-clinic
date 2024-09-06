import {HolidayDto} from "../../holiday/data/model/holiday.dto";
import {Holiday} from "../../holiday/data/model/holiday.business";

export class HolidayUtils {

  // Convert a DTO to a business model
  public static fromDto(dto: HolidayDto): Holiday {
    return {
      holiday_id: dto.holiday_id,
      holiday_date: new Date(dto.holiday_date) // Make sure holiday_date is a Date object
    }
  }

  // Provide an empty Holiday object with default values
  public static getEmpty(): Holiday {
    return {
      holiday_id: '',
      holiday_date: new Date() // Default to current date, you can adjust if needed
    }
  }

  // Convert a business model back to DTO format
  public static toDto(holiday: Holiday): HolidayDto {
    return {
      holiday_id: holiday.holiday_id,
      holiday_date: holiday.holiday_date  // Assuming this is already a Date object
    }
  }

  // Provide an array of empty Holiday objects
  public static getEmpties(): Holiday[] {
    return [{
      holiday_id: '',
      holiday_date: new Date()  // Default to current date for multiple empties
    }];
  }
}
