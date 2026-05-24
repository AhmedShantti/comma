import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderItemAddOn } from '../orders/entities/order.entity';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';
import { TablesService } from '../tables/tables.service';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { AddonsService } from '../addons/addons.service';
import { OrderStatus, OrderType } from '../../common/enums/order.enum';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemAddOn)
    private orderItemAddonsRepository: Repository<OrderItemAddOn>,
    private tablesService: TablesService,
    private menuItemsService: MenuItemsService,
    private addonsService: AddonsService,
  ) {}

  async getTable(tableId: string) {
    const table = await this.tablesService.findById(tableId);
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return {
      id: table.id,
      table_number: table.table_number,
      capacity: table.capacity,
    };
  }

  async createCustomerOrder(dto: CreateCustomerOrderDto): Promise<Order> {
    // Validate table exists
    const table = await this.tablesService.findById(dto.tableId);
    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // Validate and fetch all menu items with variants
    const menuItems = new Map();
    for (const item of dto.items) {
      const menuItem = await this.menuItemsService.findById(item.menuItemId);
      if (!menuItem) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      }
      if (!menuItem.is_active) {
        throw new BadRequestException(`Menu item ${menuItem.name_en} is not available`);
      }
      menuItems.set(item.menuItemId, menuItem);

      // Validate variant if provided
      if (item.variantId) {
        const variant = menuItem.variants?.find(v => v.id === item.variantId);
        if (!variant) {
          throw new BadRequestException(
            `Variant ${item.variantId} not found for menu item ${menuItem.name_en}`,
          );
        }
      }
    }

    // Validate addons if provided
    for (const item of dto.items) {
      if (item.addons && item.addons.length > 0) {
        for (const addonId of item.addons) {
          const addon = await this.addonsService.findById(addonId);
          if (!addon) {
            throw new NotFoundException(`Addon ${addonId} not found`);
          }
          if (!addon.is_active) {
            throw new BadRequestException(`Addon ${addon.name_en} is not available`);
          }
        }
      }
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Calculate totals server-side
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of dto.items) {
      const menuItem = menuItems.get(item.menuItemId);
      let unitPrice = menuItem.base_price;

      if (item.variantId) {
        const variant = menuItem.variants.find(v => v.id === item.variantId);
        if (variant) {
          unitPrice += variant.price_adjustment;
        }
      }

      let addonsTotal = 0;
      const addonsList: any[] = [];

      if (item.addons && item.addons.length > 0) {
        for (const addonId of item.addons) {
          const addon = await this.addonsService.findById(addonId);
          addonsTotal += addon.price;
          addonsList.push({
            addon_id: addon.id,
            addon_name: addon.name_en,
            price: addon.price,
          });
        }
      }

      const itemTotal = (unitPrice + addonsTotal) * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        menuItem,
        unitPrice,
        variant_id: item.variantId,
        quantity: item.quantity,
        notes: item.notes,
        addons: addonsList,
      });
    }

    // Calculate tax and service charge (standard rates)
    const taxRate = 15; // Default tax rate
    const serviceChargeRate = 0; // No service charge by default
    const taxAmount = (subtotal * taxRate) / 100;
    const serviceChargeAmount = (subtotal * serviceChargeRate) / 100;
    const total = subtotal + taxAmount + serviceChargeAmount;

    // Create order
    const order = new Order();
    order.order_number = orderNumber;
    order.type = OrderType.DINE_IN;
    order.source = 'self_order';
    order.status = OrderStatus.OPEN;
    order.table_id = table.id;
    order.table_number = table.table_number;
    order.customer_name = dto.customerName || null;
    order.notes = dto.notes || null;
    order.subtotal = subtotal;
    order.tax_rate = taxRate;
    order.tax_amount = taxAmount;
    order.service_charge_rate = serviceChargeRate;
    order.service_charge_amount = serviceChargeAmount;
    order.total = total;
    order.discount_amount = 0;
    order.discount_type = null;
    order.discount_value = null;

    const savedOrder = await this.ordersRepository.save(order);

    // Add items to order
    for (const itemData of orderItemsData) {
      const orderItem = new OrderItem();
      orderItem.order_id = savedOrder.id;
      orderItem.menu_item_id = itemData.menuItem.id;
      orderItem.variant_id = itemData.variant_id;
      orderItem.item_name_ar = itemData.menuItem.name_ar;
      orderItem.item_name_en = itemData.menuItem.name_en;
      orderItem.unit_price = itemData.unitPrice;
      orderItem.quantity = itemData.quantity;
      orderItem.notes = itemData.notes;
      orderItem.subtotal = itemData.unitPrice * itemData.quantity;

      const savedItem = await this.orderItemsRepository.save(orderItem);

      // Add addons to item
      for (const addon of itemData.addons) {
        await this.orderItemAddonsRepository.save({
          order_item_id: savedItem.id,
          addon_id: addon.addon_id,
          addon_name: addon.addon_name,
          price: addon.price,
        });
      }
    }

    return this.findOrderById(savedOrder.id);
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await this.ordersRepository.count({
      where: { created_at: new Date() },
    });
    return `ORD-${today}-${String(count + 1).padStart(4, '0')}`;
  }

  private async findOrderById(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.addons', 'table'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
