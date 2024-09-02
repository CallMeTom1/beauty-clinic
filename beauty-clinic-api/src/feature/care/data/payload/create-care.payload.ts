import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString, IsNumber, IsDecimal, IsEnum, MaxLength} from 'class-validator';
import {CareCategory} from "@feature/care/enum/care-category.enum";
import {BodyZone} from "@feature/care/enum/care-zone.enum";
import {BeautyCareMachine} from "@feature/care/enum/care-machine.enum";
import {CareSubCategory} from "@feature/care/enum/care-sub-category.enum";

export class CreateCarePayload {
    @ApiProperty({ description: 'Name of the care' })
    @IsNotEmpty({ message: 'name is required' })
    @IsString({ message: 'name must be a string' })
    name: string;

    @ApiProperty({ description: 'Beauty care machine used', enum: BeautyCareMachine, required: false })
    @IsOptional()
    @IsEnum(BeautyCareMachine, { message: 'beauty_care_machine must be a valid BeautyCareMachine value' })
    beauty_care_machine?: BeautyCareMachine;

    @ApiProperty({ description: 'Category of the care', enum: CareCategory })
    @IsNotEmpty({ message: 'category is required' })
    @IsEnum(CareCategory, { message: 'category must be a valid CareCategory value' })
    category: CareCategory;

    @ApiProperty({ description: 'Sub category of the care', enum: CareSubCategory })
    @IsNotEmpty({ message: ' sub category is required' })
    @IsEnum(CareSubCategory, { message: ' sub category must be a valid CareSubCategory value' })
    subCategory: CareSubCategory;

    @ApiProperty({ description: 'Zone of the care', enum: BodyZone, required: false })
    @IsOptional()
    @IsEnum(BodyZone, { message: 'zone must be a valid BodyZone value' })
    zone?: BodyZone;

    @ApiProperty({ description: 'Number of sessions' })
    @IsNotEmpty({ message: 'sessions is required' })
    @IsNumber({}, { message: 'sessions must be a number' })
    sessions: number;

    @ApiProperty({ description: 'Price of the care' })
    @IsNotEmpty({ message: 'price is required' })
    @IsDecimal({}, { message: 'price must be a decimal number' })
    price: number;

    @ApiProperty({ description: 'Duration of the care' })
    @IsNotEmpty({ message: 'duration is required' })
    @IsNumber({},{ message: 'duration must be a number' })
    duration: number;

    @ApiProperty({ description: 'time between next care for a single costumer' })
    @IsNotEmpty({ message: 'time between is required' })
    @IsNumber({},{ message: 'time between must be a number' })
    time_between: number;

    @ApiProperty({ description: 'Description of the care', maxLength: 500 })
    @IsString({ message: 'description must be a string' })
    @MaxLength(500, { message: 'description must be at most 500 characters long' })
    description: string;
}
