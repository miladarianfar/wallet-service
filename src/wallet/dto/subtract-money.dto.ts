import { IsInt, IsNotEmpty } from 'class-validator';

export class SubtractMoneyDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  amount: number;
}
