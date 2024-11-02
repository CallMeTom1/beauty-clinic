import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne} from 'typeorm';
import {Order} from "../../../order/data/model/order.entity";
import {User} from "@feature/user/model";

@Entity()
export class Payment {
    @PrimaryColumn('varchar', { length: 26 })
    idPayment: string;

    @Column('varchar')
    stripePaymentIntentId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    refundedAmount: number;

    @Column('varchar', { length: 3 })
    currency: string;

    @Column('varchar', { length: 20 })
    status: string;

    @Column('timestamp')
    paymentDate: Date;

    @Column('timestamp', { nullable: true })
    refundDate: Date;

    @ManyToOne(() => Order, (order) => order.payments, { nullable: true })
    @JoinColumn({ name: 'orderId' })
    order: Order;


    @ManyToOne(() => User, (user) => user.payments)
    @JoinColumn({ name: 'userId' })
    user: User;
}
