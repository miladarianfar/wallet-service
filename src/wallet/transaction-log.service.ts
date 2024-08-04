import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionLogService {
  private readonly logger = new Logger(TransactionLogService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async logDailyTransactionTotals() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setDate(now.getDate() - 1);
    end.setHours(23, 59, 59, 999);

    const total = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.date BETWEEN :start AND :end', { start, end })
      .select('SUM(transaction.amount)', 'total')
      .getRawOne();

    this.logger.log(
      `Total transactions for ${start.toISOString().split('T')[0]}: ${total.total}`,
    );
  }
}
