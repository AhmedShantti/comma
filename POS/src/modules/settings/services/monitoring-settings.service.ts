import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonitoringSettings } from '../entities/monitoring-settings.entity';
import { UpdateMonitoringSettingsDto } from '../dto/update-monitoring-settings.dto';

@Injectable()
export class MonitoringSettingsService {
  constructor(
    @InjectRepository(MonitoringSettings)
    private repo: Repository<MonitoringSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<MonitoringSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        error_tracking_enabled: false,
        uptime_monitoring_enabled: false,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateMonitoringSettingsDto): Promise<MonitoringSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
