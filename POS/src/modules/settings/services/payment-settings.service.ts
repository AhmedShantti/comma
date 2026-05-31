import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentSettings } from '../entities/payment-settings.entity';
import { UpdatePaymentSettingsDto } from '../dto/update-payment-settings.dto';

@Injectable()
export class PaymentSettingsService {
  constructor(
    @InjectRepository(PaymentSettings)
    private repo: Repository<PaymentSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<PaymentSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        accepted_payment_methods: ['cash', 'card'],
        tip_enabled: true,
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdatePaymentSettingsDto): Promise<PaymentSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
