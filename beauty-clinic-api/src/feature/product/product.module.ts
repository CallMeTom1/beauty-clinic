import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './data/entity/product.entity';
import { ProductCategory } from '../product-category/data/model/product-category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductCategory]), // Importation des entités nécessaires
    ],
    controllers: [ProductController], // Déclaration du contrôleur
    providers: [ProductService], // Déclaration du service
})
export class ProductModule {}
