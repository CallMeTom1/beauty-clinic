import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CareMachine} from "./data/model/care-machine.entity";
import {CreateCareMachinePayload} from "./data/payload/create-care-machine.payload";
import {ulid} from "ulid";
import {UpdateCareMachinePayload} from "./data/payload/update-care-machine.payload";
import {DeleteCareMachinePayload} from "./data/payload/delete-care-machine.payload";


@Injectable()
export class CareMachineService {
    constructor(
        @InjectRepository(CareMachine)
        private readonly careMachineRepository: Repository<CareMachine>
    ) {}

    async findAll(): Promise<CareMachine[]> {
        try {
            return await this.careMachineRepository.find({
                relations: ['cares']
            });
        } catch (error) {
            console.error('Error fetching all care machines:', error);
            throw new Error('Failed to fetch care machines');
        }
    }

    async findOne(care_machine_id: string): Promise<CareMachine> {
        try {
            const machine = await this.careMachineRepository.findOne({
                where: {care_machine_id},
                relations: ['cares']
            });

            if (!machine) {
                throw new NotFoundException();
            }

            return machine;
        } catch (error) {
            console.error('Error fetching care machine:', error);
            throw new NotFoundException();
        }
    }

    async create(payload: CreateCareMachinePayload): Promise<CareMachine> {
        try {
            const existingMachine = await this.careMachineRepository.findOne({
                where: { name: payload.name }
            });

            if (existingMachine) {
                throw new Error();
            }

            const machine = this.careMachineRepository.create({
                care_machine_id: ulid(),
                name: payload.name,
                description: payload.description
            });

            return await this.careMachineRepository.save(machine);
        } catch (error) {
            console.error('Error creating care machine:', error);
            throw new Error(error);
        }
    }

    async update(payload: UpdateCareMachinePayload): Promise<CareMachine> {
        try {
            const machine = await this.careMachineRepository.findOne({
                where: {care_machine_id: payload.care_machine_id},
                relations: ['cares']
            });

            if (!machine) {
                throw new NotFoundException();
            }

            Object.assign(machine, payload);
            return await this.careMachineRepository.save(machine);
        } catch (error) {
            console.error('Error updating care machine:', error);
            throw new NotFoundException();
        }
    }

    async delete(payload: DeleteCareMachinePayload): Promise<void> {
        try {
            const result = await this.careMachineRepository.delete(payload.care_machine_id);
            if (result.affected === 0) {
                throw new NotFoundException();
            }
        } catch (error) {
            console.error('Error deleting care machine:', error);
            throw new NotFoundException();
        }
    }
}