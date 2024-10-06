import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Cart} from "./data/model/cart.entity";
import {Repository} from "typeorm";
import {CartItem} from "./data/model/cart-item.entity";
import {Product} from "../product/data/entity/product.entity";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    // Ajouter un produit au panier
    async addToCart(cartId: number, productId: string, quantity: number): Promise<Cart> {
        // Corrige la méthode findOne pour chercher un panier par ID
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });

        // Corrige la méthode findOne pour chercher un produit par product_id
        const product = await this.productRepository.findOne({
            where: { product_id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${productId} not found`);
        }

        let cartItem = cart.items.find(item => item.product.product_id === productId);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cartItem = this.cartItemRepository.create({
                product,
                quantity,
                price: product.price,  // Fixer le prix au moment de l'ajout
                cart,
            });
            cart.items.push(cartItem);
        }

        return this.cartRepository.save(cart);
    }


    // Mettre à jour la quantité d'un produit dans le panier
    async updateCartItem(cartId: number, productId: string, newQuantity: number): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });

        const cartItem = cart.items.find(item => item.product.product_id === productId);

        if (!cartItem) {
            throw new NotFoundException(`Product with id ${productId} not found in cart`);
        }

        cartItem.quantity = newQuantity;

        return this.cartRepository.save(cart);
    }


    // Supprimer un produit du panier
    async removeFromCart(cartId: number, productId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });

        const cartItemIndex = cart.items.findIndex(item => item.product.product_id === productId);

        if (cartItemIndex === -1) {
            throw new NotFoundException(`Product with id ${productId} not found in cart`);
        }

        cart.items.splice(cartItemIndex, 1);

        return this.cartRepository.save(cart);
    }

    // Récupérer un panier par ID
    async getCart(cartId: number): Promise<Cart> {
        return this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });
    }

}