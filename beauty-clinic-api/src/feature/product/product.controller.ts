import {Controller, Get, Post, Patch, Delete, Body, Param, UploadedFile, UseInterceptors} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductPayload } from './data/payload/create-product.payload';
import { UpdateProductPayload } from './data/payload/update-product.payload';
import {Product} from "./data/entity/product.entity";
import {AddCategoryToProductPayload} from "./data/payload/add-category-to-product.payload";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {UploadProductImagePayload} from "./data/payload/upload-product-image.payload";


@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(@Body() payload: CreateProductPayload): Promise<Product> {
        return this.productService.create(payload);
    }

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product> {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() payload: UpdateProductPayload,
    ): Promise<Product> {
        return this.productService.update(id, payload);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.productService.remove(id);
    }

    @Post('add-category')
    async addCategory(@Body() payload: AddCategoryToProductPayload): Promise<Product> {
        return this.productService.addCategory(payload);
    }

    @Post(':id/upload-image')
    @UseInterceptors(FileInterceptor('productImage'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload product image',
        type: UploadProductImagePayload,
    })
    async uploadProductImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Product> {
        return this.productService.updateProductImage(id, file);
    }
}
