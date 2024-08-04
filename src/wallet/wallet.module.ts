import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { Transaction } from './entity/transaction.entity';
import { TransactionLogService } from './transaction-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  providers: [WalletService, TransactionLogService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
