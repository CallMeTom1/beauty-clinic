import {BusinessHours} from "./data/entity/business-hours.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {BadRequestException, Injectable, OnModuleInit} from "@nestjs/common";
import {Repository} from "typeorm";
import {ulid} from "ulid";
import {
    BusinessHoursCreationException, BusinessHoursDayOfWeekException,
    BusinessHoursNotFoundException,
    BusinessHoursUpdateException
} from "./business-hours.exception";
import {UpdateBusinessHoursPayload} from "./data/payload/update-business-hours.payload";
import {DayOfWeekEnum} from "./data/day-of-week.enum";

@Injectable()
export class BusinessHoursService implements OnModuleInit{
    constructor(
        @InjectRepository(BusinessHours)
        private readonly businessHoursRepository: Repository<BusinessHours>,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.initializeDefaultBusinessHours();
    }

    // Initialize default business hours for each day of the week
    private async initializeDefaultBusinessHours(): Promise<void> {
        const daysOfWeek: DayOfWeekEnum[] = Object.values(DayOfWeekEnum);

        for (const day of daysOfWeek) {
            const existingBusinessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week: day } });
            if (!existingBusinessHours) {
                try {
                    const newBusinessHours: BusinessHours = this.businessHoursRepository.create({
                        businessHours_id: ulid(),
                        day_of_week: day,
                        opening_time: new Date('1970-01-01T09:00:00Z'),  // Heure par défaut 09:00
                        closing_time: new Date('1970-01-01T17:00:00Z'),  // Heure par défaut 17:00
                        is_open: true,
                    });
                    await this.businessHoursRepository.save(newBusinessHours);
                } catch (error) {
                    throw new BusinessHoursCreationException();
                }
            }
        }
    }

    // READ: Récupérer toutes les heures d'ouverture
    async findAllBusinessHours(): Promise<BusinessHours[]> {
        try {
            return await this.businessHoursRepository.find();
        } catch (e) {
            throw new BusinessHoursNotFoundException();
        }
    }

    // UPDATE: Mettre à jour les heures d'ouverture d'un jour spécifique
    async updateBusinessHoursByDayOfWeek(updateBusinessHoursPayload: UpdateBusinessHoursPayload): Promise<BusinessHours> {
        const day_of_week: DayOfWeekEnum = updateBusinessHoursPayload.day_of_week;

        // Vérifier si le day_of_week appartient bien à l'énumération
        if (!Object.values(DayOfWeekEnum).includes(day_of_week)) {
            throw new BusinessHoursDayOfWeekException();
        }

        // Rechercher les heures d'ouverture pour le jour de la semaine spécifié
        const businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });

        if (!businessHours) {
            throw new BusinessHoursNotFoundException();
        }

        // Convertir les chaînes ISO 8601 en objets Date
        if (updateBusinessHoursPayload.opening_time !== undefined) {
            businessHours.opening_time = new Date(updateBusinessHoursPayload.opening_time);
        }
        if (updateBusinessHoursPayload.closing_time !== undefined) {
            businessHours.closing_time = new Date(updateBusinessHoursPayload.closing_time);
        }

        // Validation: Assurer que closing_time n'est pas avant opening_time
        if (businessHours.opening_time && businessHours.closing_time && businessHours.closing_time < businessHours.opening_time) {
            throw new BusinessHoursUpdateException();
        }

        if (updateBusinessHoursPayload.is_open !== undefined) {
            businessHours.is_open = updateBusinessHoursPayload.is_open;
        }

        // Sauvegarder les modifications dans la base de données
        return await this.businessHoursRepository.save(businessHours);
    }



    // CLOSE: Fermer une journée spécifique en fonction du jour de la semaine
    async closeBusinessDayByDayOfWeek(day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        try {
            const businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });
            if (!businessHours) {
                throw new BusinessHoursNotFoundException();
            }

            // Mettre à jour is_open à false et les heures d'ouverture et fermeture à null
            businessHours.is_open = false;
            businessHours.opening_time = null;
            businessHours.closing_time = null;

            return await this.businessHoursRepository.save(businessHours);
        } catch (e) {
            throw new BusinessHoursUpdateException();
        }
    }

    // OPEN: Ouvrir une journée spécifique en fonction du jour de la semaine avec des heures par défaut
    async openBusinessDayByDayOfWeek(day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        try {
            const businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });
            if (!businessHours) {
                throw new BusinessHoursNotFoundException();
            }

            // Mettre à jour is_open à true et définir les heures d'ouverture et fermeture par défaut
            businessHours.is_open = true;
            businessHours.opening_time = new Date('1970-01-01T09:00:00Z');  // Heure par défaut 09:00
            businessHours.closing_time = new Date('1970-01-01T17:00:00Z');  // Heure par défaut 17:00

            return await this.businessHoursRepository.save(businessHours);
        } catch (e) {
            throw new BusinessHoursUpdateException();
        }
    }

}
