import { Entity, PrimaryColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from "@feature/user/model";

@Entity()
export class Cart {
    @PrimaryColumn('varchar', { length: 26 })
    idCart: string;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[];

    @OneToOne(() => User, (user) => user.cart, { nullable: false, cascade: true })  // Relation One-to-One avec User
    @JoinColumn()
    user: User;

    // Autres champs comme "totalPrice" ou "status" si nécessaire
}
