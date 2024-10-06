import {Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './data/model/product-category.entity';
import { CreateProductCategoryPayload } from './data/payload/create-product-category.payload';
import { UpdateProductCategoryPayload } from './data/payload/update-product-category.payload';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {UploadCategoryProductImagePayload} from "./data/payload/upload-category-product-image.payload";

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoryController {
    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Post()
    async create(@Body() payload: CreateProductCategoryPayload): Promise<ProductCategory> {
        return this.productCategoryService.create(payload);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ProductCategory> {
        return this.productCategoryService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() payload: UpdateProductCategoryPayload,
    ): Promise<ProductCategory> {
        return this.productCategoryService.update(id, payload);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.productCategoryService.remove(id);
    }

    @Post(':id/upload-category-product-image')
    @UseInterceptors(FileInterceptor('productCategoryImage'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload product category image',
        type: UploadCategoryProductImagePayload,
    })
    async uploadCategoryProduct(
        @Param('id') id: string, // Utilise l'ID de la catégorie ici
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        return await this.productCategoryService.updateCategoryProductImage(id, file);
    }
}

