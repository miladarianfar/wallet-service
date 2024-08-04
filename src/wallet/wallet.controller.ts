import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { SubtractMoneyDto } from './dto/subtract-money.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  getBalance(@Query('user_id', ParseIntPipe) userId: number) {
    return this.walletService.getBalance(userId);
  }

  @Post('money')
  addOrSubtractMoney(@Body() data: SubtractMoneyDto) {
    return this.walletService.addOrSubtractMoney(data);
  }
}
