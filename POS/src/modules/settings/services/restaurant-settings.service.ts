import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantSettings } from '../entities/restaurant-settings.entity';
import { UpdateRestaurantSettingsDto } from '../dto/update-restaurant-settings.dto';

@Injectable()
export class RestaurantSettingsService {
  constructor(
    @InjectRepository(RestaurantSettings)
    private repo: Repository<RestaurantSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<RestaurantSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        opening_time: '09:00',
        closing_time: '23:00',
        timezone: 'UTC',
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateRestaurantSettingsDto): Promise<RestaurantSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
