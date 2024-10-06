import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import {Product} from "../../../product/data/entity/product.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @Column('int')
    quantity: number;

    @Column('decimal')
    price: number;  // Prix au moment de la commande
}
