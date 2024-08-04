import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { SubtractMoneyDto } from './dto/subtract-money.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
  ) {}

  async findUserWallet(userId: number) {
    const wallet = await this.walletRepo.findOne({
      select: ['id', 'balance'],
      where: { user: { id: userId } },
    });
    if (!wallet) return null;
    return wallet;
  }

  async getBalance(userId: number) {
    const wallet = await this.findUserWallet(userId);
    if (!wallet) throw new NotFoundException('user not found');

    return { balance: wallet.balance };
  }

  async addOrSubtractMoney(data: SubtractMoneyDto) {
    const wallet = await this.findUserWallet(data.user_id);
    if (!wallet) throw new NotFoundException('user not found');

    wallet.balance += data.amount;
    if (wallet.balance < 0) throw new BadRequestException('not enough balance');
    
    await this.walletRepo.save(wallet);

    const reference_id = Date.now().toString();
    const transaction = await this.transactionRepo.create({
      amount: data.amount,
      reference_id,
      wallet,
    });
    await this.transactionRepo.save(transaction);
    return { reference_id };
  }

  async createWallet() {
    const wallet = await this.walletRepo.create();
    return this.walletRepo.save(wallet);
  }
}
