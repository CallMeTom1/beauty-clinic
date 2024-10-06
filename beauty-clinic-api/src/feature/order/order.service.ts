import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Order} from "./data/model/order.entity";
import {OrderItem} from "./data/model/order-item.entity";
import {Cart} from "../cart/data/model/cart.entity";
import {User} from "@feature/user/model";


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,

        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
    ) {}

    // Transformer un panier en commande
    async createOrderFromCart(cartId: number, user: User): Promise<Order> {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });

        if (!cart || cart.items.length === 0) {
            throw new NotFoundException('Cart is empty or not found');
        }

        let totalPrice = 0;
        const orderItems: OrderItem[] = cart.items.map((cartItem) => {
            const orderItem = this.orderItemRepository.create({
                product: cartItem.product,
                quantity: cartItem.quantity,
                price: cartItem.price,
            });

            totalPrice += cartItem.quantity * cartItem.price;
            return orderItem;
        });

        const order = this.orderRepository.create({
            totalPrice,
            status: 'pending', // Statut initial de la commande
            orderDate: new Date(),
            user, // L'utilisateur est déjà fourni en paramètre
            items: orderItems,
        });

        return this.orderRepository.save(order);
    }


    // Récupérer toutes les commandes d'un utilisateur
    async findOrdersByUser(userId: string): Promise<Order[]> {
        return this.orderRepository.find({
            where: { user: { idUser: userId } }, // Utilise 'idUser' au lieu de 'id'
            relations: ['items', 'items.product'],
        });
    }


    // Mettre à jour le statut d'une commande
    async updateOrderStatus(orderId: number, status: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId }, // Utilise 'where' pour trouver la commande par son ID
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${orderId} not found`);
        }

        order.status = status;
        return this.orderRepository.save(order);
    }

}
