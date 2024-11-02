import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@feature/user/model';
import { Care } from '@feature/care/data';
import { AddToWishlistPayload } from './data/payload/add-to-wishlist.payload';
import { RemoveFromWishlistPayload } from './data/payload/remove-from-wishlist.payload';
import { ulid } from 'ulid';
import {Wishlist} from "./data/model/wishlist.entity";
import {Product} from "../product/data/entity/product.entity";

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepository: Repository<Wishlist>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Care)
        private readonly careRepository: Repository<Care>,
    ) {}

    private async getOrCreateWishlist(userId: string): Promise<Wishlist> {
        let wishlist = await this.wishlistRepository.findOne({
            where: { user: { idUser: userId } },
            relations: ['products', 'cares']
        });

        if (!wishlist) {
            const user = await this.userRepository.findOne({
                where: { idUser: userId }
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            wishlist = this.wishlistRepository.create({
                wishlist_id: ulid(),
                user: user,
                products: [],
                cares: []
            });

            wishlist = await this.wishlistRepository.save(wishlist);
        }

        return wishlist;
    }

    async addToWishlist(userId: string, payload: AddToWishlistPayload): Promise<Wishlist> {
        const wishlist = await this.getOrCreateWishlist(userId);

        if (payload.productId) {
            const product = await this.productRepository.findOne({
                where: { product_id: payload.productId }
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            if (!wishlist.products.some(p => p.product_id === payload.productId)) {
                wishlist.products.push(product);
            }
        }

        if (payload.careId) {
            const care = await this.careRepository.findOne({
                where: { care_id: payload.careId }
            });
            if (!care) {
                throw new NotFoundException('Care not found');
            }
            if (!wishlist.cares.some(c => c.care_id === payload.careId)) {
                wishlist.cares.push(care);
            }
        }

        return this.wishlistRepository.save(wishlist);
    }

    async removeFromWishlist(userId: string, payload: RemoveFromWishlistPayload): Promise<Wishlist> {
        const wishlist = await this.getOrCreateWishlist(userId);

        if (payload.productId) {
            wishlist.products = wishlist.products.filter(
                product => product.product_id !== payload.productId
            );
        }

        if (payload.careId) {
            wishlist.cares = wishlist.cares.filter(
                care => care.care_id !== payload.careId
            );
        }

        return this.wishlistRepository.save(wishlist);
    }

    async getWishlist(userId: string): Promise<Wishlist> {
        if(userId === null){
            throw new NotFoundException('User not found');
        }
        const wishlist = await this.wishlistRepository.findOne({
            where: { user: { idUser: userId } },
            relations: ['products', 'cares']
        });

        if (!wishlist) {
            throw new NotFoundException('Wishlist not found');
        }

        return wishlist;
    }
}