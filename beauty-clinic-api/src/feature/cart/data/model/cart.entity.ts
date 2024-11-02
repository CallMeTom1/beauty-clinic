import {Entity, PrimaryColumn, OneToMany, OneToOne, JoinColumn, Column, ManyToOne} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from "@feature/user/model";
import {PromoCode} from "../../../promo-code/data/model/promo-code.entity";

@Entity()
export class Cart {
    @PrimaryColumn('varchar', { length: 26 })
    idCart: string;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[];

    @OneToOne(() => User, (user) => user.cart, { nullable: false, cascade: true })  // Relation One-to-One avec User
    @JoinColumn()
    user: User;

    @ManyToOne(() => PromoCode, { nullable: true })
    @JoinColumn()
    promoCode: PromoCode | null;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discountAmount: number;

}
