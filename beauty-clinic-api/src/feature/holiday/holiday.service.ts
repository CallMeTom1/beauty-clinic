import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './data/entity/holiday.entity';
import { CreateHolidayPayload } from './data/payload/create-holiday.payload';
import { UpdateHolidayPayload } from './data/payload/update-holiday.payload';
import {ulid} from "ulid";

@Injectable()
export class HolidayService {
    constructor(
        @InjectRepository(Holiday)
        private readonly holidayRepository: Repository<Holiday>,
    ) {}

    // CREATE: Ajouter un nouveau jour férié
    async create(createHolidayPayload: CreateHolidayPayload): Promise<Holiday> {
        // Vérifier si un jour férié existe déjà pour la date donnée
        const existingHoliday = await this.holidayRepository.findOne({ where: { holiday_date: createHolidayPayload.holiday_date } });

        if (existingHoliday) {
            throw new BadRequestException('A holiday already exists for the provided date.');
        }

        // Générer un nouvel identifiant unique avec ulid
        const newHolidayId = ulid();

        // Créer un nouveau jour férié en utilisant l'identifiant généré et les autres propriétés du payload
        const newHoliday = this.holidayRepository.create({
            holiday_id: newHolidayId, // Utilisation de l'ULID généré
            holiday_date: createHolidayPayload.holiday_date, // Date du jour férié
        });

        return await this.holidayRepository.save(newHoliday);
    }

    // READ: Récupérer tous les jours fériés
    async findAll(): Promise<Holiday[]> {
        return await this.holidayRepository.find();
    }

    // READ: Récupérer un jour férié spécifique par date
    async findOneByDate(date: Date): Promise<Holiday> {
        const holiday = await this.holidayRepository.findOne({ where: { holiday_date: date } });
        if (!holiday) {
            throw new NotFoundException(`Holiday on date ${date.toISOString().split('T')[0]} not found`);
        }
        return holiday;
    }


    // DELETE: Supprimer un jour férié spécifique par date
    async removeByDate(date: Date): Promise<void> {
        const result = await this.holidayRepository.delete({ holiday_date: date });
        if (result.affected === 0) {
            throw new NotFoundException(`Holiday on date ${date.toISOString().split('T')[0]} not found`);
        }
    }
}
