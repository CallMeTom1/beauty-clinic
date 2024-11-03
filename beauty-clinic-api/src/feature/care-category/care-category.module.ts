import {CareCategoryService} from "./care-category.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CareCategoryEntity} from "./data/entity/care-category.entity";
import {CareCategoryController} from "./care-category.controller";
import {CareSubCategoryEntity} from "../care-sub-category/data/entity/care-sub-category.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([CareCategoryEntity, CareSubCategoryEntity]),
    ],
    providers: [CareCategoryService],
    controllers: [CareCategoryController]
})
export class CareCategoryModule {}