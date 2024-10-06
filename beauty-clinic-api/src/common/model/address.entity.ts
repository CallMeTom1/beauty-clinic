import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Address {

    @PrimaryColumn('varchar', {length: 26})
    address_id: string;

    @Column({length:50,nullable: true, unique: false})
    road: string;

    @Column({length:8,nullable: true, unique: false})
    nb: string;

    @Column({length:10,nullable: true, unique: false})
    cp: string;

    @Column({length:50,nullable: true, unique: false})
    town: string;

    @Column({length:50,nullable: true, unique: false})
    country: string;

    @Column({nullable: true, unique: false})
    complement: string;
}