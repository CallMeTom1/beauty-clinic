import {CareCategoryService} from "./care-category.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CareCategoryEntity} from "./data/entity/care-category.entity";
import {CareCategoryController} from "./care-category.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([CareCategoryEntity]),
    ],
    providers: [CareCategoryService],
    controllers: [CareCategoryController]
})
export class CareCategoryModule {}