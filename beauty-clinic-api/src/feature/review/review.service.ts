import {InjectRepository} from "@nestjs/typeorm";
import {Review} from "./data/model/review.entity";
import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "@feature/user/model";
import {Product} from "../product/data/entity/product.entity";
import {Care} from "@feature/care/data";
import {CreateReviewPayload} from "./data/payload/create-review-payload";
import {ulid} from "ulid";
import {UpdateReviewPayload} from "./data/payload/update-review.payload";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Care)
        private readonly careRepository: Repository<Care>,
    ) {}

    async create(userId: string, payload: CreateReviewPayload): Promise<Review> {
        try {
            const user = await this.userRepository.findOne({
                where: { idUser: userId }
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Vérifier si un produit ou un soin est spécifié
            let product = null;
            let care = null;

            if (payload.productId) {
                product = await this.productRepository.findOne({
                    where: { product_id: payload.productId }
                });
                if (!product) {
                    throw new NotFoundException('Product not found');
                }

                // Vérifier si l'utilisateur a déjà laissé un avis sur ce produit
                const existingReview = await this.reviewRepository.findOne({
                    where: {
                        user: { idUser: userId },
                        product: { product_id: payload.productId }
                    }
                });

                if (existingReview) {
                    throw new ConflictException('User has already reviewed this product');
                }
            }

            if (payload.careId) {
                care = await this.careRepository.findOne({
                    where: { care_id: payload.careId }
                });
                if (!care) {
                    throw new NotFoundException('Care not found');
                }

                // Vérifier si l'utilisateur a déjà laissé un avis sur ce soin
                const existingReview = await this.reviewRepository.findOne({
                    where: {
                        user: { idUser: userId },
                        care: { care_id: payload.careId }
                    }
                });

                if (existingReview) {
                    throw new ConflictException('User has already reviewed this care');
                }
            }

            const review = this.reviewRepository.create({
                review_id: ulid(),
                rating: payload.rating,
                comment: payload.comment,
                user,
                product,
                care
            });

            return await this.reviewRepository.save(review);
        } catch (error) {
            throw error;
        }
    }

    async update(userId: string, payload: UpdateReviewPayload): Promise<Review> {
        try {
            const review = await this.reviewRepository.findOne({
                where: {
                    review_id: payload.review_id,
                    user: { idUser: userId } // On filtre directement sur l'userId
                },
                relations: ['user', 'product', 'care']
            });

            if (!review) {
                throw new NotFoundException('Review not found or you are not authorized to modify this review');
            }

            if (payload.rating !== undefined) review.rating = payload.rating;
            if (payload.comment !== undefined) review.comment = payload.comment;

            return await this.reviewRepository.save(review);
        } catch (error) {
            throw error;
        }
    }

    async deleteUserReview(userId: string, reviewId: string): Promise<void> {
        try {
            const review = await this.reviewRepository.findOne({
                where: { review_id: reviewId },
                relations: ['user']
            });

            if (!review) {
                throw new NotFoundException('Review not found');
            }

            // Vérifier que l'utilisateur est le propriétaire de la review
            if (review.user.idUser !== userId) {
                throw new ForbiddenException('You can only delete your own reviews');
            }

            await this.reviewRepository.remove(review);
        } catch (error) {
            throw error;
        }
    }

    async deleteReviewAdmin(reviewId: string): Promise<void> {
        try {
            const review = await this.reviewRepository.findOne({
                where: { review_id: reviewId }
            });

            if (!review) {
                throw new NotFoundException('Review not found');
            }

            await this.reviewRepository.remove(review);
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<Review[]> {
        return await this.reviewRepository.find({
            relations: ['user', 'product', 'care']
        });
    }

    async findByUser(userId: string): Promise<Review[]> {
        return await this.reviewRepository.find({
            where: { user: { idUser: userId } },
            relations: ['user', 'product', 'care']
        });
    }

    async findByProduct(productId: string): Promise<Review[]> {
        return await this.reviewRepository.find({
            where: { product: { product_id: productId } },
            relations: ['user', 'product']
        });
    }

    async findByCare(careId: string): Promise<Review[]> {
        return await this.reviewRepository.find({
            where: { care: { care_id: careId } },
            relations: ['user', 'care']
        });
    }
}