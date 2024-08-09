import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Holiday {
    @PrimaryColumn('varchar', { length: 50 })
    holiday_id: number;

    @Column('date')
    holiday_date: Date;  // e.g., '2024-12-25'
}
