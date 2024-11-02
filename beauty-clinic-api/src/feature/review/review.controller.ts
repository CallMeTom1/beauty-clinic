import {ReviewService} from "./review.service";
import {Public, Roles, UserReq, UserRequest} from "@common/config/metadata";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Post, Put} from "@nestjs/common";
import {CreateReviewPayload} from "./data/payload/create-review-payload";
import {Review} from "./data/model/review.entity";
import {UpdateReviewPayload} from "./data/payload/update-review.payload";
import {DeleteReviewDto} from "./data/payload/delete-review.payload";
import {Role} from "@feature/security/data";

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Public()
    @Post()
    @ApiOperation({ summary: 'Create a new review' })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    async create(
        @Body() payload: CreateReviewPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Review> {
        // On utilise l'ID de l'utilisateur connecté plutôt que celui du payload
        return this.reviewService.create(userReq.idUser, payload);
    }

    @Public()
    @Put()
    @ApiOperation({ summary: 'Update a review' })
    @ApiResponse({ status: 200, description: 'Review updated successfully' })
    async update(@UserReq() userReq: UserRequest, @Body() payload: UpdateReviewPayload): Promise<Review> {
        return this.reviewService.update(userReq.idUser, payload);
    }

    @Public()
    @Delete('user')
    @ApiOperation({ summary: 'Delete user own review' })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    async deleteUserReview(
        @UserReq() userReq: UserRequest,
        @Body() payload: DeleteReviewDto
    ): Promise<void> {
        return this.reviewService.deleteUserReview(userReq.idUser, payload.review_id);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Delete('admin')
    @ApiOperation({ summary: 'Admin delete any review' })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    async deleteReviewAdmin(@Body() payload: DeleteReviewDto): Promise<void> {
        return this.reviewService.deleteReviewAdmin(payload.review_id);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all reviews' })
    async findAll(): Promise<Review[]> {
        return this.reviewService.findAll();
    }

    @Public()
    @Put('by-user')
    @ApiOperation({ summary: 'Get all reviews by user' })
    async findByUser(@Body() payload: { userId: string }): Promise<Review[]> {
        return this.reviewService.findByUser(payload.userId);
    }

    @Public()
    @Put('by-product')
    @ApiOperation({ summary: 'Get all reviews for a product' })
    async findByProduct(@Body() payload: { productId: string }): Promise<Review[]> {
        return this.reviewService.findByProduct(payload.productId);
    }

    @Public()
    @Put('by-care')
    @ApiOperation({ summary: 'Get all reviews for a care' })
    async findByCare(@Body() payload: { careId: string }): Promise<Review[]> {
        return this.reviewService.findByCare(payload.careId);
    }
}