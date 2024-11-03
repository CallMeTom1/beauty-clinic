import {CareSubCategoryEntity} from "./data/entity/care-sub-category.entity";
import {ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {CareSubCategoryService} from "./care-sub-category.service";
import {Public, Roles} from "@common/config/metadata";
import {Role} from "@feature/security/data";
import {CareCategoryEntity} from "../care-category/data/entity/care-category.entity";
import {UpdateCareSubCategoryPayload} from "./data/payload/update-care-sub-category.payload";
import {CreateCareSubCategoryPayload} from "./data/payload/create-care-sub-category.payload";
import {DeleteCareSubCategoryPayload} from "./data/payload/delete-care-sub-category.payload";
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadCareCategoryImagePayload} from "../care-category/data/payload/upload-care-category-image.payload";
import {UploadCareSubCategoryImagePayload} from "./data/payload/upload-care-sub-category-image.payload";

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

    @Public()
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('categoryImage'))
    async uploadImage(
        @Body() payload: UploadCareSubCategoryImagePayload,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<CareSubCategoryEntity> {
        console.log('Received payload:', payload);
        console.log('Received file:', file);

        if (!file) throw new BadRequestException('No file uploaded');

        return this.careSubCategoryService.updateSubCategoryImage(payload.sub_category_id, file);
    }
}