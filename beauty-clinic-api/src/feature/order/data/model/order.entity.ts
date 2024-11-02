import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from "typeorm";
import {OrderStatus} from "../../order-status.enum";
import {Address} from "@common/model/address.entity";
import {PromoCode} from "../../../promo-code/data/model/promo-code.entity";
import {User} from "@feature/user/model";
import {OrderItem} from "./order-item.entity";
import {Payment} from "../../../payment/data/model/payment.entity";

@Entity('orders') // Spécification explicite du nom de la table
export class Order {
    @PrimaryColumn('char', { length: 26 })
    idOrder: string;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING_PAYMENT
    })
    status: OrderStatus;

    @Column('timestamp') // Changement pour inclure l'heure
    orderDate: Date;

    @OneToOne(() => Address)
    @JoinColumn({ name: 'shippingAddressId' }) // Nom explicite de la colonne de jointure
    shippingAddress: Address;

    @Column('decimal', { precision: 10, scale: 2 })
    shippingFee: number;

    @Column('varchar', { nullable: true, length: 100 })
    trackingNumber: string | null;

    @ManyToOne(() => PromoCode, { nullable: true })
    @JoinColumn({ name: 'promoCodeId' }) // Nom explicite de la colonne de jointure
    promoCode: PromoCode | null;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discountAmount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPriceWithShipping: number;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'userId' }) // Nom explicite de la colonne de jointure
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
    payments: Payment[];
}