import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppearanceSettings } from '../entities/appearance-settings.entity';
import { UpdateAppearanceSettingsDto } from '../dto/update-appearance-settings.dto';

@Injectable()
export class AppearanceSettingsService {
  constructor(
    @InjectRepository(AppearanceSettings)
    private repo: Repository<AppearanceSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<AppearanceSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        primary_color: '#c9a84c',
        dark_mode_enabled: false,
        font_family: 'Inter',
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateAppearanceSettingsDto): Promise<AppearanceSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
