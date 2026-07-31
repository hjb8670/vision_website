import { IsIn, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  marketId: string;

  @IsIn(['YES', 'NO'])
  outcome: 'YES' | 'NO';

  @IsIn(['BUY', 'SELL'])
  side: 'BUY' | 'SELL';

  @IsNumber()
  @Min(0.01)
  quantity: number;
}
