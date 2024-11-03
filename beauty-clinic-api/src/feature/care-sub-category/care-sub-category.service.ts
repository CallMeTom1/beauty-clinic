import {CareSubCategoryEntity} from "./data/entity/care-sub-category.entity";
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateCareCategoryPayload} from "../care-category/data/payload/create-care-category.payload";
import {CareCategoryEntity} from "../care-category/data/entity/care-category.entity";
import {ulid} from "ulid";
import {CreateCareSubCategoryPayload} from "./data/payload/create-care-sub-category.payload";
import {UpdateCareCategoryPayload} from "../care-category/data/payload/update-care-category.payload";
import {DeleteCareCategoryPayload} from "../care-category/data/payload/delete-care-category.payload";
import {UpdateCareSubCategoryPayload} from "./data/payload/update-care-sub-category.payload";
import {readFileSync} from "fs";
import {join} from "path";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";

@Injectable()
export class CareSubCategoryService {
    private readonly defaultSubCategoryImage: string;

    constructor(
        @InjectRepository(CareSubCategoryEntity)
        private careSubCategoryRepository: Repository<CareSubCategoryEntity>,
    ) {
        const defaultImageBuffer = readFileSync(join(process.cwd(), 'src', 'feature', 'product', 'assets', 'default-product.png'));
        this.defaultSubCategoryImage = `data:image/png;base64,${defaultImageBuffer.toString('base64')}`;

    }

    async create(payload: CreateCareSubCategoryPayload): Promise<CareSubCategoryEntity> {
        try {
            const subCategory = this.careSubCategoryRepository.create({
                sub_category_id: ulid(),
                name: payload.name,
                description: payload.description ?? '',
                isPublished: payload.isPublished ?? false,
                sub_category_image: this.defaultSubCategoryImage // Ajouter l'image par défaut

            });

            return await this.careSubCategoryRepository.save(subCategory);
        } catch (error) {
            // Gérer les erreurs spécifiques si nécessaire
            throw new Error(`Failed to create sub-category: ${error.message}`);
        }
    }

    async findAll(): Promise<CareSubCategoryEntity[]> {
        try {
            return await this.careSubCategoryRepository.find();
        } catch (error) {
            throw new Error(`Failed to fetch sub-categories: ${error.message}`);
        }
    }


    async findOne(subCategoryId: string): Promise<CareSubCategoryEntity> {
        try {
            const subCategory = await this.careSubCategoryRepository.findOne({
                where: { sub_category_id: subCategoryId },
                relations: ['cares']
            });

            if (!subCategory) {
                throw new NotFoundException(`Category with ID ${subCategoryId} not found`);
            }

            return subCategory;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch category: ${error.message}`);
        }
    }

    async update(payload: UpdateCareSubCategoryPayload): Promise<CareSubCategoryEntity> {
        try {
            const subCategory = await this.findOne(payload.sub_category_id);

            // Mettre à jour les champs fournis
            if (payload.name !== undefined) {
                subCategory.name = payload.name;
            }
            if (payload.isPublished !== undefined) {
                subCategory.isPublished = payload.isPublished;
            }
            if (payload.description !== undefined) {
                subCategory.description = payload.description;
            }

            return await this.careSubCategoryRepository.save(subCategory);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update sub-category: ${error.message}`);
        }
    }

    async remove(payload: DeleteCareCategoryPayload): Promise<void> {
        try {
            const result = await this.careSubCategoryRepository.delete(payload.sub_category_id);

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

    async updateSubCategoryImage(subCategoryId: string, file: Express.Multer.File): Promise<CareSubCategoryEntity> {
        try {
            console.log('File received in service:', file);
            console.log('Category ID:', subCategoryId);

            const sub_category = await this.findOne(subCategoryId);

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
            sub_category.sub_category_image = `data:${file.mimetype};base64,${base64Image}`;

            return await this.careSubCategoryRepository.save(sub_category);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'image de la sous catégorie', error);
            throw new Error('Failed to update category image');
        }
    }
}
