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

//todo: exceptions
@Injectable()
export class CareService {
    constructor(
        @InjectRepository(Care)
        private readonly careRepository: Repository<Care>,
    ) {}

    async createCare(createCarePayload: CreateCarePayload): Promise<Care | null> {
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
                .zone(createCarePayload.zone)
                .sessions(createCarePayload.sessions)
                .price(createCarePayload.price)
                .duration(createCarePayload.duration)
                .build();

            await this.careRepository.save(newCare);
            return newCare;
        }
        catch(e){
            throw new CreateCareException();
        }

    }

    async deleteCare(deleteCarePayload: DeleteCarePayload): Promise<void> {
        const { care_id } = deleteCarePayload;
        try {
            const care = await this.careRepository.findOne({ where: { care_id } });
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
            throw new ModifyCareException();
        }
    }


    async getAllCares(): Promise<Care[]> {
        return this.careRepository.find();
    }

    async getCaresByCategory(payload: GetCaresByCategoryPayload): Promise<Care[]> {
        const category: string = payload.category;
        return this.careRepository.find({ where: { category } });
    }

}
