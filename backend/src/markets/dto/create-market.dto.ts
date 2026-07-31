import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMarketDto {
  @IsString()
  @MinLength(5)
  question: string;

  @IsString()
  description: string;

  @IsString()
  resolutionSource: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsDateString()
  closeDate: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  liquidityB?: number;
}
