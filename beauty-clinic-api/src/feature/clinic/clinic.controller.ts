import {
    Controller,
    Get,
    Put,
    Body, Post, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { UpdateClinicPayload } from './data/payload/update-clinic.payload';
import {ApiConsumes, ApiOperation, ApiTags} from '@nestjs/swagger';
import { Public, Roles } from "@common/config/metadata";
import { Role } from "@feature/security/data";
import {Clinic} from "./data/model/clinic.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadClinicLogoPayload} from "./data/payload/update-clinic-logo.payload";

@ApiTags('clinic')
@Controller('clinic')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get clinic information' })
    async getClinic(): Promise<Clinic> {
        return this.clinicService.getClinic();
    }

    @Public()
    @Roles(Role.ADMIN)
    @Put()
    @ApiOperation({ summary: 'Update clinic information' })
    async update(@Body() payload: UpdateClinicPayload): Promise<Clinic> {
        return this.clinicService.update(payload);
    }

    @Public()
    @Roles(Role.ADMIN)
    @Post('upload-logo')
    @UseInterceptors(FileInterceptor('clinicLogo'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update clinic logo' })
    async uploadLogo(
        @Body() payload: UploadClinicLogoPayload,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Clinic> {
        if (!file) throw new BadRequestException('No file uploaded');
        return this.clinicService.updateClinicLogo(payload.clinicId, file);
    }
}