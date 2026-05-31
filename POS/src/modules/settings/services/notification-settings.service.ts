import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationSettings } from '../entities/notification-settings.entity';
import { UpdateNotificationSettingsDto } from '../dto/update-notification-settings.dto';

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectRepository(NotificationSettings)
    private repo: Repository<NotificationSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<NotificationSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        email_notifications_enabled: true,
        notify_on_new_orders: true,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateNotificationSettingsDto): Promise<NotificationSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
