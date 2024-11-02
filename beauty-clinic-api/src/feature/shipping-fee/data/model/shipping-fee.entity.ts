import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ShippingFee {
    @PrimaryColumn('char', { length: 26 })
    shipping_fee_id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    freeShippingThreshold: number;

    @Column('varchar')
    description: string;
}