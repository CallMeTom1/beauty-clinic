import {Column, Entity, PrimaryColumn} from 'typeorm';
import {DayOfWeekEnum} from "../day-of-week.enum";

@Entity()
export class BusinessHours {
    @PrimaryColumn('varchar', { length: 50 })
    businessHours_id: string;

    @Column({
        type: 'enum',
        enum: DayOfWeekEnum,
    })
    day_of_week: DayOfWeekEnum;

    @Column('time', { nullable: true })
    opening_time: Date;  // e.g., '09:00:00'

    @Column('time', { nullable: true })
    closing_time: Date;  // e.g., '17:00:00'

    @Column('boolean', { default: true })
    is_open: boolean;  // Indicates whether the business is open on this day
}
