import {Controller, Put, Body, Post, Get, Delete} from '@nestjs/common';
import {ApiTags, ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {UserService} from "@feature/user/user.service";
import {UserRequest} from "@common/config/metadata/user-req.interface";
import {UserReq} from "@common/config/metadata";
import {User} from "@feature/user/model";
import {ModifyUserPayload} from "@feature/user/model/payload/modify-user.payload";
import {Address} from "@common/model/address.entity";
import {ModifyAddressPayload} from "@feature/user/model/payload/modify-address.payload";
import {DeleteAddressPayload} from "@feature/user/model/payload/delete-address.payload";
import {SetDefaultAddressPayload} from "@feature/user/model/payload/set-default-address.payload";
import {AddAddressPayload} from "@feature/user/model/payload/add-address.payload";

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put('profile')
    @ApiOperation({ summary: 'Modifier les informations du profil' })
    async modifyUser(
        @Body() payload: ModifyUserPayload,
        @UserReq() request: UserRequest
    ): Promise<User> {
        return await this.userService.modifyUser(request.idUser, payload);
    }

    @Post('addresses')
    @ApiOperation({ summary: 'Ajouter une nouvelle adresse' })
    async addAddress(
        @Body() payload: AddAddressPayload,
        @UserReq() request: UserRequest
    ): Promise<Address> {
        return await this.userService.addAddress(request.idUser, payload);
    }

    @Put('addresses')
    @ApiOperation({ summary: 'Modifier une adresse existante' })
    async modifyAddress(
        @Body() payload: ModifyAddressPayload,
        @UserReq() request: UserRequest
    ): Promise<Address> {
        return await this.userService.modifyAddress(request.idUser, payload);
    }

    @Delete('addresses')
    @ApiOperation({ summary: 'Supprimer une adresse' })
    async deleteAddress(
        @Body() payload: DeleteAddressPayload,
        @UserReq() request: UserRequest
    ): Promise<void> {
        return await this.userService.deleteAddress(request.idUser, payload.addressId);
    }

}