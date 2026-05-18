import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto, CloseShiftDto } from './dto/create-shift.dto';
import { ShiftStatus } from '../../common/enums/shift-status.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftsRepository: Repository<Shift>,
  ) {}

  async openShift(userId: string, createShiftDto: CreateShiftDto): Promise<Shift> {
    const openShift = await this.shiftsRepository.findOne({
      where: { user_id: userId, status: ShiftStatus.OPEN },
    });

    if (openShift) {
      throw new ConflictException('User already has an open shift');
    }

    const shift = this.shiftsRepository.create({
      user_id: userId,
      opening_cash: createShiftDto.opening_cash,
      status: ShiftStatus.OPEN,
    });

    return this.shiftsRepository.save(shift);
  }

  async closeShift(userId: string, closeShiftDto: CloseShiftDto): Promise<Shift> {
    const shift = await this.shiftsRepository.findOne({
      where: { user_id: userId, status: ShiftStatus.OPEN },
    });

    if (!shift) {
      throw new NotFoundException('No open shift found for this user');
    }

    shift.closing_cash = closeShiftDto.closing_cash;
    shift.status = ShiftStatus.CLOSED;
    shift.closed_at = new Date();
    shift.notes = closeShiftDto.notes;

    return this.shiftsRepository.save(shift);
  }

  async getCurrentShift(userId: string): Promise<Shift> {
    const shift = await this.shiftsRepository.findOne({
      where: { user_id: userId, status: ShiftStatus.OPEN },
      relations: ['user'],
    });

    if (!shift) {
      throw new NotFoundException('No open shift found');
    }

    return shift;
  }

  async getShiftById(id: string): Promise<Shift> {
    const shift = await this.shiftsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    return shift;
  }

  async getShifts(pagination: PaginationDto, filters?: { userId?: string; status?: ShiftStatus; startDate?: Date; endDate?: Date }) {
    const query = this.shiftsRepository.createQueryBuilder('shift')
      .leftJoinAndSelect('shift.user', 'user');

    if (filters?.userId) {
      query.andWhere('shift.user_id = :userId', { userId: filters.userId });
    }

    if (filters?.status) {
      query.andWhere('shift.status = :status', { status: filters.status });
    }

    if (filters?.startDate) {
      query.andWhere('shift.opened_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('shift.opened_at <= :endDate', { endDate: filters.endDate });
    }

    query
      .orderBy('shift.opened_at', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }
}
