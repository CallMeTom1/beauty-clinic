import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import {Clinic} from "./data/model/clinic.entity";
import {Address} from "@common/model/address.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Clinic, Address]),
    ],
    controllers: [ClinicController],
    providers: [ClinicService],
})
export class ClinicModule {}