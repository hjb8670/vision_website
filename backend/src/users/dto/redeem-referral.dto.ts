import { IsString, MinLength } from 'class-validator';

export class RedeemReferralDto {
  @IsString()
  @MinLength(4)
  code: string;
}
