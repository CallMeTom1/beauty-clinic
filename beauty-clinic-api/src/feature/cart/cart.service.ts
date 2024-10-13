import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Cart} from "./data/model/cart.entity";
import {Repository} from "typeorm";
import {CartItem} from "./data/model/cart-item.entity";
import {Product} from "../product/data/entity/product.entity";
import {User} from "@feature/user/model";
import {UserNotFoundException} from "@feature/security/security.exception";
import {ulid} from "ulid";
import {
    AddItemToCartException,
    CartNotFoundException,
    CreateCartException, RemoveCartException,
    UpdateCartException
} from "./cart.exception";
import {ProductNotFoundException} from "../product/product.exception";
import {UpdateCartItemPayload} from "./data/payload/update-cart-item.payload";
import {RemoveCartItemPayload} from "./data/payload/remove-cart-item.payload";
import {AddCartItemPayload} from "./data/payload/add-cart-item.payload";

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
    async addToCart(idUser: string, payload: AddCartItemPayload): Promise<Cart> {
        try {
            // Trouver directement le panier lié à l'utilisateur
            const cart: Cart = await this.cartRepository.findOne({
                where: { user: { idUser: idUser } },  // Accéder directement au panier via la relation avec l'utilisateur
                relations: ['items', 'items.product'],
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            const product: Product = await this.productRepository.findOne({
                where: { product_id: payload.productId },
            });

            if (!product) {
                throw new ProductNotFoundException();
            }

            let cartItem: CartItem = cart.items.find(item => item.product.product_id === payload.productId);

            if (cartItem) {
                // Si l'article existe déjà dans le panier, on met à jour la quantité
                cartItem.quantity += payload.quantity;
            } else {
                // Sinon, on crée un nouvel article dans le panier avec un ID unique
                cartItem = this.cartItemRepository.create({
                    idCartItem: ulid(),  // Générer un UUID pour idCartItem
                    product,
                    quantity: payload.quantity,
                    cart,
                });
                cart.items.push(cartItem);
            }

            // Sauvegarder les modifications du panier
            return this.cartRepository.save(cart);
        } catch (e) {
            throw new AddItemToCartException();
        }
    }

    // Mettre à jour la quantité d'un produit dans le panier
    // Mettre à jour la quantité d'un produit dans le panier
    async updateCartItem(idUser: string, payload: UpdateCartItemPayload): Promise<Cart> {
        try {
            // Trouver directement le panier lié à l'utilisateur
            const cart: Cart = await this.cartRepository.findOne({
                where: { user: { idUser: idUser } },  // Accès direct via la relation avec l'utilisateur
                relations: ['items', 'items.product'],
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            // Trouver l'élément dans le panier par son ID
            const cartItem: CartItem = cart.items.find(item => item.idCartItem === payload.cartItemId);

            if (!cartItem) {
                throw new NotFoundException(`Cart item with id ${payload.cartItemId} not found`);
            }

            // Mettre à jour la quantité de l'élément
            cartItem.quantity = payload.newQuantity;

            // Sauvegarder les modifications du panier
            return this.cartRepository.save(cart);
        } catch (e) {
            throw new UpdateCartException();
        }
    }


    // Supprimer un produit du panier
    // Supprimer un produit du panier
    async removeFromCart(idUser: string, payload: RemoveCartItemPayload): Promise<Cart> {
        try {
            // Trouver directement le panier lié à l'utilisateur
            const cart: Cart = await this.cartRepository.findOne({
                where: { user: { idUser: idUser } },  // Accès direct via la relation avec l'utilisateur
                relations: ['items', 'items.product'],
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            // Trouver l'index de l'élément dans le panier par son ID
            const cartItemIndex: number = cart.items.findIndex(item => item.idCartItem === payload.cartItemId);

            if (cartItemIndex === -1) {
                throw new NotFoundException(`Cart item with id ${payload.cartItemId} not found`);
            }

            // Supprimer l'élément du panier
            cart.items.splice(cartItemIndex, 1);

            // Sauvegarder les modifications du panier
            return this.cartRepository.save(cart);
        } catch (e) {
            throw new RemoveCartException();
        }
    }


    async getCart(idUser: string): Promise<Cart> {
        try {
            // Trouver directement le panier associé à l'utilisateur via la relation One-to-One
            const cart: Cart = await this.cartRepository.findOne({
                where: { user: { idUser: idUser } },  // Accès direct via la relation avec l'utilisateur
                relations: ['items', 'items.product'],
            });

            // Vérifier si le panier existe
            if (!cart) {
                throw new NotFoundException('Cart not found for this user');
            }

            return cart;
        } catch (e) {
            throw new CartNotFoundException();
        }
    }

}