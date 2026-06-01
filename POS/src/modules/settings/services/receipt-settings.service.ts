import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiptSettings } from '../entities/receipt-settings.entity';

@Injectable()
export class ReceiptSettingsService {
  constructor(
    @InjectRepository(ReceiptSettings)
    private repo: Repository<ReceiptSettings>,
  ) {}

  async getSettings(restaurantId: string): Promise<ReceiptSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });

    if (!settings) {
      settings = this.repo.create({
        restaurant_id: restaurantId,
        receipt_prefix: 'RCT',
        receipt_number_format: 'PREFIX-YYYYMMDD-XXXX',
        footer_message: 'Thank you for visiting!',
        show_tax_breakdown: true,
        show_service_charge: true,
        show_waiter_name: true,
        show_cashier_name: true,
        show_order_number: true,
        show_table_number: true,
        auto_print_after_payment: false,
        default_paper_size: '80mm',
        currency_symbol: 'EGP',
        tax_percentage: 15,
        service_charge_percentage: 0,
      });
      settings = await this.repo.save(settings);
    }

    return settings;
  }

  async updateSettings(restaurantId: string, dto: any): Promise<ReceiptSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
