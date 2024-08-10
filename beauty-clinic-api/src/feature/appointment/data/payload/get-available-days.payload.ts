import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer'; // Import the Type decorator

export class GetAvailableDaysPayload {
    @ApiProperty({
        description: 'The month for which to fetch available days',
        example: 7,
        minimum: 1,
        maximum: 12,
    })
    @Type(() => Number) // Add this to convert from string to number
    @IsNumber({}, { message: 'Month must be a numeric value' })
    @IsInt({ message: 'Month must be an integer' })
    @Min(1, { message: 'Month must be at least 1' })
    @Max(12, { message: 'Month must be no greater than 12' })
    month: number;

    @ApiProperty({
        description: 'The year for which to fetch available days',
        example: 2024,
        minimum: 2000
    })
    @Type(() => Number) // Add this to convert from string to number
    @IsNumber({}, { message: 'Year must be a numeric value' })
    @IsInt({ message: 'Year must be an integer' })
    year: number;
}
