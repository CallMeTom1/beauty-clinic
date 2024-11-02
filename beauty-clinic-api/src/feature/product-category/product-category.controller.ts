import {Controller, Get, Post, Body, Delete, Put} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './data/model/product-category.entity';
import { CreateProductCategoryPayload } from './data/payload/create-product-category.payload';
import { UpdateProductCategoryPayload } from './data/payload/update-product-category.payload';
import {ApiTags} from "@nestjs/swagger";
import {Public, Roles } from "@common/config/metadata";
import {Role} from "@feature/security/data";
import {RemoveProductCategoryPayload} from "./data/payload/remove-product-category.payload";

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoryController {
    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Roles(Role.ADMIN)
    @Get()
    async findAll(): Promise<ProductCategory[]>{
        return this.productCategoryService.findAll();
    }

    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() payload: CreateProductCategoryPayload): Promise<ProductCategory> {
        return this.productCategoryService.create(payload);
    }

    @Roles(Role.ADMIN)
    @Put()
    async update(
        @Body() payload: UpdateProductCategoryPayload,
    ): Promise<ProductCategory> {
        return this.productCategoryService.update(payload);
    }

    @Roles(Role.ADMIN)
    @Delete()
    async remove(@Body() payload: RemoveProductCategoryPayload): Promise<ProductCategory[]> {
        console.log('payload ', payload)
        return this.productCategoryService.remove(payload.id);
    }

    @Public()
    @Get('published')
    async getPublishedCategories(): Promise<ProductCategory[]> {
        return this.productCategoryService.findPublished();
    }

}

