// models/care.dto.ts
export interface CareDto {
  care_id: string;
  name: string;
  beauty_care_machine: string;
  category: string;
  zone: string;
  sessions: number;
  price: number;
  duration: string;
  time_between: string;
}
