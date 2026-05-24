import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual } from 'typeorm';
import { Order, OrderItem, OrderItemAddOn, OrderStatusLog } from './entities/order.entity';
import { CreateOrderDto, UpdateOrderDto, ChangeOrderStatusDto, AddOrderItemsDto, UpdateOrderItemDto, VoidOrderItemDto } from './dto/create-order.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { OrderStatus, OrderType } from '../../common/enums/order.enum';
import { ShiftsService } from '../shifts/shifts.service';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { AddonsService } from '../addons/addons.service';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemAddOn)
    private orderItemAddonsRepository: Repository<OrderItemAddOn>,
    @InjectRepository(OrderStatusLog)
    private orderStatusLogRepository: Repository<OrderStatusLog>,
    private shiftsService: ShiftsService,
    private menuItemsService: MenuItemsService,
    private addonsService: AddonsService,
    private tablesService: TablesService,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const shift = await this.shiftsService.getCurrentShift(userId);

    // Resolve table_id to table_number if needed
    let tableNumber: number | undefined;
    let tableId: string | undefined;
    if (createOrderDto.table_id) {
      const table = await this.tablesService.findById(createOrderDto.table_id);
      tableNumber = table.table_number;
      tableId = table.id;
    } else if (createOrderDto.table_number) {
      tableNumber = createOrderDto.table_number;
    }

    // Get today's order count for numbering
   
    const orderNumber = await this.generateOrderNumber();

    const order = new Order();
    order.order_number = orderNumber;
    order.type = createOrderDto.type;
    order.cashier_id = userId;
    order.shift_id = shift.id;
    order.customer_name = createOrderDto.customer_name;
    order.customer_phone = createOrderDto.customer_phone;
    order.delivery_address = createOrderDto.delivery_address;
    order.table_number = tableNumber;
    order.table_id = tableId;
    order.notes = createOrderDto.notes;
    order.tax_rate = 15;
    order.service_charge_rate = 0;
    order.discount_type = createOrderDto.discount_type;
    order.discount_value = createOrderDto.discount_value;

    const saved = await this.ordersRepository.save(order);

    if (createOrderDto.items && createOrderDto.items.length > 0) {
      await this.addItems(saved.id, createOrderDto.items, userId);
    }

    return this.findById(saved.id);
  }

  async addItems(orderId: string, items: any[], userId: string): Promise<void> {
    const order = await this.findById(orderId);

    if (order.status !== OrderStatus.OPEN) {
      throw new ConflictException('Can only add items to OPEN orders');
    }

    for (const itemDto of items) {
      const menuItem = await this.menuItemsService.findById(itemDto.menu_item_id);

      if (!menuItem.is_active) {
        throw new BadRequestException(`Menu item ${menuItem.name_en} is not available`);
      }

      let unitPrice = menuItem.base_price;
      if (itemDto.variant_id) {
        const variant = menuItem.variants.find(v => v.id === itemDto.variant_id);
        if (variant) {
          unitPrice += variant.price_adjustment;
        }
      }

      const orderItem = new OrderItem();
      orderItem.order_id = orderId;
      orderItem.menu_item_id = itemDto.menu_item_id;
      orderItem.variant_id = itemDto.variant_id;
      orderItem.item_name_ar = menuItem.name_ar;
      orderItem.item_name_en = menuItem.name_en;
      orderItem.unit_price = unitPrice;
      orderItem.quantity = itemDto.quantity;
      orderItem.notes = itemDto.notes;

      const savedItem = await this.orderItemsRepository.save(orderItem);

      if (itemDto.addon_ids && itemDto.addon_ids.length > 0) {
        for (const addonId of itemDto.addon_ids) {
          const addon = await this.addonsService.findById(addonId);
          await this.orderItemAddonsRepository.save({
            order_item_id: savedItem.id,
            addon_id: addon.id,
            addon_name: addon.name_en,
            price: addon.price,
          });
        }
      }
    }

    await this.recalculateOrderPrice(orderId);
  }

  async updateItem(orderId: string, itemId: string, updateItemDto: UpdateOrderItemDto, userId: string): Promise<void> {
    const order = await this.findById(orderId);

    if (order.status !== OrderStatus.OPEN) {
      throw new ConflictException('Can only modify items in OPEN orders');
    }

    const item = await this.orderItemsRepository.findOne({ where: { id: itemId, order_id: orderId } });
    if (!item) {
      throw new NotFoundException('Order item not found');
    }

    if (updateItemDto.quantity) {
      item.quantity = updateItemDto.quantity;
    }
    if (updateItemDto.notes) {
      item.notes = updateItemDto.notes;
    }

    await this.orderItemsRepository.save(item);
    await this.recalculateOrderPrice(orderId);
  }

  async voidItem(orderId: string, itemId: string, voidDto: VoidOrderItemDto, userId: string): Promise<void> {
    const order = await this.findById(orderId);
    const item = await this.orderItemsRepository.findOne({ where: { id: itemId, order_id: orderId } });

    if (!item) {
      throw new NotFoundException('Order item not found');
    }

    item.is_voided = true;
    item.void_reason = voidDto.reason;
    item.voided_by = userId;
    item.voided_at = new Date();

    await this.orderItemsRepository.save(item);
    await this.recalculateOrderPrice(orderId);
  }

  async removeItem(orderId: string, itemId: string): Promise<void> {
    const order = await this.findById(orderId);

    if (order.status !== OrderStatus.OPEN) {
      throw new ConflictException('Can only remove items from OPEN orders');
    }

    await this.orderItemAddonsRepository.delete({ order_item_id: itemId });
    await this.orderItemsRepository.delete(itemId);
    await this.recalculateOrderPrice(orderId);
  }

  private async recalculateOrderPrice(orderId: string): Promise<void> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.addons'],
    });

    if (!order) return;

    // Calculate subtotal
    let subtotal = 0;
    for (const item of order.items) {
      if (!item.is_voided) {
        const itemAddonsTotal = item.addons.reduce((sum, addon) => sum + addon.price * item.quantity, 0);
        const itemSubtotal = item.unit_price * item.quantity + itemAddonsTotal;
        subtotal += itemSubtotal;
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (order.discount_value) {
      if (order.discount_type === 'percentage') {
        discountAmount = (subtotal * order.discount_value) / 100;
      } else {
        discountAmount = order.discount_value;
      }
    }

    // Calculate tax and service charge
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * order.tax_rate) / 100;
    const serviceChargeAmount = (taxableAmount * order.service_charge_rate) / 100;

    // Calculate total
    const total = subtotal - discountAmount + taxAmount + serviceChargeAmount;

    order.subtotal = subtotal;
    order.discount_amount = discountAmount;
    order.tax_amount = taxAmount;
    order.service_charge_amount = serviceChargeAmount;
    order.total = total;

    await this.ordersRepository.save(order);
  }

  async changeStatus(orderId: string, changeStatusDto: ChangeOrderStatusDto, userId: string): Promise<Order> {
    const order = await this.findById(orderId);
    const newStatus = changeStatusDto.status as OrderStatus;

    this.validateStatusTransition(order.status, newStatus);

    if (newStatus === OrderStatus.OPEN) {
      throw new ConflictException('Cannot transition to OPEN status');
    }

    const oldStatus = order.status;
    order.status = newStatus;

    if (newStatus === OrderStatus.CONFIRMED) {
      order.confirmed_at = new Date();
    } else if (newStatus === OrderStatus.COMPLETED) {
      order.completed_at = new Date();
    } else if (newStatus === OrderStatus.CANCELLED) {
      order.cancelled_at = new Date();
    }

    await this.ordersRepository.save(order);

    // Log status change
    await this.orderStatusLogRepository.save({
      order_id: orderId,
      from_status: oldStatus,
      to_status: newStatus,
      changed_by: userId,
      notes: changeStatusDto.notes,
    });

    return this.findById(orderId);
  }

  private validateStatusTransition(fromStatus: OrderStatus, toStatus: OrderStatus): void {
    const validTransitions: { [key in OrderStatus]: OrderStatus[] } = {
      [OrderStatus.OPEN]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY],
      [OrderStatus.READY]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[fromStatus] || !validTransitions[fromStatus].includes(toStatus)) {
      throw new ConflictException(`Invalid status transition from ${fromStatus} to ${toStatus}`);
    }
  }

  async cancel(orderId: string, reason: string, userId: string): Promise<Order> {
    const order = await this.findById(orderId);

    if ([OrderStatus.COMPLETED, OrderStatus.REFUNDED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new ConflictException(`Cannot cancel order with status ${order.status}`);
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelled_at = new Date();
    order.cancel_reason = reason;

    await this.ordersRepository.save(order);

    await this.orderStatusLogRepository.save({
      order_id: orderId,
      from_status: order.status,
      to_status: OrderStatus.CANCELLED,
      changed_by: userId,
      notes: reason,
    });

    return this.findById(orderId);
  }

  private async generateOrderNumber(): Promise<string> {
  return await this.dataSource.transaction('SERIALIZABLE', async (manager) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lock rows first, then count — PostgreSQL doesn't allow FOR UPDATE with COUNT()
    const rows = await manager
      .createQueryBuilder(Order, 'order')
      .select('order.id')
      .where('order.created_at >= :today', { today })
      .setLock('pessimistic_write')
      .getMany();

    return `#${String(rows.length + 1).padStart(3, '0')}`;
  });
}

  async findById(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.addons', 'statusLogs', 'cashier'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findAll(pagination: PaginationDto, filters?: { status?: OrderStatus; type?: OrderType; cashierId?: string; startDate?: Date; endDate?: Date }) {
    const query = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.cashier', 'cashier');

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('order.type = :type', { type: filters.type });
    }

    if (filters?.cashierId) {
      query.andWhere('order.cashier_id = :cashierId', { cashierId: filters.cashierId });
    }

    if (filters?.startDate) {
      query.andWhere('order.created_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('order.created_at <= :endDate', { endDate: filters.endDate });
    }

    query
      .orderBy('order.created_at', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getActiveOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      where: [
        { status: OrderStatus.OPEN },
        { status: OrderStatus.CONFIRMED },
        { status: OrderStatus.PREPARING },
        { status: OrderStatus.READY },
      ],
      relations: ['items', 'items.addons', 'cashier'],
      order: { created_at: 'ASC' },
    });
  }

  async getOrderHistory(orderId: string): Promise<OrderStatusLog[]> {
    return this.orderStatusLogRepository.find({
      where: { order_id: orderId },
      order: { changed_at: 'ASC' },
    });
  }

  async duplicateOrder(orderId: string, userId: string): Promise<Order> {
    const sourceOrder = await this.findById(orderId);

    const newOrder = new Order();
    newOrder.type = sourceOrder.type;
    newOrder.status = OrderStatus.OPEN;
    newOrder.customer_name = sourceOrder.customer_name;
    newOrder.customer_phone = sourceOrder.customer_phone;
    newOrder.delivery_address = sourceOrder.delivery_address;
    newOrder.table_number = sourceOrder.table_number;
    newOrder.notes = sourceOrder.notes;
    newOrder.tax_rate = sourceOrder.tax_rate;
    newOrder.service_charge_rate = sourceOrder.service_charge_rate;
    newOrder.discount_type = sourceOrder.discount_type;
    newOrder.discount_value = sourceOrder.discount_value;
    newOrder.cashier_id = userId;

    const shift = await this.shiftsService.getCurrentShift(userId);
    newOrder.shift_id = shift.id;

    newOrder.order_number = await this.generateOrderNumber();

    const saved = await this.ordersRepository.save(newOrder);

    // Copy items
    const itemsToAdd = sourceOrder.items
      .filter(item => !item.is_voided)
      .map(item => ({
        menu_item_id: item.menu_item_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        notes: item.notes,
        addon_ids: item.addons.map(a => a.addon_id),
      }));

    if (itemsToAdd.length > 0) {
      await this.addItems(saved.id, itemsToAdd, userId);
    }

    return this.findById(saved.id);
  }

  async update(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findById(orderId);

    if (updateOrderDto.customer_name) {
      order.customer_name = updateOrderDto.customer_name;
    }
    if (updateOrderDto.customer_phone) {
      order.customer_phone = updateOrderDto.customer_phone;
    }
    if (updateOrderDto.notes) {
      order.notes = updateOrderDto.notes;
    }
    if (updateOrderDto.discount_value !== undefined) {
      order.discount_value = updateOrderDto.discount_value;
    }
    if (updateOrderDto.discount_type) {
      order.discount_type = updateOrderDto.discount_type;
    }

    await this.ordersRepository.save(order);
    await this.recalculateOrderPrice(orderId);

    return this.findById(orderId);
  }
}
