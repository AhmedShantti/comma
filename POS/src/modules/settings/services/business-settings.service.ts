import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessSettings } from '../entities/business-settings.entity';
import { UpdateBusinessSettingsDto } from '../dto/update-business-settings.dto';

@Injectable()
export class BusinessSettingsService {
  constructor(
    @InjectRepository(BusinessSettings)
    private repo: Repository<BusinessSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<BusinessSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        restaurant_name: 'Restaurant Name',
        currency_code: 'EGP',
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateBusinessSettingsDto): Promise<BusinessSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
