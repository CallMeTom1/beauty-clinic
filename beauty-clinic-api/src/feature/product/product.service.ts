import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';

import {CreateProductPayload} from './data/payload/create-product.payload';
import {UpdateProductPayload} from './data/payload/update-product.payload';
import {AddCategoryToProductPayload} from './data/payload/add-category-to-product.payload';
import {Product} from './data/entity/product.entity';
import {ProductCategory} from "../product-category/data/model/product-category.entity";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";
import {
    AddCategoryToProductException,
    CreateProductException,
    DeleteProductException,
    ProductNotFoundException, UnpublishProductException,
    UpdateProductException, UpdateProductImageException
} from "./product.exception";
import {
    ProductCategoryNotFoundException, PublishProductCategoryException,
    UnpublishProductCategoryException
} from "../product-category/product-category.exception";
import {ulid} from "ulid";

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
        try {
            const { category_ids, ...productData } = payload;

            // Utilisation de 'find' avec 'In' pour récupérer les catégories par ID
            const categories = await this.categoryRepository.find({
                where: { product_category_id: In(category_ids) }
            });

            if (!categories.length) {
                throw new NotFoundException('No valid categories found');
            }

            const product = this.productRepository.create({
                product_id: ulid(),
                ...productData,
                categories,
            });

            return this.productRepository.save(product);
        } catch (e) {
            throw new CreateProductException();
        }
    }

    // Récupérer tous les produits
    async findAll(): Promise<Product[]> {
        try{
            return this.productRepository.find({ relations: ['categories'] });

        }
        catch(e){
            throw new ProductNotFoundException();
        }
    }

    // Récupérer un produit par ID
    async findOne(id: string): Promise<Product> {
        try{
            const product = await this.productRepository.findOne({
                where: { product_id: id }, // Utilise 'where' pour préciser la condition de recherche
                relations: ['categories'],
            });

            if (!product) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            return product;
        }
        catch(e){
            throw new ProductNotFoundException();
        }
    }


    // Mettre à jour un produit
    async update(id: string, payload: UpdateProductPayload): Promise<Product> {
        try{
            const product = await this.findOne(id);

            if (payload.category_ids) {
                // Utilisation de 'find' avec 'In' pour récupérer les catégories par leurs IDs
                product.categories = await this.categoryRepository.find({
                    where: {product_category_id: In(payload.category_ids)}
                });
            }

            // Mise à jour des autres champs du produit avec Object.assign
            Object.assign(product, payload);

            return this.productRepository.save(product);
        }
        catch(e) {
            throw new UpdateProductException();
        }

    }

    // Supprimer un produit
    async remove(id: string): Promise<void> {
        try{
            const product = await this.findOne(id);
            await this.productRepository.remove(product);
        }
        catch(e){
            throw new DeleteProductException();
        }
    }

    // Récupérer une catégorie de produit par ID
    async findCategory(id: string): Promise<ProductCategory> {
        try{
            const category = await this.categoryRepository.findOne({
                where: { product_category_id: id }, // Utilise 'where' pour préciser la condition de recherche
            });

            if (!category) {
                throw new NotFoundException(`Category with id ${id} not found`);
            }
            return category;
        }
        catch(e){
            throw new ProductCategoryNotFoundException();
        }
    }


    // Ajouter une catégorie à un produit
    async addCategory(payload: AddCategoryToProductPayload): Promise<Product> {
        try{
            const { product_id, category_id } = payload;

            const product = await this.findOne(product_id);
            const category = await this.findCategory(category_id);  // Utilise la méthode corrigée pour trouver la catégorie

            if (!product.categories.some(cat => cat.product_category_id === category_id)) {
                product.categories.push(category);
            }

            return this.productRepository.save(product);
        }
        catch(e){
            throw new AddCategoryToProductException();
        }


    }

    async publishProduct(id: string): Promise<Product> {
        try {
            const category = await this.findOne(id);
            category.isPublished = true;
            return this.productRepository.save(category);
        } catch (e) {
            throw new PublishProductCategoryException();
        }
    }

    async unpublishProduct(id: string): Promise<Product> {
        try {
            const category = await this.findOne(id);
            category.isPublished = false;
            return this.productRepository.save(category);
        } catch (e) {
            throw new UnpublishProductException();
        }
    }

    async findPublished(): Promise<Product[]> {
        try {
            return this.productRepository.find({ where: { isPublished: true } });
        } catch (e) {
            throw new ProductNotFoundException();
        }
    }

    // Mettre à jour l'image d'un produit
    async updateProductImage(productId: string, file: Express.Multer.File): Promise<Product> {
        try{
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

            return await this.productRepository.save(product);
        }
        catch (e){
            throw new UpdateProductImageException();
        }
    }
}
