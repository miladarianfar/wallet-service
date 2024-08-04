import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SubtractMoneyDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  amount: number;
}
