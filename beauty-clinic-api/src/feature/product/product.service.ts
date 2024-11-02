import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {CreateProductPayload} from './data/payload/create-product.payload';
import {UpdateProductPayload} from './data/payload/update-product.payload';
import {Product} from './data/entity/product.entity';
import {ProductCategory} from "../product-category/data/model/product-category.entity";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";
import {
    CreateProductException,
    DeleteProductException,
    ProductNotFoundException,

    UpdateProductException,
    UpdateProductImageException
} from "./product.exception";
import {ProductCategoryNotFoundException} from "../product-category/product-category.exception";
import {ulid} from "ulid";
import {readFileSync} from "fs";
import {join} from "path";

@Injectable()
export class ProductService {
    private readonly defaultProductImage: string;

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductCategory)
        private readonly categoryRepository: Repository<ProductCategory>,
    ) {
        // Lire et encoder l'image par défaut en base64 lors de l'initialisation du service
        const defaultImageBuffer = readFileSync(join(process.cwd(), 'src', 'feature', 'product', 'assets', 'default-product.png'));
        this.defaultProductImage = `data:image/png;base64,${defaultImageBuffer.toString('base64')}`;
    }

    // Créer un produit
    async create(payload: CreateProductPayload): Promise<Product> {
        try {
            // Check if a product with the same name already exists
            const existingProduct = await this.productRepository.findOne({
                where: { name: payload.name }
            });

            if (existingProduct) {
                throw new ConflictException(`A product with the name "${payload.name}" already exists`);
            }

            // Calculate discounted price if product is on promotion
            const priceDiscounted = payload.promo_percentage
                ? payload.initial_price * (1 - payload.promo_percentage / 100)
                : null;

            const product = this.productRepository.create({
                product_id: ulid(),
                ...payload,
                is_promo: !!payload.promo_percentage,
                price_discounted: priceDiscounted,
                product_image: this.defaultProductImage,
                created: new Date()
            });

            return await this.productRepository.save(product);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new CreateProductException();
        }
    }

    // Récupérer tous les produits
    async findAll(): Promise<Product[]> {
        try{
            return this.productRepository.find({ relations: ['categories', 'reviews', 'reviews.user'] });

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
                relations: ['categories', 'reviews', 'reviews.user'],
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

    // Mettre à jour un produit sans gestion des catégories
    async update(payload: UpdateProductPayload): Promise<Product> {
        try {
            const product = await this.findOne(payload.product_id);

            // Mise à jour des champs de base
            if (payload.name !== undefined) product.name = payload.name;
            if (payload.description !== undefined) product.description = payload.description;
            if (payload.initial_price !== undefined) product.initial_price = payload.initial_price;
            if (payload.quantity_stored !== undefined) product.quantity_stored = payload.quantity_stored;
            if (payload.maxQuantity !== undefined) product.maxQuantity = payload.maxQuantity;
            if (payload.minQuantity !== undefined) product.minQuantity = payload.minQuantity;
            if (payload.isPublished !== undefined) product.isPublished = payload.isPublished;

            // Gestion des catégories avec support explicite pour le tableau vide
            if (payload.category_ids !== undefined) {
                if (payload.category_ids.length === 0) {
                    // Si le tableau est vide, on supprime toutes les catégories
                    product.categories = [];
                } else {
                    // Sinon, on cherche et assigne les catégories
                    try {
                        product.categories = await this.findCategoriesByIds(payload.category_ids);
                    } catch (e) {
                        if (e instanceof ProductCategoryNotFoundException) {
                            // Si aucune catégorie n'est trouvée, on met un tableau vide
                            product.categories = [];
                        } else {
                            throw e;
                        }
                    }
                }
            }

            // Gestion des promotions
            if (payload.is_promo !== undefined) {
                product.is_promo = payload.is_promo;
                if (payload.is_promo && payload.promo_percentage !== undefined) {
                    product.promo_percentage = payload.promo_percentage;
                    product.price_discounted = product.initial_price * (1 - payload.promo_percentage / 100);
                } else {
                    product.promo_percentage = null;
                    product.price_discounted = null;
                }
            }

            product.updated = new Date();
            return await this.productRepository.save(product);

        } catch (error) {
            if (error instanceof ProductCategoryNotFoundException) {
                // Propager l'erreur spécifique aux catégories si nécessaire
                throw error;
            }
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

    // Récupérer plusieurs catégories par leurs IDs
    async findCategoriesByIds(categoryIds: string[]): Promise<ProductCategory[]> {
        // Si le tableau est vide, retourner directement un tableau vide
        if (!categoryIds || categoryIds.length === 0) {
            return [];
        }

        try {
            const categories = await this.categoryRepository.find({
                where: { product_category_id: In(categoryIds) }
            });

            // On ne lance plus d'erreur si aucune catégorie n'est trouvée
            return categories;

        } catch (e) {
            throw new ProductCategoryNotFoundException();
        }
    }

    async findPublished(): Promise<Product[]> {
        try {
            return this.productRepository.find({
                where: { isPublished: true },
                relations: ['categories', 'reviews', 'reviews.user']
            });
        } catch (e) {
            throw new ProductNotFoundException();
        }
    }

    // Mettre à jour l'image d'un produit
    async updateProductImage(productId: string, file: Express.Multer.File): Promise<Product> {
        try {
            console.log('File received in service:', file);
            console.log('Product ID:', productId);

            const product: Product = await this.findOne(productId);

            if (!file) {
                throw new FileUploadException();
            }

            // Vérifiez le type MIME du fichier
            const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new InvalidFileTypeException();
            }

            // Encodage en base64
            const base64Image = file.buffer.toString('base64');
            product.product_image = `data:${file.mimetype};base64,${base64Image}`;

            return await this.productRepository.save(product);
        } catch (e) {
            console.error('Erreur dans le service lors de la mise à jour de l\'image', e);
            throw new UpdateProductImageException();
        }
    }

    async getActivePromotions(): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: { is_promo: true },
                relations: ['categories', 'reviews', 'reviews.user']
            });
        } catch (error) {
            throw new ProductNotFoundException();
        }
    }

}
