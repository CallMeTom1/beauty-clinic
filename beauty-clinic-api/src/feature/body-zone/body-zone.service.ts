import {BodyZoneEntity} from "./data/entity/body-zone.entity";
import {CreateBodyZonePayload} from "./data/payload/create-body-zone.payload";
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ulid} from "ulid";
import {UpdateBodyZonePayload} from "./data/payload/update-body-zone.payload";
import {DeleteBodyZonePayload} from "./data/payload/delete-body-zone.payload";

@Injectable()
export class BodyZoneService {
    constructor(
        @InjectRepository(BodyZoneEntity)
        private bodyZoneRepository: Repository<BodyZoneEntity>,
    ) {}

    async create(payload: CreateBodyZonePayload): Promise<BodyZoneEntity> {
        try {
            const bodyZone = this.bodyZoneRepository.create({
                body_zone_id: ulid(),
                name: payload.name
            });

            return await this.bodyZoneRepository.save(bodyZone);
        } catch (error) {
            throw new Error(`Failed to create body zone: ${error.message}`);
        }
    }

    async findAll(): Promise<BodyZoneEntity[]> {
        try {
            return await this.bodyZoneRepository.find({
                relations: ['cares']
            });
        } catch (error) {
            throw new Error(`Failed to fetch body zones: ${error.message}`);
        }
    }

    async findOne(zoneId: string): Promise<BodyZoneEntity> {
        try {
            const bodyZone = await this.bodyZoneRepository.findOne({
                where: { body_zone_id: zoneId },
                relations: ['cares']
            });

            if (!bodyZone) {
                throw new NotFoundException(`Body zone with ID ${zoneId} not found`);
            }

            return bodyZone;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch body zone: ${error.message}`);
        }
    }

    async update(payload: UpdateBodyZonePayload): Promise<BodyZoneEntity> {
        try {
            const bodyZone = await this.findOne(payload.body_zone_id);

            if (payload.name !== undefined) {
                bodyZone.name = payload.name;
            }

            return await this.bodyZoneRepository.save(bodyZone);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update body zone: ${error.message}`);
        }
    }

    async remove(payload: DeleteBodyZonePayload): Promise<void> {
        try {
            const result = await this.bodyZoneRepository.delete(payload.body_zone_id);

            if (result.affected === 0) {
                throw new NotFoundException(`Body zone with ID ${payload.body_zone_id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete body zone: ${error.message}`);
        }
    }
}