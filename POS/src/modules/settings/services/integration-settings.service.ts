import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationSettings } from '../entities/integration-settings.entity';
import { UpdateIntegrationSettingsDto } from '../dto/update-integration-settings.dto';

@Injectable()
export class IntegrationSettingsService {
  constructor(
    @InjectRepository(IntegrationSettings)
    private repo: Repository<IntegrationSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<IntegrationSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        enable_accounting_sync: false,
        enable_delivery_integration: false,
        enable_loyalty_program: false,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateIntegrationSettingsDto): Promise<IntegrationSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
