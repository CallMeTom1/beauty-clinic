import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AppointmentStatus } from '../appointment-status.enum';
import { Care } from '@feature/care/data';
import { User } from '@feature/user/model';

@Entity()
export class Appointment {
    @PrimaryColumn('varchar', { length: 50 })
    appointment_id: string;

    @ManyToOne(() => Care)
    @JoinColumn({ name: 'care_id' })
    care: Care;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('varchar', { length: 19, nullable: false }) // 'YYYY-MM-DD HH:mm:ss' format
    start_time: string;

    @Column('varchar', { length: 19, nullable: false }) // 'YYYY-MM-DD HH:mm:ss' format
    end_time: string;

    @Column({ type: 'enum', enum: AppointmentStatus, nullable: false })
    status: AppointmentStatus;

    @Column('varchar', { length: 500, nullable: true })
    notes?: string;
}
