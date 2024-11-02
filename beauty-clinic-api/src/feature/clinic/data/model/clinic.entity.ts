import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {Address} from "@common/model/address.entity";

@Entity()
export class Clinic{
    @PrimaryColumn('varchar', {length: 26})
    clinic_id: string;

    @Column('varchar', { nullable: false })
    name: string;

    @Column('text', { nullable: false })
    description: string;

    @OneToOne(() => Address)
    @JoinColumn()
    clinic_address: Address;

    @Column('varchar', { nullable: false })
    phone_number: string;

    @Column('varchar', { nullable: false })
    mail: string;

    // Réseaux sociaux
    @Column('varchar', { nullable: true })
    facebook_url: string;

    @Column('varchar', { nullable: true })
    instagram_url: string;

    @Column('varchar', { nullable: true })
    tiktok_url: string;

    @Column('varchar', { nullable: true })
    linkedin_url: string;

    @Column({ type: 'text', nullable: true })
    clinic_logo: string;


}