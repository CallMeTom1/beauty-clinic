import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './data/model/product-category.entity';
import {readFileSync} from "fs";
import {join} from "path";
import {User} from "@feature/user/model";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";
import {
    CreateProductCategoryException, DeleteProductCategoryException,
    ProductCategoryNotFoundException, PublishProductCategoryException, UnpublishProductCategoryException,
    UpdateProductCategoryException, UpdateProductCategoryImageException
} from "./product-category.exception";
import {UpdateProductCategoryPayload} from "./data/payload/update-product-category.payload";
import {CreateProductCategoryPayload} from "./data/payload/create-product-category.payload";
import {ulid} from "ulid";

@Injectable()
export class ProductCategoryService {
    private readonly defaultCategoryProductImage: Buffer;

    constructor(
        @InjectRepository(ProductCategory)
        private productCategoryRepository: Repository<ProductCategory>,
    ) {
        this.defaultCategoryProductImage = readFileSync(join(process.cwd(), 'src', 'feature', 'user', 'assets', 'default-profile.png'));
    }

    async create(categoryData: CreateProductCategoryPayload): Promise<ProductCategory> {
        try{
            const newCategory: ProductCategory = this.productCategoryRepository.create({
                product_category_id: ulid(),
                name: categoryData.name,
            });
            return this.productCategoryRepository.save(newCategory);
        }
        catch(e){
            throw new CreateProductCategoryException();
        }
    }

    async findAll(): Promise<ProductCategory[]> {
        try{
            return this.productCategoryRepository.find();
        }
        catch(e){
            throw new ProductCategoryNotFoundException();
        }
    }

    async findOne(id: string): Promise<ProductCategory> {
        try{
            const category: ProductCategory = await this.productCategoryRepository.findOne({
                where: { product_category_id: id },
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

    async update(payload: UpdateProductCategoryPayload): Promise<ProductCategory> {
        try{
            const category = await this.findOne(payload.id);
            Object.assign(category, payload);
            return this.productCategoryRepository.save(category);
        }
        catch(e){
            throw new UpdateProductCategoryException();
        }

    }

    async remove(id: string): Promise<void> {
        try{
            const category = await this.findOne(id);
            await this.productCategoryRepository.remove(category);
        }
        catch (e){
            throw new DeleteProductCategoryException();
        }

    }

    async publishCategory(id: string): Promise<ProductCategory> {
        try {
            const category = await this.findOne(id);
            category.isPublished = true;
            return this.productCategoryRepository.save(category);
        } catch (e) {
            throw new PublishProductCategoryException();
        }
    }

    async unpublishCategory(id: string): Promise<ProductCategory> {
        try {
            const category = await this.findOne(id);
            category.isPublished = false;
            return this.productCategoryRepository.save(category);
        } catch (e) {
            throw new UnpublishProductCategoryException();
        }
    }

    async findPublished(): Promise<ProductCategory[]> {
        try {
            return this.productCategoryRepository.find({ where: { isPublished: true } });
        } catch (e) {
            throw new ProductCategoryNotFoundException();
        }
    }

    async updateCategoryProductImage(categoryProductId: string, file: Express.Multer.File): Promise<ProductCategory> {
        try {
            const productCategory: ProductCategory = await this.findOne(categoryProductId);

            if (!file) {
                throw new FileUploadException();
            }

            const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
            const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png', '.JPG'];
            if (!allowedMimeTypes.includes(file.mimetype) ||
                !allowedExtensions.some(ext => file.originalname.endsWith(ext))) {
                throw new InvalidFileTypeException();
            }

            // Encodage de l'image en base64
            const base64Image = file.buffer.toString('base64');
            // Stockage de l'image en base64, avec le format de mime type (data:image/png;base64,...)
            productCategory.product_category_image = `data:${file.mimetype};base64,${base64Image}`;

            return await this.productCategoryRepository.save(productCategory);
        } catch (e) {
            throw new UpdateProductCategoryImageException();
        }
    }


}
