import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { CareStatus } from '../status.enum';
import { Care } from '@feature/care/data';
import {User} from "@feature/user/model";

@Entity()
export class Appointment {
    @PrimaryColumn('varchar', { length: 50 })
    appointment_id: string;

    @OneToOne(() => Care)
    @JoinColumn({ name: 'care_id' })
    care: Care;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('time', { nullable: false })
    start_time: Date;

    @Column('time', { nullable: false })
    end_time: Date;

    @Column({ type: 'enum', enum: CareStatus, nullable: false })
    status: CareStatus;

    @Column('varchar', { length: 500, nullable: true }) // Notes peut être nullable si nécessaire
    notes?: string;
}
