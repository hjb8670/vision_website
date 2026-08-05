import { IsIn, IsOptional, IsString } from 'class-validator';

const CONTENT_TYPES = ['post', 'prediction', 'comment', 'user'];
const REASONS = ['spam', 'harassment', 'misinformation', 'adult_content', 'other'];

export class CreateReportDto {
  @IsString()
  content_id: string;

  @IsIn(REASONS)
  reason: string;

  @IsOptional()
  @IsIn(CONTENT_TYPES)
  content_type?: string;
}
