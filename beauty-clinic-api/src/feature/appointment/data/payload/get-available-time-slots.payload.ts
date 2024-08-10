import { ApiProperty } from '@nestjs/swagger';
import {DayOfWeekEnum} from "../../../business-hours/data/day-of-week.enum";

export class GetAvailableTimeSlotsPayload {
    @ApiProperty({
        description: 'Day of the week as an enum',
        enum: DayOfWeekEnum,
        example: DayOfWeekEnum.MONDAY
    })
    dayOfWeek: DayOfWeekEnum;

    @ApiProperty({
        description: 'Care ID for which to find available time slots',
        type: String,
        example: 'ca1234ef5678'
    })
    careId: string;

    @ApiProperty({
        description: 'Date for which to find available time slots',
        type: String,
        example: '2024-08-10'
    })
    date: string;
}
