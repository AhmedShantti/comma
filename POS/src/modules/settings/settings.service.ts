import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async getAll(): Promise<Setting[]> {
    return this.settingsRepository.find();
  }

  async getByKey(key: string): Promise<string> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    return setting?.value || '';
  }

  async update(updates: Record<string, string>, userId: string): Promise<void> {
    for (const [key, value] of Object.entries(updates)) {
      const setting = await this.settingsRepository.findOne({ where: { key } });
      if (setting) {
        setting.value = value;
        setting.updated_by = userId;
        await this.settingsRepository.save(setting);
      } else {
        await this.settingsRepository.save({ key, value, updated_by: userId });
      }
    }
  }
}
