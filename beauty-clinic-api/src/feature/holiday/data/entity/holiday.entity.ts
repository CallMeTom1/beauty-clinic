import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Holiday {
    @PrimaryColumn('varchar', { length: 50 })
    holiday_id: string;

    @Column('date')
    holiday_date: Date;  // Stocke la date du jour férié, par exemple, '2024-12-25'
}
