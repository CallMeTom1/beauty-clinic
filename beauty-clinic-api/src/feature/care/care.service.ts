import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Care, CreateCarePayload, UpdateCarePayload} from '@feature/care/data';
import {ulid} from "ulid";
import {
    CareNotFoundException,
    CreateCareException,
    DeleteCareException,
} from "@feature/care/care.exception";
import {CareSubCategoryEntity} from "../care-sub-category/data/entity/care-sub-category.entity";
import {BodyZoneEntity} from "../body-zone/data/entity/body-zone.entity";
import {CareCategoryEntity} from "../care-category/data/entity/care-category.entity";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";
import {CareMachine} from "../care-machine/data/model/care-machine.entity";
import {readFileSync} from "fs";
import {join} from "path";
@Injectable()
export class CareService {
    private readonly defaultCareImage: string;

    constructor(
        @InjectRepository(Care)
        private readonly careRepository: Repository<Care>,
        @InjectRepository(CareCategoryEntity)
        private readonly categoryRepository: Repository<CareCategoryEntity>,
        @InjectRepository(CareSubCategoryEntity)
        private readonly subCategoryRepository: Repository<CareSubCategoryEntity>,
        @InjectRepository(BodyZoneEntity)
        private readonly bodyZoneRepository: Repository<BodyZoneEntity>,
        @InjectRepository(CareMachine)
        private readonly machineRepository: Repository<CareMachine>,
    ) {
        const defaultImageBuffer = readFileSync(join(process.cwd(), 'src', 'feature', 'product', 'assets', 'default-product.png'));
        this.defaultCareImage = `data:image/png;base64,${defaultImageBuffer.toString('base64')}`;
    }

    async create(payload: CreateCarePayload): Promise<Care> {
        try {
            const existingCare = await this.careRepository.findOne({
                where: { name: payload.name }
            });

            if (existingCare) {
                throw new ConflictException(`A care with the name "${payload.name}" already exists`);
            }

            const priceDiscounted = payload.promo_percentage
                ? payload.initial_price * (1 - payload.promo_percentage / 100)
                : null;

            // Créer l'entité Care
            const care = new Care();
            care.care_id = ulid();
            care.name = payload.name;
            care.description = payload.description;
            care.sessions = payload.sessions;
            care.initial_price = payload.initial_price;
            care.duration = payload.duration;
            care.time_between = payload.time_between;
            care.is_promo = !!payload.promo_percentage;
            care.promo_percentage = payload.promo_percentage;
            care.price_discounted = priceDiscounted;
            care.care_image = this.defaultCareImage;
            care.isPublished = payload.isPublished ?? false;
            care.created_at = new Date();
            care.updated_at = new Date();

            // Gérer les relations
            if (payload.category_ids?.length) {
                care.categories = await this.categoryRepository.findBy({ category_id: In(payload.category_ids) });
            }
            if (payload.sub_category_ids?.length) {
                care.subCategories = await this.subCategoryRepository.findBy({ sub_category_id: In(payload.sub_category_ids) });
            }
            if (payload.body_zone_ids?.length) {
                care.bodyZones = await this.bodyZoneRepository.findBy({ body_zone_id: In(payload.body_zone_ids) });
            }
            if (payload.machine_ids?.length) {
                care.machines = await this.machineRepository.findBy({ care_machine_id: In(payload.machine_ids) });
            }

            return await this.careRepository.save(care);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new CreateCareException();
        }
    }

    async update(payload: UpdateCarePayload): Promise<Care> {
        try {
            const care = await this.findOne(payload.care_id);

            // Mise à jour des champs simples
            if (payload.name !== undefined) care.name = payload.name;
            if (payload.description !== undefined) care.description = payload.description;
            if (payload.initial_price !== undefined) care.initial_price = payload.initial_price;
            if (payload.sessions !== undefined) care.sessions = payload.sessions;
            if (payload.duration !== undefined) care.duration = payload.duration;
            if (payload.time_between !== undefined) care.time_between = payload.time_between;
            if (payload.isPublished !== undefined) care.isPublished = payload.isPublished;

            // Gestion des promotions
            if (payload.is_promo !== undefined) {
                care.is_promo = payload.is_promo;
                if (payload.is_promo && payload.promo_percentage !== undefined) {
                    care.promo_percentage = payload.promo_percentage;
                    care.price_discounted = care.initial_price * (1 - payload.promo_percentage / 100);
                } else {
                    care.promo_percentage = null;
                    care.price_discounted = null;
                }
            }

            // Gestion des relations
            if (payload.category_ids !== undefined) {
                care.categories = payload.category_ids.length
                    ? await this.categoryRepository.findBy({ category_id: In(payload.category_ids) })
                    : [];
            }
            if (payload.sub_category_ids !== undefined) {
                care.subCategories = payload.sub_category_ids.length
                    ? await this.subCategoryRepository.findBy({ sub_category_id: In(payload.sub_category_ids) })
                    : [];
            }
            if (payload.body_zone_ids !== undefined) {
                care.bodyZones = payload.body_zone_ids.length
                    ? await this.bodyZoneRepository.findBy({ body_zone_id: In(payload.body_zone_ids) })
                    : [];
            }
            if (payload.machine_ids !== undefined) {
                care.machines = payload.machine_ids.length
                    ? await this.machineRepository.findBy({ care_machine_id: In(payload.machine_ids) })
                    : [];
            }

            care.updated_at = new Date();
            return await this.careRepository.save(care);
        } catch (error) {
            throw new CareNotFoundException();
        }
    }

    async findAll(): Promise<Care[]> {
        try {
            return await this.careRepository.find({
                relations: ['categories', 'subCategories', 'bodyZones', 'machines', 'reviews', 'reviews.user']
            });
        } catch (error) {
            throw new CareNotFoundException();
        }
    }

    async findOne(id: string): Promise<Care> {
        try {
            const care = await this.careRepository.findOne({
                where: {care_id: id},
                relations: ['categories', 'subCategories', 'bodyZones', 'machines', 'reviews', 'reviews.user']
            });

            if (!care) {
                throw new NotFoundException(`Care with id ${id} not found`);
            }
            return care;
        } catch (error) {
            throw new CareNotFoundException();
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const care = await this.findOne(id);
            await this.careRepository.remove(care);
        } catch (error) {
            throw new DeleteCareException();
        }
    }

    async updateCareImage(careId: string, file: Express.Multer.File): Promise<Care> {
        try {
            const care = await this.findOne(careId);

            if (!file) {
                throw new FileUploadException();
            }

            const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new InvalidFileTypeException();
            }

            const base64Image = file.buffer.toString('base64');
            care.care_image = `data:${file.mimetype};base64,${base64Image}`;

            return await this.careRepository.save(care);
        } catch (error) {
            throw new FileUploadException();
        }
    }

    async findPublished(): Promise<Care[]> {
        try {
            return this.careRepository.find({
                where: {isPublished: true},
                relations: ['categories', 'subCategories', 'bodyZones', 'machines', 'reviews', 'reviews.user']
            });
        } catch (error) {
            throw new CareNotFoundException();
        }
    }
}
