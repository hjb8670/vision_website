import { IsIn } from 'class-validator';

export class ResolveMarketDto {
  @IsIn(['YES', 'NO'])
  outcome: 'YES' | 'NO';
}
