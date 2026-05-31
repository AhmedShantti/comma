import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportSettings } from '../entities/report-settings.entity';
import { UpdateReportSettingsDto } from '../dto/update-report-settings.dto';

@Injectable()
export class ReportSettingsService {
  constructor(
    @InjectRepository(ReportSettings)
    private repo: Repository<ReportSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<ReportSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        enable_profit_margins: true,
        enable_sales_by_category: true,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateReportSettingsDto): Promise<ReportSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
