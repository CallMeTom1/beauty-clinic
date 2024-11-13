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
        const user = await this.userRepository.findOne({
            where: { idUser: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        let product = null;
        let care = null;

        if (payload.product_id) {
            product = await this.productRepository.findOne({
                where: { product_id: payload.product_id }
            });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            const existingReview = await this.reviewRepository.findOne({
                where: {
                    user: { idUser: userId },
                    product: { product_id: payload.product_id }
                }
            });

            if (existingReview) {
                throw new ConflictException('User has already reviewed this product');
            }
        }

        if (payload.care_id) {
            care = await this.careRepository.findOne({
                where: { care_id: payload.care_id }
            });

            if (!care) {
                throw new NotFoundException('Care not found');
            }

            const existingReview = await this.reviewRepository.findOne({
                where: {
                    user: { idUser: userId },
                    care: { care_id: payload.care_id }
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

        await this.reviewRepository.save(review);

        return this.reviewRepository.findOne({
            where: { review_id: review.review_id },
            relations: ['user', 'product', 'care']
        });
    }

    async update(userId: string, payload: UpdateReviewPayload): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { review_id: payload.review_id },
            relations: ['user', 'product', 'care']
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.user.idUser !== userId) {
            throw new ForbiddenException('You can only update your own reviews');
        }

        review.rating = payload.rating ?? review.rating;
        review.comment = payload.comment ?? review.comment;

        await this.reviewRepository.save(review);

        return this.reviewRepository.findOne({
            where: { review_id: review.review_id },
            relations: ['user', 'product', 'care']
        });
    }

    async deleteUserReview(userId: string, reviewId: string): Promise<void> {
        const review = await this.reviewRepository.findOne({
            where: { review_id: reviewId },
            relations: ['user']
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.user.idUser !== userId) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        await this.reviewRepository.remove(review);
    }

    async deleteReviewAdmin(reviewId: string): Promise<void> {
        const review = await this.reviewRepository.findOne({
            where: { review_id: reviewId }
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        await this.reviewRepository.remove(review);
    }

    async findAll(): Promise<Review[]> {
        return this.reviewRepository.find({
            relations: ['user', 'product', 'care'],
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async findByUser(userId: string): Promise<Review[]> {
        const reviews = await this.reviewRepository.find({
            where: { user: { idUser: userId } },
            relations: ['user', 'product', 'care'],
            order: {
                createdAt: 'DESC'
            }
        });

        if (!reviews.length) {
            throw new NotFoundException(`No reviews found for user with ID ${userId}`);
        }

        return reviews;
    }

    async findByProduct(productId: string): Promise<Review[]> {
        const product = await this.productRepository.findOne({
            where: { product_id: productId }
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.reviewRepository.find({
            where: { product: { product_id: productId } },
            relations: ['user', 'product'],
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async findByCare(careId: string): Promise<Review[]> {
        const care = await this.careRepository.findOne({
            where: { care_id: careId }
        });

        if (!care) {
            throw new NotFoundException('Care not found');
        }

        return this.reviewRepository.find({
            where: { care: { care_id: careId } },
            relations: ['user', 'care'],
            order: {
                createdAt: 'DESC'
            }
        });
    }
}