import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateDepositDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  /** Optional deep link to redirect to instead of the website's own /deposit page (e.g. from the mobile app). */
  @IsOptional()
  @IsString()
  returnTo?: string;
}
