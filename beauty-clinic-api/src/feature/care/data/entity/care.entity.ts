import { Column, Entity, PrimaryColumn } from 'typeorm';
import {CareCategory} from "@feature/care/enum/care-category.enum";
import {BodyZone} from "@feature/care/enum/care-zone.enum";
import {BeautyCareMachine} from "@feature/care/enum/care-machine.enum";
import {CareSubCategory} from "@feature/care/enum/care-sub-category.enum";

@Entity()
export class Care {
    @PrimaryColumn('varchar', { length: 50 })
    care_id: string;

    @Column('varchar', { nullable: false, unique: false })
    name: string;

    @Column({type:'enum', enum: BeautyCareMachine, nullable: false})
    beauty_care_machine: BeautyCareMachine;

    @Column({type:'enum', enum: CareCategory, nullable: false})
    category: CareCategory;

    @Column({type:'enum', enum: CareSubCategory, nullable: true})
    subCategory: CareSubCategory;

    @Column({type:'enum', enum: BodyZone, nullable: false})
    zone: BodyZone;

    @Column('int', { nullable: false })
    sessions: number;

    @Column('decimal', { nullable: false, precision: 10, scale: 2 })
    price: number;

    @Column('int', { nullable: false })
    duration: number;

    @Column('int', { nullable: true })
    time_between: number;

    @Column('varchar', { length: 500, nullable: true })
    description: string;

}
