import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuSettings } from '../entities/menu-settings.entity';
import { UpdateMenuSettingsDto } from '../dto/update-menu-settings.dto';

@Injectable()
export class MenuSettingsService {
  constructor(
    @InjectRepository(MenuSettings)
    private repo: Repository<MenuSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<MenuSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        hide_sold_out_items: false,
        show_item_descriptions: true,
        enable_addons: true,
        enable_variants: true,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateMenuSettingsDto): Promise<MenuSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
