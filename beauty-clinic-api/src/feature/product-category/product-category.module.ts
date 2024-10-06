import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import {ProductCategory} from "./data/model/product-category.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductCategory])],
    providers: [ProductCategoryService],
    controllers: [ProductCategoryController],
})
export class ProductCategoryModule {}
