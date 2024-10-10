import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn} from 'typeorm';
import {Order} from "../../../order/data/model/order.entity";

@Entity()
export class Payment {
    @PrimaryColumn('varchar', {length:26})
    idPayment: string;

    @Column('varchar')
    stripePaymentIntentId: string;

    @Column('decimal')
    amount: number;

    @Column('decimal', { default: 0 })
    refundedAmount: number;  // Montant remboursé partiellement ou totalement

    @Column('varchar')
    currency: string;

    @Column('varchar')
    status: string;  // Statut du paiement (ex: succeeded, pending, refunded)

    @Column('timestamp')
    paymentDate: Date;

    @Column('timestamp', { nullable: true })
    refundDate: Date;  // Date du remboursement si elle existe

    @ManyToOne(() => Order, (order) => order.payments)  // Relation Many-to-One avec Order
    order: Order;
}
