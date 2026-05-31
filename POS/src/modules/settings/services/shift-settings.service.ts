import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftSettings } from '../entities/shift-settings.entity';
import { UpdateShiftSettingsDto } from '../dto/update-shift-settings.dto';

@Injectable()
export class ShiftSettingsService {
  constructor(
    @InjectRepository(ShiftSettings)
    private repo: Repository<ShiftSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<ShiftSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        shift_duration_minutes: 480,
        break_duration_minutes: 30,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateShiftSettingsDto): Promise<ShiftSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
