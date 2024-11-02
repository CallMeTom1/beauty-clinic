import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BodyZoneEntity} from "./data/entity/body-zone.entity";
import {BodyZoneController} from "./body-zone.controller";
import {BodyZoneService} from "./body-zone.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([BodyZoneEntity]),
    ],
    providers: [BodyZoneService],
    controllers: [BodyZoneController]
})
export class BodyZoneModule {}