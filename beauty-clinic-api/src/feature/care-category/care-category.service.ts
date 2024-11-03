import {In, Repository} from "typeorm";
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CareCategoryEntity} from "./data/entity/care-category.entity";
import {UpdateCareCategoryPayload} from "./data/payload/update-care-category.payload";
import {CreateCareCategoryPayload} from "./data/payload/create-care-category.payload";
import {ulid} from "ulid";
import {DeleteCareCategoryPayload} from "./data/payload/delete-care-category.payload";
import {CareSubCategoryEntity} from "../care-sub-category/data/entity/care-sub-category.entity";
import {join} from "path";
import {readFileSync} from "fs";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";

@Injectable()
export class CareCategoryService {
    private readonly defaultCategoryImage: string;

    constructor(
        @InjectRepository(CareCategoryEntity)
        private careCategoryRepository: Repository<CareCategoryEntity>,
        @InjectRepository(CareSubCategoryEntity)
        private careSubCategoryRepository: Repository<CareSubCategoryEntity>,
    ) {
        // Lire et encoder l'image par défaut en base64
        const defaultImageBuffer = readFileSync(join(process.cwd(), 'src', 'feature', 'product', 'assets', 'default-product.png'));
        this.defaultCategoryImage = `data:image/png;base64,${defaultImageBuffer.toString('base64')}`;

    }

    async create(payload: CreateCareCategoryPayload): Promise<CareCategoryEntity> {
        try {
            const category = this.careCategoryRepository.create({
                category_id: ulid(),
                name: payload.name,
                description: payload.description ?? '',
                isPublished: payload.isPublished ?? false,
                category_image: this.defaultCategoryImage // Ajouter l'image par défaut
            });

            return await this.careCategoryRepository.save(category);
        } catch (error) {
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    async findAll(): Promise<CareCategoryEntity[]> {
        try {
            return await this.careCategoryRepository.find({
                relations: ['subCategories'],
                order: {
                    name: 'ASC',
                    subCategories: {
                        name: 'ASC'
                    }
                }
            });
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }

    async findOne(categoryId: string): Promise<CareCategoryEntity> {
        try {
            const category = await this.careCategoryRepository.findOne({
                where: { category_id: categoryId },
                relations: ['subCategories', 'cares'],
                order: {
                    subCategories: {
                        name: 'ASC'
                    }
                }
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

            // Update basic fields if provided
            if (payload.name !== undefined) {
                category.name = payload.name;
            }
            if (payload.isPublished !== undefined) {
                category.isPublished = payload.isPublished;
            }
            if (payload.description !== undefined) {
                category.description = payload.description;
            }

            // Handle sub-categories if provided
            if (payload.subCategoryIds && payload.subCategoryIds.length > 0) {
                // Fetch all sub-categories
                const subCategories = await this.careSubCategoryRepository.findBy({
                    sub_category_id: In(payload.subCategoryIds)
                });

                // Check if all requested sub-categories exist
                if (subCategories.length !== payload.subCategoryIds.length) {
                    const foundIds = subCategories.map(sub => sub.sub_category_id);
                    const missingIds = payload.subCategoryIds.filter(id => !foundIds.includes(id));
                    throw new NotFoundException(`Sub-categories not found: ${missingIds.join(', ')}`);
                }

                // Initialize subCategories array if it doesn't exist
                if (!category.subCategories) {
                    category.subCategories = [];
                }

                // Add new sub-categories
                for (const subCategory of subCategories) {
                    // Check if the sub-category is not already associated
                    if (!category.subCategories.some(existingSub =>
                        existingSub.sub_category_id === subCategory.sub_category_id
                    )) {
                        subCategory.category = category;
                        category.subCategories.push(subCategory);
                    }
                }
            }

            // Save the updated category
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

    async updateCategoryImage(categoryId: string, file: Express.Multer.File): Promise<CareCategoryEntity> {
        try {
            console.log('File received in service:', file);
            console.log('Category ID:', categoryId);

            const category = await this.findOne(categoryId);

            if (!file) {
                throw new FileUploadException();
            }

            // Vérification du type MIME
            const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new InvalidFileTypeException();
            }

            // Encodage en base64
            const base64Image = file.buffer.toString('base64');
            category.category_image = `data:${file.mimetype};base64,${base64Image}`;

            return await this.careCategoryRepository.save(category);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'image de la catégorie', error);
            throw new Error('Failed to update category image');
        }
    }
}