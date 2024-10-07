import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, PrimaryColumn} from 'typeorm';
import { Cart } from './cart.entity';
import {Product} from "../../../product/data/entity/product.entity";

@Entity()
export class CartItem {
    @PrimaryColumn('varchar', {length:26})
    idCartItem: string;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @Column('int')
    quantity: number;

    @Column('decimal')
    price: number;  // Prix au moment où le produit a été ajouté
}
