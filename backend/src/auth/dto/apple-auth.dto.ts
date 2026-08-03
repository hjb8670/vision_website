import { IsOptional, IsString } from 'class-validator';

export class AppleAuthDto {
  @IsString()
  identity_token: string;

  @IsOptional()
  @IsString()
  full_name?: string;
}
