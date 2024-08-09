import {BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn('varchar', {length:26})
    idUser: string;

    @Column({nullable: true, unique: true})
    phoneNumber: string;

    @Column({nullable: true, unique: false})
    firstname: string;

    @Column({nullable: true, unique: false})
    lastname: string;

    @Column({ type: 'bytea', nullable: true })
    profileImage: Buffer;

}