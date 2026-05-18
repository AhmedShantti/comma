import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, Payment, Refund } from './entities/invoice.entity';
import { Order } from '../orders/entities/order.entity';
import { ProcessPaymentDto, RefundDto } from './dto/invoice.dto';
import { InvoiceStatus } from '../../common/enums/payment.enum';
import { OrderStatus } from '../../common/enums/order.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Refund)
    private refundsRepository: Repository<Refund>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async processPayment(orderId: string, userId: string, processPaymentDto: ProcessPaymentDto) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const totalPayment = processPaymentDto.payments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPayment < order.total) {
      throw new BadRequestException('Payment amount is less than order total');
    }

    // Generate invoice number
    const lastInvoice = await this.invoicesRepository.findOne({
      order: { issued_at: 'DESC' },
    });

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String((parseInt(lastInvoice?.invoice_number?.split('-')[2] || '0') + 1)).padStart(5, '0')}`;

    const invoice = new Invoice();
    invoice.invoice_number = invoiceNumber;
    invoice.order_id = orderId;
    invoice.subtotal = order.subtotal;
    invoice.discount_amount = order.discount_amount;
    invoice.discount_type = order.discount_type;
    invoice.tax_rate = order.tax_rate;
    invoice.tax_amount = order.tax_amount;
    invoice.service_charge_rate = order.service_charge_rate;
    invoice.service_charge_amount = order.service_charge_amount;
    invoice.total = order.total;
    invoice.status = InvoiceStatus.PAID;
    invoice.issued_by = userId;

    const savedInvoice = await this.invoicesRepository.save(invoice);

    for (const paymentData of processPaymentDto.payments) {
      await this.paymentsRepository.save({
        invoice_id: savedInvoice.id,
        method: paymentData.method,
        amount: paymentData.amount,
        reference_number: paymentData.reference_number,
        card_last_four: paymentData.card_last_four,
        processed_by: userId,
      });
    }

    // Update order status
    order.status = OrderStatus.COMPLETED;
    order.completed_at = new Date();
    await this.ordersRepository.save(order);

    return {
      invoice: savedInvoice,
      change: totalPayment - order.total,
    };
  }

  async findById(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['payments', 'refunds', 'order'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async findAll(pagination: PaginationDto, filters?: { status?: InvoiceStatus; startDate?: Date; endDate?: Date }) {
    const query = this.invoicesRepository.createQueryBuilder('invoice');

    if (filters?.status) {
      query.andWhere('invoice.status = :status', { status: filters.status });
    }

    if (filters?.startDate) {
      query.andWhere('invoice.issued_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('invoice.issued_at <= :endDate', { endDate: filters.endDate });
    }

    query
      .orderBy('invoice.issued_at', 'DESC')
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

  async getReceiptData(id: string): Promise<any> {
    const invoice = await this.findById(id);

    return {
      invoice_number: invoice.invoice_number,
      date: invoice.issued_at,
      order_number: invoice.order?.order_number,
      order_type: invoice.order?.type,
      subtotal: invoice.subtotal,
      discount: {
        type: invoice.discount_type,
        amount: invoice.discount_amount,
      },
      tax: {
        rate: invoice.tax_rate,
        amount: invoice.tax_amount,
      },
      service_charge: {
        rate: invoice.service_charge_rate,
        amount: invoice.service_charge_amount,
      },
      total: invoice.total,
      payments: invoice.payments,
    };
  }

  async processRefund(invoiceId: string, userId: string, refundDto: RefundDto) {
    const invoice = await this.findById(invoiceId);

    if (refundDto.amount > invoice.total) {
      throw new BadRequestException('Refund amount exceeds invoice total');
    }

    const refund = new Refund();
    refund.invoice_id = invoiceId;
    refund.amount = refundDto.amount;
    refund.reason = refundDto.reason;
    refund.approved_by = userId;

    await this.refundsRepository.save(refund);

    // Update invoice status
    const totalRefunded = (invoice.refunds?.reduce((sum, r) => sum + r.amount, 0) || 0) + refundDto.amount;

    if (totalRefunded >= invoice.total) {
      invoice.status = InvoiceStatus.REFUNDED;
    } else {
      invoice.status = InvoiceStatus.PARTIAL_REFUND;
    }

    await this.invoicesRepository.save(invoice);

    return refund;
  }
}
