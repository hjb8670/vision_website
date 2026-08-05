import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

export class CreateTicketDto {
  @IsString()
  @MaxLength(200)
  subject: string;

  @IsString()
  @MaxLength(4000)
  message: string;

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: string;
}
