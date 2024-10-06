import {BaseEntity, Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Address} from "@common/model/address.entity";
import {Cart} from "../../../cart/data/model/cart.entity";
import { Order } from "../../../order/data/model/order.entity";  // Assure-toi d'importer l'entité Order

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

    @Column({ nullable: true })
    profileImageUrl: string;

    @Column({ type: 'bytea', nullable: true })
    profileImage: Buffer;

    @Column({default: false})
    hasCustomProfileImage: boolean;

    @OneToOne(() => Address)
    @JoinColumn()
    shippingAddress: Address;

    @OneToOne(() => Address)
    @JoinColumn()
    billingAddress: Address;

    @OneToOne(() => Cart, (cart: { user: User; }) => cart.user)  // Relation One-to-One avec Cart
    cart: Cart;

    @OneToMany(() => Order, (order) => order.user)  // Relation One-to-Many avec Order
    orders: Order[];
}
