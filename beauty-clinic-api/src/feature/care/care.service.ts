import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Care, CreateCarePayload, DeleteCarePayload, ModifyCarePayload} from '@feature/care/data';
import {GetCaresByCategoryPayload} from "@feature/care/data/payload/get-care-by-category.payload";
import {ulid} from "ulid";
import {Builder} from "builder-pattern";
import {
    CareAlreadyExistException, CareNotFoundException,
    CreateCareException,
    DeleteCareException,
    ModifyCareException
} from "@feature/care/care.exception";
import {GetCaresPaginatedPayload} from "@feature/care/data/payload/get-cares-paginated.payload";
import {CareCategory} from "@feature/care/enum/care-category.enum";

//todo: exceptions
@Injectable()
export class CareService {
    constructor(
        @InjectRepository(Care)
        private readonly careRepository: Repository<Care>,
    ) {}

    async createCare(createCarePayload: CreateCarePayload): Promise<Care | null> {
        console.log(createCarePayload)
        const existingCare: Care = await this.careRepository.findOneBy({name: createCarePayload.name});
        if(existingCare){
            throw new CareAlreadyExistException();
        }
        try{
            const newCare: Care = Builder<Care>()
                .care_id(ulid())
                .name(createCarePayload.name)
                .beauty_care_machine(createCarePayload.beauty_care_machine)
                .category(createCarePayload.category)
                .subCategory(createCarePayload.subCategory)
                .zone(createCarePayload.zone)
                .sessions(createCarePayload.sessions)
                .price(createCarePayload.price)
                .duration(createCarePayload.duration)
                .time_between(createCarePayload.time_between)
                .description(createCarePayload.description)
                .build();
            console.log('new care:', newCare);
            await this.careRepository.save(newCare);
            return newCare;
        }
        catch(e){
            console.error('Error while creating care:', e);
            throw new CreateCareException();
        }

    }

    async deleteCare(deleteCarePayload: DeleteCarePayload): Promise<void> {
        const { care_id } = deleteCarePayload;
        try {
            const care: Care = await this.careRepository.findOne({ where: { care_id } });
            if (!care) {
                throw new CareNotFoundException();
            }
            await this.careRepository.delete({ care_id });
        } catch (e) {
            throw new DeleteCareException();
        }
    }

    async modifyCare(modifyCarePayload: ModifyCarePayload): Promise<Care> {
        const { care_id, ...updateFields } = modifyCarePayload;

        try {
            const care: Care = await this.careRepository.findOne({ where: { care_id } });

            if (!care) {
                throw new CareNotFoundException();
            }

            await this.careRepository.update({ care_id }, updateFields);
            return await this.careRepository.findOne({ where: { care_id } });

        } catch (e) {
            console.error('Error while modifying care:', e); // Ajout d'un log pour l'erreur
            throw new ModifyCareException();
        }
    }


    async getCaresPaginated(payload: GetCaresPaginatedPayload): Promise<{ data: Care[], total: number }> {
        const { page, limit, category } = payload;

        const [results, total] = await this.careRepository.findAndCount({
            where: category ? { category } : {},
            take: limit,
            skip: (page - 1) * limit,
            order: {
                name: 'ASC'
            }
        });

        return {
            data: results,
            total
        };
    }

    async getAllCares(): Promise<Care[]> {
        return this.careRepository.find();
    }

    async getCaresByCategory(payload: GetCaresByCategoryPayload): Promise<Care[]> {
        const category: CareCategory = payload.category;
        return this.careRepository.find({ where: { category } });
    }

}
