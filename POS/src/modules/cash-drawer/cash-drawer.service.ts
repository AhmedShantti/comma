import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashDrawer } from './entities/cash-drawer.entity';

@Injectable()
export class CashDrawerService {
  constructor(
    @InjectRepository(CashDrawer)
    private cashDrawerRepository: Repository<CashDrawer>,
  ) {}

  async getCashDrawerByShift(shiftId: string): Promise<CashDrawer> {
    let cashDrawer = await this.cashDrawerRepository.findOne({ where: { shift_id: shiftId } });

    if (!cashDrawer) {
      cashDrawer = new CashDrawer();
      cashDrawer.shift_id = shiftId;
      cashDrawer.opening_balance = 0;
      cashDrawer = await this.cashDrawerRepository.save(cashDrawer);
    }

    return cashDrawer;
  }

  async recordCashIn(shiftId: string, amount: number, notes?: string): Promise<CashDrawer> {
    const cashDrawer = await this.getCashDrawerByShift(shiftId);
    cashDrawer.total_cash_in += amount;
    cashDrawer.notes = notes;
    return this.cashDrawerRepository.save(cashDrawer);
  }

  async recordCashOut(shiftId: string, amount: number, notes?: string): Promise<CashDrawer> {
    const cashDrawer = await this.getCashDrawerByShift(shiftId);
    cashDrawer.total_cash_out += amount;
    cashDrawer.notes = notes;
    return this.cashDrawerRepository.save(cashDrawer);
  }
}
