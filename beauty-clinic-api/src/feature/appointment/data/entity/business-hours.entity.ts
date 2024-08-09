import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class BusinessHours {
    @PrimaryColumn('varchar', { length: 50 })
    businessHours_id: string;

    @Column('varchar', { length: 50 })
    day_of_week: string;  // e.g., 'Monday'

    @Column('time', { nullable: true })
    opening_time: Date;  // e.g., '09:00:00'

    @Column('time', { nullable: true })
    closing_time: Date;  // e.g., '17:00:00'

    @Column('boolean', { default: true })
    is_open: boolean;  // Indicates whether the business is open on this day
}
