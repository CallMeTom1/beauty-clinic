import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Cart} from "./data/model/cart.entity";
import {Repository} from "typeorm";
import {CartItem} from "./data/model/cart-item.entity";
import {Product} from "../product/data/entity/product.entity";
import {User} from "@feature/user/model";
import {UserNotFoundException} from "@feature/security/security.exception";
import {ulid} from "ulid";
import {CreateCartException} from "./cart.exception";
import {AddProductItemToCartPayload} from "./data/payload/add-product-item-to-cart.payload";
import {ProductNotFoundException} from "../product/product.exception";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createCart(idUser: string): Promise<Cart>{
        try{
            const user: User = await this.userRepository.findOne({
                where: {idUser: idUser}
            })
            if(!user){
                throw new UserNotFoundException();
            }

            const newCart: Cart = this.cartRepository.create({
                idCart : ulid(),
                user : user
            });

            return await this.cartRepository.save(newCart);
        }
        catch(e){
            throw new CreateCartException();
        }
    }

    // Ajouter un produit au panier
    async addToCart(payload: AddProductItemToCartPayload): Promise<Cart> {
        const cart: Cart = await this.cartRepository.findOne({
            where: { idCart: payload.cartId },
            relations: ['items', 'items.product'],
        });

        const product = await this.productRepository.findOne({
            where: { product_id: payload.productId },
        });

        if (!product) {
            throw new ProductNotFoundException();
        }

        let cartItem = cart.items.find(item => item.product.product_id === payload.productId);

        if (cartItem) {
            cartItem.quantity += payload.quantity;
        } else {
            cartItem = this.cartItemRepository.create({
                product,
                quantity: payload.quantity,
                price: product.price,  // Fixer le prix au moment de l'ajout
                cart,
            });
            cart.items.push(cartItem);
        }

        return this.cartRepository.save(cart);
    }

    // Mettre à jour la quantité d'un produit dans le panier
    async updateCartItem(cartId: string, productId: string, newQuantity: number): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { idCart: cartId },
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
    async removeFromCart(cartId: string, productId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { idCart: cartId },
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
    async getCart(cartId: string): Promise<Cart> {
        return this.cartRepository.findOne({
            where: { idCart: cartId },
            relations: ['items', 'items.product'],
        });
    }

}