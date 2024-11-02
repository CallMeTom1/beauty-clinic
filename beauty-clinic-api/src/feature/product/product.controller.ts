import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    BadRequestException, Put
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductPayload } from './data/payload/create-product.payload';
import { UpdateProductPayload } from './data/payload/update-product.payload';
import {Product} from "./data/entity/product.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UploadProductImagePayload} from "./data/payload/upload-product-image.payload";
import {Public, Roles} from "@common/config/metadata";
import {Role} from "@feature/security/data";

import {DeleteProductPayload} from "./data/payload/delete-product.payload";


@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Public()
    @Get('published')
    @ApiOperation({ summary: 'Get all published products' })
    async getPublishedProducts(): Promise<Product[]> {
        return this.productService.findPublished();
    }

    @Public()
    @Get('promotions')
    @ApiOperation({ summary: 'Get all products with active promotions' })
    async getActivePromotions(): Promise<Product[]> {
        return this.productService.getActivePromotions();
    }

    @Public()
    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    async create(@Body() payload: CreateProductPayload): Promise<Product> {
        return this.productService.create(payload);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Put()
    @ApiOperation({ summary: 'Update a product' })
    async update(@Body() payload: UpdateProductPayload): Promise<Product> {
        return this.productService.update(payload);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Delete()
    @ApiOperation({ summary: 'Delete a product' })
    async remove(@Body() payload: DeleteProductPayload): Promise<void> {
        return this.productService.remove(payload.product_id);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('productImage'))
    @ApiConsumes('multipart/form-data')
    async uploadImage(
        @Body() payload: UploadProductImagePayload,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Product> {
        if (!file) throw new BadRequestException('No file uploaded');
        return this.productService.updateProductImage(payload.productId, file);
    }
}
