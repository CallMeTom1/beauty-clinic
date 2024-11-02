import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    UploadedFile,
    UseInterceptors,
    BadRequestException
} from '@nestjs/common';
import { CareService } from './care.service';
import {
    CreateCarePayload,
    UpdateCarePayload,
    DeleteCarePayload,
} from './data/payload';
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, Roles } from "@common/config/metadata";
import { Role } from "@feature/security/data";
import {Care} from "@feature/care/data";
import {UploadCareImagePayload} from "@feature/care/data/payload/upload-care-image.payload";

@ApiTags('cares')
@Controller('cares')
export class CareController {
    constructor(private readonly careService: CareService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all cares' })
    async findAll(): Promise<Care[]> {
        return this.careService.findAll();
    }

    @Public()
    @Get('published')
    @ApiOperation({ summary: 'Get all published cares' })
    async getPublishedCares(): Promise<Care[]> {
        return this.careService.findPublished();
    }

    @Public()
    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Create a new care' })
    async create(@Body() payload: CreateCarePayload): Promise<Care> {
        return this.careService.create(payload);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Put()
    @ApiOperation({ summary: 'Update a care' })
    async update(@Body() payload: UpdateCarePayload): Promise<Care> {
        return this.careService.update(payload);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Delete()
    @ApiOperation({ summary: 'Delete a care' })
    async remove(@Body() payload: DeleteCarePayload): Promise<void> {
        return this.careService.remove(payload.care_id);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('careImage'))
    @ApiConsumes('multipart/form-data')
    async uploadImage(
        @Body() payload: UploadCareImagePayload,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Care> {
        if (!file) throw new BadRequestException('No file uploaded');
        return this.careService.updateCareImage(payload.careId, file);
    }
}