import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductPayload } from './data/payload/create-product.payload';
import { UpdateProductPayload } from './data/payload/update-product.payload';
import { AddCategoryToProductPayload } from './data/payload/add-category-to-product.payload';
import { Product } from './data/entity/product.entity';
import {ProductCategory} from "../product-category/data/model/product-category.entity";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductCategory)
        private readonly categoryRepository: Repository<ProductCategory>,
    ) {}

    // Créer un produit
    async create(payload: CreateProductPayload): Promise<Product> {
        const { category_ids, ...productData } = payload;

        const categories = await this.categoryRepository.findByIds(category_ids);
        if (!categories.length) {
            throw new NotFoundException('No valid categories found');
        }

        const product = this.productRepository.create({
            ...productData,
            categories,
        });

        return this.productRepository.save(product);
    }

    // Récupérer tous les produits
    async findAll(): Promise<Product[]> {
        return this.productRepository.find({ relations: ['categories'] });
    }

    // Récupérer un produit par ID
    // Récupérer un produit par ID
    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { product_id: id }, // Utilise 'where' pour préciser la condition de recherche
            relations: ['categories'],
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }


    // Mettre à jour un produit
    async update(id: string, payload: UpdateProductPayload): Promise<Product> {
        const product = await this.findOne(id);
        if (payload.category_ids) {
            const categories = await this.categoryRepository.findByIds(payload.category_ids);
            product.categories = categories;
        }
        Object.assign(product, payload);
        return this.productRepository.save(product);
    }

    // Supprimer un produit
    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }


    // Récupérer une catégorie de produit par ID
    async findCategory(id: string): Promise<ProductCategory> {
        const category = await this.categoryRepository.findOne({
            where: { product_category_id: id }, // Utilise 'where' pour préciser la condition de recherche
        });

        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
    }


    // Ajouter une catégorie à un produit
    async addCategory(payload: AddCategoryToProductPayload): Promise<Product> {
        const { product_id, category_id } = payload;

        const product = await this.findOne(product_id);
        const category = await this.findCategory(category_id);  // Utilise la méthode corrigée pour trouver la catégorie

        if (!product.categories.some(cat => cat.product_category_id === category_id)) {
            product.categories.push(category);
        }

        return this.productRepository.save(product);
    }


    // Mettre à jour l'image d'un produit
    async updateProductImage(productId: string, file: Express.Multer.File): Promise<Product> {
        const product = await this.findOne(productId);

        if (!file) {
            throw new FileUploadException();
        }

        const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
        const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

        if (!allowedMimeTypes.includes(file.mimetype) ||
            !allowedExtensions.some(ext => file.originalname.endsWith(ext))) {
            throw new InvalidFileTypeException();
        }

        product.product_image = Buffer.from(file.buffer);

        try {
            return await this.productRepository.save(product);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
