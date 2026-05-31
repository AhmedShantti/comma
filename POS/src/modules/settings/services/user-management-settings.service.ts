import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserManagementSettings } from '../entities/user-management-settings.entity';
import { UpdateUserManagementSettingsDto } from '../dto/update-user-management-settings.dto';

@Injectable()
export class UserManagementSettingsService {
  constructor(
    @InjectRepository(UserManagementSettings)
    private repo: Repository<UserManagementSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<UserManagementSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        password_min_length: 8,
        password_require_uppercase: true,
        password_require_numbers: true,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateUserManagementSettingsDto): Promise<UserManagementSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
