import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import {User} from "@feature/user/model";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    totalPrice: number;

    @Column('varchar')
    status: string;

    @Column('date')
    orderDate: Date;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];
}
