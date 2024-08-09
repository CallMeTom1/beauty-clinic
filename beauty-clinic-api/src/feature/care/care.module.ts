import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Care} from "@feature/care/data";
import {CareService} from "@feature/care/care.service";
import {CareController} from "@feature/care/care.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Care]),

    ],
    providers: [CareService],
    controllers: [CareController]
})
export class CareModule {

}
