import { IsIn } from 'class-validator';

export class SetMarketStatusDto {
  @IsIn(['OPEN', 'CLOSED'])
  status: 'OPEN' | 'CLOSED';
}
