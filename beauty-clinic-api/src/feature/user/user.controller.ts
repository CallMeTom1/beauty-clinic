import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {UserService} from "@feature/user/user.service";
import {UploadImagePayload} from "@feature/user/model/payload/upload-image.payload";
import {UserRequest} from "@common/config/metadata/user-req.interface";
import {UserReq} from "@common/config/metadata";

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('upload-profile-image')
    @UseInterceptors(FileInterceptor('profileImage'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload profile image',
        type: UploadImagePayload,
    })
    async uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @UserReq() request: UserRequest,
    ): Promise<any> {
        return await this.userService.updateUserProfileImage(request.idUser, file);
    }
}