import {Care} from "@feature/care/data";
import {Column, Entity, ManyToMany, PrimaryColumn} from "typeorm";

@Entity()
export class BodyZoneEntity {
    @PrimaryColumn('varchar', { length: 26 })
    body_zone_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @ManyToMany(() => Care, care => care.bodyZones)
    cares: Care[];
}