import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { WalletService } from '@app/wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly walletService: WalletService,
  ) {}

  async create(data: CreateUserDto) {
    const isExists = await this.userRepo.findOne({
      select: ['id', 'email'],
      where: { email: data.email },
    });
    if (isExists) throw new BadRequestException('user already exists');

    const wallet = await this.walletService.createWallet();
    const user = await this.userRepo.save({ email: data.email });
    user.wallet = wallet;

    return this.userRepo.save(user);
  }

  async findById(id: number) {
    const isExists = await this.userRepo.findOne({
      select: ['id', 'email'],
      where: { id },
    });
    if (!isExists) return null;
    return isExists;
  }
}
