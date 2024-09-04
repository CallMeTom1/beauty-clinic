import {BusinessHoursDto} from "../../business-hours/data/model/business-hours.dto";
import {BusinessHours} from "../../business-hours/data/model/business-hours.business";
import {DayOfWeekEnum} from "../../business-hours/day-of-week.enum";

export class BusinessHoursUtils{

  public static fromDto(dto: BusinessHoursDto): BusinessHours{
    return {
      businessHours_id: dto.businessHours_id,
      day_of_week: dto.day_of_week,
      opening_time: dto.opening_time,
      closing_time: dto.closing_time,
      is_open: dto.is_open,
    }
  }

  public static getEmpty(): BusinessHours{
    return {
      businessHours_id: "",
      day_of_week: DayOfWeekEnum.MONDAY,
      opening_time: "",
      closing_time: "",
      is_open: false,
    }
  }

  public static toDto(business: BusinessHours): BusinessHoursDto{
    return {
      businessHours_id: business.businessHours_id,
      day_of_week: business.day_of_week,
      opening_time: business.opening_time,
      closing_time: business.closing_time,
      is_open: business.is_open,
    }
  }

  public static getEmpties(): BusinessHours[]{
    return [{
      businessHours_id: "",
      day_of_week: DayOfWeekEnum.MONDAY,
      opening_time: "",
      closing_time: "",
      is_open: false,
    }]
  }

}
