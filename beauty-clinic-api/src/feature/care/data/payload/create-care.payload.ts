import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDecimal } from 'class-validator';

export class CreateCarePayload {
    @ApiProperty({ description: 'Unique identifier of the care' })
    @IsNotEmpty({ message: 'care_id is required' })
    @IsString({ message: 'care_id must be a string' })
    care_id: string;

    @ApiProperty({ description: 'Name of the care' })
    @IsNotEmpty({ message: 'name is required' })
    @IsString({ message: 'name must be a string' })
    name: string;

    @ApiProperty({ description: 'Beauty care machine used', required: false })
    @IsOptional()
    @IsString({ message: 'beauty_care_machine must be a string' })
    beauty_care_machine?: string;

    @ApiProperty({ description: 'Category of the care' })
    @IsNotEmpty({ message: 'category is required' })
    @IsString({ message: 'category must be a string' })
    category: string;

    @ApiProperty({ description: 'Zone of the care', required: false })
    @IsOptional()
    @IsString({ message: 'zone must be a string' })
    zone?: string;

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
    @IsString({ message: 'duration must be a string' })
    duration: string;
}
