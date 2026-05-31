import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableSettings } from '../entities/table-settings.entity';
import { UpdateTableSettingsDto } from '../dto/update-table-settings.dto';

@Injectable()
export class TableSettingsService {
  constructor(
    @InjectRepository(TableSettings)
    private repo: Repository<TableSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<TableSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        default_table_count: 10,
        enable_qr_codes: true,
        qr_code_format: 'url',
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateTableSettingsDto): Promise<TableSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
