import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    OneToMany,
    PrimaryColumn,
    ManyToMany,
    JoinTable
} from "typeorm";
import {Address} from "@common/model/address.entity";
import {Cart} from "../../../cart/data/model/cart.entity";
import { Order } from "../../../order/data/model/order.entity";
import {Payment} from "../../../payment/data/model/payment.entity";
import {Review} from "../../../review/data/model/review.entity";  // Assure-toi d'importer l'entité order

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn('varchar', {length:26})
    idUser: string;

    @Column({nullable: true, unique: true})
    phoneNumber: string;

    @Column({nullable: true, unique: false})
    username: string;

    @Column({nullable: true, unique: false})
    firstname: string;

    @Column({nullable: true, unique: false})
    lastname: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    profileImageUrl: string;

    @ManyToMany(() => Address)
    @JoinTable({
        name: 'user_addresses',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'idUser'
        },
        inverseJoinColumn: {
            name: 'address_id',
            referencedColumnName: 'address_id'
        }
    })
    addresses: Address[];

    @OneToOne(() => Cart, (cart: { user: User; }) => cart.user)  // Relation One-to-One avec Cart
    cart: Cart;

    @OneToMany(() => Order, (order) => order.user)  // Relation One-to-Many avec order
    orders: Order[];

    @OneToMany(() => Payment, payment => payment.user)
    payments: Payment[];

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];
}
