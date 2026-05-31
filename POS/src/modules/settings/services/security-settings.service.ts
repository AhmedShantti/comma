import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecuritySettings } from '../entities/security-settings.entity';
import { UpdateSecuritySettingsDto } from '../dto/update-security-settings.dto';

@Injectable()
export class SecuritySettingsService {
  constructor(
    @InjectRepository(SecuritySettings)
    private repo: Repository<SecuritySettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<SecuritySettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        enforce_https_only: true,
        csrf_protection_enabled: true,
        audit_logging_enabled: true,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateSecuritySettingsDto): Promise<SecuritySettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
