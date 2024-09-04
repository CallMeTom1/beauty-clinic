import {DayOfWeekEnum} from "../business-hours/day-of-week.enum";

export function getDayOfWeekEnum(dayIndex: number): DayOfWeekEnum {
    switch(dayIndex) {
        case 0:
            return DayOfWeekEnum.SUNDAY;
        case 1:
            return DayOfWeekEnum.MONDAY;
        case 2:
            return DayOfWeekEnum.TUESDAY;
        case 3:
            return DayOfWeekEnum.WEDNESDAY;
        case 4:
            return DayOfWeekEnum.THURSDAY;
        case 5:
            return DayOfWeekEnum.FRIDAY;
        case 6:
            return DayOfWeekEnum.SATURDAY;
        default:
            throw new Error("Invalid day index");
    }
}
