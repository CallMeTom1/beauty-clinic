import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDecimal } from 'class-validator';

export class ModifyCarePayload {
    @ApiProperty({ description: 'Unique identifier of the care' })
    @IsNotEmpty({ message: 'care_id is required' })
    @IsString({ message: 'care_id must be a string' })
    care_id: string;

    @ApiProperty({ description: 'Name of the care', required: false })
    @IsOptional()
    @IsString({ message: 'name must be a string' })
    name?: string;

    @ApiProperty({ description: 'Beauty care machine used', required: false })
    @IsOptional()
    @IsString({ message: 'beauty_care_machine must be a string' })
    beauty_care_machine?: string;

    @ApiProperty({ description: 'Category of the care', required: false })
    @IsOptional()
    @IsString({ message: 'category must be a string' })
    category?: string;

    @ApiProperty({ description: 'Zone of the care', required: false })
    @IsOptional()
    @IsString({ message: 'zone must be a string' })
    zone?: string;

    @ApiProperty({ description: 'Number of sessions', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'sessions must be a number' })
    sessions?: number;

    @ApiProperty({ description: 'Price of the care', required: false })
    @IsOptional()
    @IsDecimal({}, { message: 'price must be a decimal number' })
    price?: number;

    @ApiProperty({ description: 'Duration of the care', required: false })
    @IsOptional()
    @IsString({ message: 'duration must be a string' })
    duration?: string;

    @ApiProperty({ description: 'time between next care for a single costumer' })
    @IsNotEmpty({ message: 'time between is required' })
    @IsString({ message: 'time between must be a string' })
    time_between?: string;
}
