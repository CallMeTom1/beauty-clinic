import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './data/model/product-category.entity';
import {readFileSync} from "fs";
import {join} from "path";
import {User} from "@feature/user/model";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";

@Injectable()
export class ProductCategoryService {
    private readonly defaultCategoryProductImage: Buffer;

    constructor(
        @InjectRepository(ProductCategory)
        private productCategoryRepository: Repository<ProductCategory>,
    ) {
        this.defaultCategoryProductImage = readFileSync(join(process.cwd(), 'src', 'feature', 'user', 'assets', 'default-profile.png'));
    }

    async create(categoryData: Partial<ProductCategory>): Promise<ProductCategory> {
        const newCategory = this.productCategoryRepository.create(categoryData);
        return this.productCategoryRepository.save(newCategory);
    }

    async findAll(): Promise<ProductCategory[]> {
        return this.productCategoryRepository.find();
    }

    async findOne(id: string): Promise<ProductCategory> {
        const category = await this.productCategoryRepository.findOne({
            where: { product_category_id: id },
        });
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
    }

    async update(id: string, updateData: Partial<ProductCategory>): Promise<ProductCategory> {
        const category = await this.findOne(id);
        Object.assign(category, updateData);
        return this.productCategoryRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);
        await this.productCategoryRepository.remove(category);
    }

    async updateCategoryProductImage(categoryProductId: string, file: Express.Multer.File): Promise<any> {

        const productCategory: ProductCategory = await this.findOne(categoryProductId);

        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

        if (file.size > maxSizeInBytes) {
            throw new FileUploadException();
        }

        if (!file) {
            throw new FileUploadException();
        }

        const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
        const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

        if (!allowedMimeTypes.includes(file.mimetype) ||
            !allowedExtensions.some(ext => file.originalname.endsWith(ext))) {
            throw new InvalidFileTypeException();
        }

        productCategory.product_category_image = Buffer.from(file.buffer);

        try {
            return await this.productCategoryRepository.save(productCategory);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
