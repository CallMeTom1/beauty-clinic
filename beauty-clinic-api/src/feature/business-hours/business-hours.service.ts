import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessHours } from './data/entity/business-hours.entity';
import { ulid } from 'ulid';
import { UpdateBusinessHoursPayload } from './data/payload/update-business-hours.payload';
import { DayOfWeekEnum } from './data/day-of-week.enum';

@Injectable()
export class BusinessHoursService implements OnModuleInit {
    constructor(
        @InjectRepository(BusinessHours)
        private readonly businessHoursRepository: Repository<BusinessHours>,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.initializeDefaultBusinessHours();
    }

    private async initializeDefaultBusinessHours(): Promise<void> {
        const daysOfWeek: DayOfWeekEnum[] = Object.values(DayOfWeekEnum);

        for (const day of daysOfWeek) {
            const existingBusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week: day } });
            if (!existingBusinessHours) {
                const newBusinessHours = this.businessHoursRepository.create({
                    businessHours_id: ulid(),
                    day_of_week: day,
                    opening_time: '09:00:00',  // Default opening time
                    closing_time: '17:00:00',  // Default closing time
                    is_open: true,
                });
                await this.businessHoursRepository.save(newBusinessHours);
            }
        }
    }

    async updateBusinessHoursByDayOfWeek(day_of_week: DayOfWeekEnum, updateBusinessHoursPayload: UpdateBusinessHoursPayload): Promise<BusinessHours> {
        const businessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });

        if (!businessHours) {
            throw new Error('BusinessHours not found');
        }

        if (updateBusinessHoursPayload.opening_time !== undefined) {
            businessHours.opening_time = updateBusinessHoursPayload.opening_time;
        }
        if (updateBusinessHoursPayload.closing_time !== undefined) {
            businessHours.closing_time = updateBusinessHoursPayload.closing_time;
        }

        if (updateBusinessHoursPayload.is_open !== undefined) {
            businessHours.is_open = updateBusinessHoursPayload.is_open;
        }

        // Validation: Ensure closing_time is not before opening_time
        if (businessHours.opening_time && businessHours.closing_time && businessHours.closing_time < businessHours.opening_time) {
            throw new Error('Closing time cannot be before opening time');
        }

        return await this.businessHoursRepository.save(businessHours);
    }

    async closeBusinessDayByDayOfWeek(day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        const businessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });
        if (!businessHours) {
            throw new Error('BusinessHours not found');
        }

        businessHours.is_open = false;
        businessHours.opening_time = null;
        businessHours.closing_time = null;

        return await this.businessHoursRepository.save(businessHours);
    }

    async openBusinessDayByDayOfWeek(day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        const businessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });
        if (!businessHours) {
            throw new Error('BusinessHours not found');
        }

        businessHours.is_open = true;
        businessHours.opening_time = '09:00:00';  // Default opening time
        businessHours.closing_time = '17:00:00';  // Default closing time

        return await this.businessHoursRepository.save(businessHours);
    }

    async findAllBusinessHours(): Promise<BusinessHours[]> {
        return await this.businessHoursRepository.find();
    }
}
