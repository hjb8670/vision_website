import { IsString } from 'class-validator';

export class RedeemHandoffDto {
  @IsString()
  token: string;
}
