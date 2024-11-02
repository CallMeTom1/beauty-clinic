import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Care} from "@feature/care/data";
import {CareService} from "@feature/care/care.service";
import {CareController} from "@feature/care/care.controller";
import {CareCategoryEntity} from "../care-category/data/entity/care-category.entity";
import {CareSubCategoryEntity} from "../care-sub-category/data/entity/care-sub-category.entity";
import {BodyZoneEntity} from "../body-zone/data/entity/body-zone.entity";
import {CareMachine} from "../care-machine/data/model/care-machine.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Care, CareCategoryEntity, CareSubCategoryEntity, BodyZoneEntity, CareMachine]),

    ],
    providers: [CareService],
    controllers: [CareController]
})
export class CareModule {

}
