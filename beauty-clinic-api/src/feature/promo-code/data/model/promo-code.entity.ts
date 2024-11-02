import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class PromoCode {
    @PrimaryColumn('char', { length: 26 })
    promo_code_id: string;

    @Column('varchar', { unique: true })
    code: string;

    @Column('decimal', { precision: 5, scale: 2 })
    percentage: number;  // ex: 20.00 pour 20%

    @Column('integer')
    maxUses: number;

    @Column('integer', { default: 0 })
    usedCount: number;

    @Column('timestamp')
    validFrom: Date;

    @Column('timestamp')
    validTo: Date;

    @Column('boolean', { default: true })
    isActive: boolean;
}