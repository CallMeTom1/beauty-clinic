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
import {
    UpdateProductCategoriesPayload
} from "./data/payload/update-category-to-product.payload";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {UploadProductImagePayload} from "./data/payload/upload-product-image.payload";
import {Public, Roles} from "@common/config/metadata";
import {Role} from "@feature/security/data";
import {UpdateCategoryStatusPayload} from "../product-category/data/payload/update-category-status.payload";
import {RemoveProductCategoryPayload} from "../product-category/data/payload/remove-product-category.payload";


@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Roles(Role.ADMIN)
    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() payload: CreateProductPayload): Promise<Product> {
        return this.productService.create(payload);
    }

    @Roles(Role.ADMIN)
    @Patch()
    async update(
        @Body() payload: UpdateProductPayload,
    ): Promise<Product> {
        return this.productService.update(payload);
    }

    @Roles(Role.ADMIN)
    @Delete()
    async remove(@Body() payload: RemoveProductCategoryPayload): Promise<void> {
        return this.productService.remove(payload.id);
    }

    //@Roles(Role.ADMIN)
    @Put('publish')
    async publishProduct(@Body() payload: UpdateCategoryStatusPayload): Promise<Product> {
        return this.productService.publishProduct(payload.id);
    }

    //@Roles(Role.ADMIN)
    @Put('unpublish')
    async unpublishProduct(@Body() payload: UpdateCategoryStatusPayload): Promise<Product> {
        return this.productService.unpublishProduct(payload.id);
    }

    @Public()
    @Get('published')
    async getPublishedproducts(): Promise<Product[]> {
        return this.productService.findPublished();
    }

    @Public()
    @Put('update-categories')
    async updateProductCategories(@Body() payload: UpdateProductCategoriesPayload): Promise<Product> {
        return this.productService.updateProductCategories(payload);
    }



    @Post('upload-product-image')
    @UseInterceptors(FileInterceptor('productImage'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload product image',
        type: UploadProductImagePayload,
    })
    async uploadProductImage(
        @Body() payload: UploadProductImagePayload,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Product> {

        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        return this.productService.updateProductImage(payload.productId, file);
    }
}
