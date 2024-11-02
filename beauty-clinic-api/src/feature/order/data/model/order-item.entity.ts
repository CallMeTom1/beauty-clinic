import { Entity, ManyToOne, Column, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../../product/data/entity/product.entity';

@Entity()
export class OrderItem {
    @PrimaryColumn('char', { length: 26 })
    id: string;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
