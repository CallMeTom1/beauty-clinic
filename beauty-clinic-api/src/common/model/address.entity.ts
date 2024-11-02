import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {BaseEntity} from "@common/model/base-entity.entity";

@Entity()
export class Address extends BaseEntity {

    @PrimaryColumn('varchar', { length: 26 })
    address_id: string;

    @Column({ length: 50, nullable: false })
    firstname: string;

    @Column({ length: 50, nullable: false })
    lastname: string;

    @Column({ length: 50, nullable: false })
    road: string;

    @Column({ length: 8, nullable: false })
    nb: string;

    @Column({ length: 10, nullable: false })
    cp: string;

    @Column({ length: 50, nullable: false })
    town: string;

    @Column({ length: 50, nullable: false })
    country: string;

    @Column({ nullable: true })
    complement: string;

    @Column({ length: 50, nullable: false })
    label: string;

    @Column({ default: false })
    isDefault: boolean;

    @Column({ default: false })
    isShippingAddress: boolean;

    @Column({ default: false })
    isBillingAddress: boolean;

}