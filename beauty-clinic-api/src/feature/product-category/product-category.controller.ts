import {Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './data/model/product-category.entity';
import { CreateProductCategoryPayload } from './data/payload/create-product-category.payload';
import { UpdateProductCategoryPayload } from './data/payload/update-product-category.payload';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {UploadCategoryProductImagePayload} from "./data/payload/upload-category-product-image.payload";
import {Public, Roles, UserReq, UserRequest} from "@common/config/metadata";
import {Role} from "@feature/security/data";
import {DeleteProductCategoryException} from "./product-category.exception";
import {RemoveProductCategoryPayload} from "./data/payload/remove-product-category.payload";
import {UpdateCategoryStatusPayload} from "./data/payload/update-category-status.payload";

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoryController {
    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Public()
    @Get()
    async getAll(): Promise<ProductCategory[]>{
        return this.productCategoryService.findAll();
    }

    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() payload: CreateProductCategoryPayload): Promise<ProductCategory> {
        return this.productCategoryService.create(payload);
    }

    @Roles(Role.ADMIN)
    @Patch()
    async update(
        @Body() payload: UpdateProductCategoryPayload,
    ): Promise<ProductCategory> {
        return this.productCategoryService.update(payload);
    }

    @Roles(Role.ADMIN)
    @Delete()
    async remove(@Body() payload: RemoveProductCategoryPayload): Promise<void> {
        return this.productCategoryService.remove(payload.id);
    }

    @Roles(Role.ADMIN)
    @Patch('publish')
    async publishCategory(@Body() payload: UpdateCategoryStatusPayload): Promise<ProductCategory> {
        return this.productCategoryService.publishCategory(payload.id);
    }

    @Roles(Role.ADMIN)
    @Patch('unpublish')
    async unpublishCategory(@Body() payload: UpdateCategoryStatusPayload): Promise<ProductCategory> {
        return this.productCategoryService.unpublishCategory(payload.id);
    }

    @Roles(Role.ADMIN)
    @Get('published')
    async getPublishedCategories(): Promise<ProductCategory[]> {
        return this.productCategoryService.findPublished();
    }

    @Roles(Role.ADMIN)
    @Post('upload-category-product-image')
    @UseInterceptors(FileInterceptor('productCategoryImage'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload product category image',
        type: UploadCategoryProductImagePayload,
    })
    async uploadCategoryProductImage(
        @Body() payload: UploadCategoryProductImagePayload,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        // Appeler le service en passant l'ID de la catégorie et le fichier
        return await this.productCategoryService.updateCategoryProductImage(payload.categoryProductId, file);
    }
}

