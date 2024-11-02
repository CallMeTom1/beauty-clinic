import {CareSubCategoryEntity} from "./data/entity/care-sub-category.entity";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CareSubCategoryService} from "./care-sub-category.service";
import {Public, Roles} from "@common/config/metadata";
import {Role} from "@feature/security/data";
import {CareCategoryEntity} from "../care-category/data/entity/care-category.entity";
import {UpdateCareSubCategoryPayload} from "./data/payload/update-care-sub-category.payload";
import {CreateCareSubCategoryPayload} from "./data/payload/create-care-sub-category.payload";
import {DeleteCareSubCategoryPayload} from "./data/payload/delete-care-sub-category.payload";

@ApiTags('CareSubCategory')
@Controller('care-sub-category')
export class CareSubCategoryController {
    constructor(private readonly careSubCategoryService: CareSubCategoryService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all sub-categories' })
    getAllSubCategories(): Promise<CareSubCategoryEntity[]> {
        return this.careSubCategoryService.findAll();
    }


    @Public()
    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({
        status: 201,
        description: 'The category has been created',
        type: CareCategoryEntity
    })
    createCategory(@Body() payload: CreateCareSubCategoryPayload): Promise<CareSubCategoryEntity> {
        return this.careSubCategoryService.create(payload);
    }

    @Public()
    @Put()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update a category' })
    @ApiResponse({
        status: 200,
        description: 'The category has been updated',
        type: CareCategoryEntity
    })
    async updateCategory(
        @Body() payload: UpdateCareSubCategoryPayload
    ): Promise<CareSubCategoryEntity> {
        return await this.careSubCategoryService.update(payload);

    }

    @Public()
    @Delete()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiResponse({ status: 204, description: 'The category has been deleted' })
    async deleteCategory(@Body() payload: DeleteCareSubCategoryPayload): Promise<void> {
        return this.careSubCategoryService.remove(payload);
    }
}