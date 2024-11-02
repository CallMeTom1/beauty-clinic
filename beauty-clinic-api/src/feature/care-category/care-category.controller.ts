import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { Public, Roles } from '@common/config/metadata';
import { Role } from '@feature/security/data';
import { CareCategoryService } from './care-category.service';
import { CareCategoryEntity } from './data/entity/care-category.entity';
import {CreateCareCategoryPayload} from "./data/payload/create-care-category.payload";
import {UpdateCareCategoryPayload} from "./data/payload/update-care-category.payload";
import {DeleteCareCategoryPayload} from "./data/payload/delete-care-category.payload";

@ApiTags('CareCategory')
@Controller('care-category')
export class CareCategoryController {
    constructor(private readonly careCategoryService: CareCategoryService) {}


    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    getAllCategories(): Promise<CareCategoryEntity[]> {
        return this.careCategoryService.findAll();
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
    createCategory(@Body() payload: CreateCareCategoryPayload): Promise<CareCategoryEntity> {
        return this.careCategoryService.create(payload);
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
        @Body() payload: UpdateCareCategoryPayload
    ): Promise<CareCategoryEntity> {
        return await this.careCategoryService.update(payload);

    }

    @Public()
    @Delete()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiResponse({ status: 204, description: 'The category has been deleted' })
    async deleteCategory(@Body() payload: DeleteCareCategoryPayload): Promise<void> {
        return this.careCategoryService.remove(payload);
    }
}