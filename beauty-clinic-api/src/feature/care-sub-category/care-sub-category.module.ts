import {CareSubCategoryService} from "./care-sub-category.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CareSubCategoryEntity} from "./data/entity/care-sub-category.entity";
import {CareSubCategoryController} from "./care-sub-category.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([CareSubCategoryEntity]),
    ],
    providers: [CareSubCategoryService],
    controllers: [CareSubCategoryController]
})
export class CareSubCategoryModule {}