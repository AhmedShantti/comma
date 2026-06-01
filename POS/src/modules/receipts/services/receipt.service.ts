import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Receipt, ReceiptItem } from '../entities/receipt.entity';
import { Order } from '../../orders/entities/order.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private receiptsRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemsRepository: Repository<ReceiptItem>,
  ) {}

  async generateReceipt(
    order: Order,
    cashierName: string,
    waiterName?: string,
    paymentMethod?: string,
    businessInfo?: { name?: string; address?: string; phone?: string; taxId?: string; footer?: string },
  ): Promise<Receipt> {
    const receiptNumber = await this.generateReceiptNumber();

    const receipt = new Receipt();
    receipt.receipt_number = receiptNumber;
    receipt.order_id = order.id;
    receipt.table_number = order.table_number;
    receipt.table_id = order.table_id;
    receipt.order_number = order.order_number;
    receipt.cashier_id = order.cashier_id;
    receipt.cashier_name = cashierName;
    receipt.waiter_name = waiterName || null;
    receipt.subtotal = order.subtotal;
    receipt.discount_type = order.discount_type;
    receipt.discount_amount = order.discount_amount;
    receipt.tax_rate = order.tax_rate;
    receipt.tax_amount = order.tax_amount;
    receipt.service_charge_rate = order.service_charge_rate;
    receipt.service_charge_amount = order.service_charge_amount;
    receipt.total = order.total;
    receipt.payment_method = paymentMethod || 'cash';
    receipt.payment_status = 'paid';
    receipt.business_name = businessInfo?.name || null;
    receipt.business_address = businessInfo?.address || null;
    receipt.business_phone = businessInfo?.phone || null;
    receipt.tax_id = businessInfo?.taxId || null;
    receipt.footer_message = businessInfo?.footer || null;

    const savedReceipt = await this.receiptsRepository.save(receipt);

    // Create receipt items from non-voided order items
    if (order.items) {
      for (const item of order.items) {
        if (item.is_voided) continue;

        const addonsTotal = item.addons
          ? item.addons.reduce((sum, addon) => sum + Number(addon.price) * item.quantity, 0)
          : 0;

        const lineTotal = Number(item.unit_price) * item.quantity + addonsTotal;

        await this.receiptItemsRepository.save({
          receipt_id: savedReceipt.id,
          item_name_en: item.item_name_en,
          item_name_ar: item.item_name_ar,
          quantity: item.quantity,
          unit_price: item.unit_price,
          addons_total: addonsTotal,
          line_total: lineTotal,
          notes: item.notes,
        });
      }
    }

    return this.findById(savedReceipt.id);
  }

  async findById(id: string): Promise<Receipt> {
    const receipt = await this.receiptsRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    return receipt;
  }

  async findByReceiptNumber(receiptNumber: string): Promise<Receipt> {
    const receipt = await this.receiptsRepository.findOne({
      where: { receipt_number: receiptNumber },
      relations: ['items'],
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    return receipt;
  }

  async findAll(filters: any) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const query = this.receiptsRepository.createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.items', 'items');

    if (filters.receipt_number) {
      query.andWhere('receipt.receipt_number ILIKE :receiptNumber', {
        receiptNumber: `%${filters.receipt_number}%`,
      });
    }

    if (filters.table_number) {
      query.andWhere('receipt.table_number = :tableNumber', {
        tableNumber: Number(filters.table_number),
      });
    }

    if (filters.table_id) {
      query.andWhere('receipt.table_id = :tableId', { tableId: filters.table_id });
    }

    if (filters.cashier_id) {
      query.andWhere('receipt.cashier_id = :cashierId', { cashierId: filters.cashier_id });
    }

    if (filters.payment_method) {
      query.andWhere('receipt.payment_method = :paymentMethod', {
        paymentMethod: filters.payment_method,
      });
    }

    if (filters.start_date) {
      query.andWhere('receipt.created_at >= :startDate', { startDate: filters.start_date });
    }

    if (filters.end_date) {
      query.andWhere('receipt.created_at <= :endDate', { endDate: filters.end_date });
    }

    query
      .orderBy('receipt.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReceiptStats(): Promise<any> {
    const now = new (globalThis as any).Date();
    const todayStart = new (globalThis as any).Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new (globalThis as any).Date(now.getFullYear(), now.getMonth(), 1);

    const receiptsToday = await this.receiptsRepository.count({
      where: { created_at: MoreThanOrEqual(todayStart) as any },
    });

    const revenueTodayResult = await this.receiptsRepository
      .createQueryBuilder('receipt')
      .select('COALESCE(SUM(receipt.total), 0)', 'total')
      .where('receipt.created_at >= :todayStart', { todayStart })
      .getRawOne();

    const revenueMonthResult = await this.receiptsRepository
      .createQueryBuilder('receipt')
      .select('COALESCE(SUM(receipt.total), 0)', 'total')
      .where('receipt.created_at >= :monthStart', { monthStart })
      .getRawOne();

    const avgResult = await this.receiptsRepository
      .createQueryBuilder('receipt')
      .select('COALESCE(AVG(receipt.total), 0)', 'avg')
      .where('receipt.created_at >= :monthStart', { monthStart })
      .getRawOne();

    return {
      receiptsToday,
      revenueToday: Number(revenueTodayResult?.total || 0),
      revenueThisMonth: Number(revenueMonthResult?.total || 0),
      averageReceiptValue: Number(Number(avgResult?.avg || 0).toFixed(2)),
    };
  }

  async getMostActiveTables(): Promise<any[]> {
    const now = new (globalThis as any).Date();
    const monthStart = new (globalThis as any).Date(now.getFullYear(), now.getMonth(), 1);

    return this.receiptsRepository
      .createQueryBuilder('receipt')
      .select('receipt.table_number', 'table_number')
      .addSelect('COUNT(*)', 'receipt_count')
      .addSelect('SUM(receipt.total)', 'total_revenue')
      .where('receipt.created_at >= :monthStart', { monthStart })
      .andWhere('receipt.table_number IS NOT NULL')
      .groupBy('receipt.table_number')
      .orderBy('receipt_count', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getTopSellingItems(): Promise<any[]> {
    const now = new (globalThis as any).Date();
    const monthStart = new (globalThis as any).Date(now.getFullYear(), now.getMonth(), 1);

    return this.receiptItemsRepository
      .createQueryBuilder('item')
      .innerJoin('item.receipt', 'receipt')
      .select('item.item_name_en', 'item_name')
      .addSelect('SUM(item.quantity)', 'total_quantity')
      .addSelect('SUM(item.line_total)', 'total_revenue')
      .where('receipt.created_at >= :monthStart', { monthStart })
      .groupBy('item.item_name_en')
      .orderBy('total_quantity', 'DESC')
      .limit(10)
      .getRawMany();
  }

  private async generateReceiptNumber(): Promise<string> {
    const now = new (globalThis as any).Date();
    const todayStart = new (globalThis as any).Date(now.getFullYear(), now.getMonth(), now.getDate());

    const count = await this.receiptsRepository.count({
      where: {
        created_at: MoreThanOrEqual(todayStart) as any,
      },
    });

    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    return `RCT-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
}
