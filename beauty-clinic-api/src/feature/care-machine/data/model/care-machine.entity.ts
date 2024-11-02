import {Column, Entity, JoinTable, ManyToMany, PrimaryColumn} from "typeorm";
import {Care} from "@feature/care/data";

@Entity()
export class CareMachine {
    @PrimaryColumn('char', { length: 26 })
    care_machine_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @ManyToMany(() => Care)
    @JoinTable({
        name: 'care_machines_relation',
        joinColumn: {
            name: 'care_machine_id',
            referencedColumnName: 'care_machine_id'
        },
        inverseJoinColumn: {
            name: 'care_id',
            referencedColumnName: 'care_id'
        }
    })
    cares: Care[];
}