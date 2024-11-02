import {Body, Controller, Delete, Get, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {CareMachineService} from "./care-machine.service";
import {CreateCareMachinePayload} from "./data/payload/create-care-machine.payload";
import {UpdateCareMachinePayload} from "./data/payload/update-care-machine.payload";
import {DeleteCareMachinePayload} from "./data/payload/delete-care-machine.payload";
import {CareMachine} from "./data/model/care-machine.entity";
import {Public, Roles} from "@common/config/metadata";
import {Role} from "@feature/security/data";

@ApiTags('Machines de soin')
@Controller('care-machine')
export class CareMachineController {
    constructor(private readonly careMachineService: CareMachineService) {}

    @Public()
    @Get()
    @ApiOperation({summary: 'Récupérer toutes les machines'})
    @ApiResponse({
        status: 200,
        description: 'Liste des machines récupérée avec succès',
        type: [CareMachine]
    })
    getAllMachines(): Promise<CareMachine[]> {
        return this.careMachineService.findAll();
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({summary: 'Créer une nouvelle machine'})
    @ApiResponse({
        status: 201,
        description: 'Machine créée avec succès',
        type: CareMachine
    })
    createMachine(@Body() payload: CreateCareMachinePayload): Promise<CareMachine> {
        return this.careMachineService.create(payload);
    }

    @Put()
    @Roles(Role.ADMIN)
    @ApiOperation({summary: 'Mettre à jour une machine'})
    @ApiResponse({
        status: 200,
        description: 'Machine mise à jour avec succès',
        type: CareMachine
    })
    updateMachine(@Body() payload: UpdateCareMachinePayload): Promise<CareMachine> {
        return this.careMachineService.update(payload);
    }

    @Delete()
    @Roles(Role.ADMIN)
    @ApiOperation({summary: 'Supprimer une machine'})
    @ApiResponse({
        status: 204,
        description: 'Machine supprimée avec succès'
    })
    deleteMachine(@Body() payload: DeleteCareMachinePayload): Promise<void> {
        return this.careMachineService.delete(payload);
    }
}