import {Repository} from "typeorm";
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CareCategoryEntity} from "./data/entity/care-category.entity";
import {UpdateCareCategoryPayload} from "./data/payload/update-care-category.payload";
import {CreateCareCategoryPayload} from "./data/payload/create-care-category.payload";
import {ulid} from "ulid";
import {DeleteCareCategoryPayload} from "./data/payload/delete-care-category.payload";

@Injectable()
export class CareCategoryService {
    constructor(
        @InjectRepository(CareCategoryEntity)
        private careCategoryRepository: Repository<CareCategoryEntity>,
    ) {}

    async create(payload: CreateCareCategoryPayload): Promise<CareCategoryEntity> {
        try {
            const category = this.careCategoryRepository.create({
                category_id: ulid(),
                name: payload.name,
                description: payload.description ?? '',
                isPublished: payload.isPublished ?? false
            });

            return await this.careCategoryRepository.save(category);
        } catch (error) {
            // Gérer les erreurs spécifiques si nécessaire
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    async findAll(): Promise<CareCategoryEntity[]> {
        try {
            return await this.careCategoryRepository.find();
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }

    async findOne(categoryId: string): Promise<CareCategoryEntity> {
        try {
            const category = await this.careCategoryRepository.findOne({
                where: { category_id: categoryId },
                relations: ['cares']
            });

            if (!category) {
                throw new NotFoundException(`Category with ID ${categoryId} not found`);
            }

            return category;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch category: ${error.message}`);
        }
    }

    async update(payload: UpdateCareCategoryPayload): Promise<CareCategoryEntity> {
        try {
            const category = await this.findOne(payload.category_id);

            // Mettre à jour les champs fournis
            if (payload.name !== undefined) {
                category.name = payload.name;
            }
            if (payload.isPublished !== undefined) {
                category.isPublished = payload.isPublished;
            }

            if(payload.description !== undefined) {
                category.description = payload.description;
            }

            return await this.careCategoryRepository.save(category);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    async remove(payload: DeleteCareCategoryPayload): Promise<void> {
        try {
            const result = await this.careCategoryRepository.delete(payload.sub_category_id);

            if (result.affected === 0) {
                throw new NotFoundException(`Category with ID ${payload.sub_category_id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    }

    // Méthode utilitaire pour vérifier l'existence d'une catégorie
    private async checkCategoryExists(categoryId: string): Promise<boolean> {
        const count = await this.careCategoryRepository.count({
            where: { category_id: categoryId }
        });
        return count > 0;
    }
}