import { ApiProperty } from '@nestjs/swagger';

export class GetAvailableTimeSlotsPayload {
    @ApiProperty({
        description: 'Care ID for which to find available time slots',
        type: String,
        example: 'ca1234ef5678'
    })
    careId: string;

    @ApiProperty({
        description: 'Date for which to find available time slots',
        type: String,
        example: '2024-08-10'
    })
    date: string;
}
