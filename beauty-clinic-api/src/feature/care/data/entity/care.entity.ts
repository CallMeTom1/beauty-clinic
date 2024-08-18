import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Care {
    @PrimaryColumn('varchar', { length: 50 })
    care_id: string;

    @Column('varchar', { nullable: false })
    name: string;

    @Column('varchar', { nullable: true, length: 50 })
    beauty_care_machine: string;

    @Column('varchar', { nullable: false })
    category: string;

    @Column('varchar', { nullable: true })
    zone: string;

    @Column('int', { nullable: false })
    sessions: number;

    @Column('decimal', { nullable: false, precision: 10, scale: 2 })
    price: number;

    @Column('int', { nullable: false })
    duration: number;

    @Column('int', { nullable: true })
    time_between: number;

}
