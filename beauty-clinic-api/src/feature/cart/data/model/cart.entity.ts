import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cart-item.entity';
import {User} from "@feature/user/model";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[];

    @OneToOne(() => User, (user) => user.cart)  // Relation One-to-One avec User
    user: User;

    // Autres champs comme "totalPrice" ou "status" si nécessaire
}
