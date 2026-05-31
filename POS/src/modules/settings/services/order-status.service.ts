import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusSettings, OrderStatus } from '../entities/order-status-settings.entity';
import { UpdateOrderStatusSettingsDto } from '../dto/update-order-status-settings.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatusSettings)
    private repo: Repository<OrderStatusSettings>,
  ) {}

  private predefinedStatuses(): OrderStatus[] {
    return [
      { id: 'open', name: 'Open', displayColor: '#FFB800', order: 1, isTerminal: false, isPredefined: true },
      { id: 'confirmed', name: 'Confirmed', displayColor: '#4CAF50', order: 2, isTerminal: false, isPredefined: true },
      { id: 'preparing', name: 'Preparing', displayColor: '#2196F3', order: 3, isTerminal: false, isPredefined: true },
      { id: 'ready', name: 'Ready', displayColor: '#9C27B0', order: 4, isTerminal: false, isPredefined: true },
      { id: 'served', name: 'Served', displayColor: '#4CAF50', order: 5, isTerminal: false, isPredefined: true },
      { id: 'paid', name: 'Paid', displayColor: '#00BCD4', order: 6, isTerminal: true, isPredefined: true },
      { id: 'cancelled', name: 'Cancelled', displayColor: '#F44336', order: 7, isTerminal: true, isPredefined: true },
    ];
  }

  async getSettings(restaurantId: string): Promise<OrderStatusSettings> {
    let settings = await this.repo.findOne({ where: { restaurant_id: restaurantId } });
    if (!settings) {
      settings = await this.repo.save({
        restaurant_id: restaurantId,
        statuses: this.predefinedStatuses(),
      });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateOrderStatusSettingsDto): Promise<OrderStatusSettings> {
    const settings = await this.getSettings(restaurantId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }

  async addCustomStatus(restaurantId: string, name: string, displayColor: string, isTerminal: boolean): Promise<OrderStatus> {
    const settings = await this.getSettings(restaurantId);
    const newStatus: OrderStatus = {
      id: uuid(),
      name,
      displayColor,
      order: Math.max(...settings.statuses.map(s => s.order), 0) + 1,
      isTerminal,
      isPredefined: false,
    };
    settings.statuses.push(newStatus);
    await this.repo.save(settings);
    return newStatus;
  }

  async deleteCustomStatus(restaurantId: string, statusId: string): Promise<void> {
    const settings = await this.getSettings(restaurantId);
    const status = settings.statuses.find(s => s.id === statusId);
    if (status?.isPredefined) {
      throw new Error('Cannot delete predefined status');
    }
    settings.statuses = settings.statuses.filter(s => s.id !== statusId);
    await this.repo.save(settings);
  }
}
