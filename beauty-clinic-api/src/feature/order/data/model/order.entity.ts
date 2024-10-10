import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    PrimaryColumn,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import {User} from "@feature/user/model";
import {Payment} from "../../../payment/data/model/payment.entity";

@Entity()
export class Order {
    @PrimaryColumn('varchar', {length:26})
    idOrder: string;

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

    @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })  // Relation One-to-Many avec Payment
    payments: Payment[];
}
