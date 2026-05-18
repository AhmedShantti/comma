import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Addon } from './entities/addon.entity';
import { CreateAddonDto, UpdateAddonDto } from './dto/create-addon.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AddonsService {
  constructor(
    @InjectRepository(Addon)
    private addonsRepository: Repository<Addon>,
  ) {}

  async create(createAddonDto: CreateAddonDto): Promise<Addon> {
    const addon = this.addonsRepository.create(createAddonDto);
    return this.addonsRepository.save(addon);
  }

  async findAll(pagination: PaginationDto) {
    const [data, total] = await this.addonsRepository.findAndCount({
      skip: pagination.skip,
      take: pagination.limit,
      order: { created_at: 'DESC' },
    });

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

  async findById(id: string): Promise<Addon> {
    const addon = await this.addonsRepository.findOne({ where: { id } });
    if (!addon) {
      throw new NotFoundException('Addon not found');
    }
    return addon;
  }

  async update(id: string, updateAddonDto: UpdateAddonDto): Promise<Addon> {
    const addon = await this.findById(id);
    Object.assign(addon, updateAddonDto);
    return this.addonsRepository.save(addon);
  }

  async softDelete(id: string): Promise<void> {
    await this.addonsRepository.softDelete(id);
  }
}
