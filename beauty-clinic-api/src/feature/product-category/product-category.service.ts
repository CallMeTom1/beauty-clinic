import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './data/model/product-category.entity';
import {readFileSync} from "fs";
import {join} from "path";
import {
    CreateProductCategoryException, DeleteProductCategoryException,
    ProductCategoryNotFoundException, PublishProductCategoryException, UnpublishProductCategoryException,
    UpdateProductCategoryException
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
                description: categoryData.description,
                isPublished: categoryData.isPublished
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

    async remove(id: string): Promise<ProductCategory[]> {
        try{
            const category = await this.findOne(id);
            await this.productCategoryRepository.remove(category);
            return this.productCategoryRepository.find();
        }
        catch (e){
            throw new DeleteProductCategoryException();
        }

    }

    async findPublished(): Promise<ProductCategory[]> {
        try {
            return this.productCategoryRepository.find({ where: { isPublished: true } });
        } catch (e) {
            throw new ProductCategoryNotFoundException();
        }
    }



}
