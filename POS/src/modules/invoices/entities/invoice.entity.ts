import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { InvoiceStatus, PaymentMethod } from '../../../common/enums/payment.enum';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoice_number: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  order_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discount_amount: number;

  @Column({ nullable: true })
  discount_type: string;

  @Column('decimal', { precision: 5, scale: 2 })
  tax_rate: number;

  @Column('decimal', { precision: 10, scale: 2 })
  tax_amount: number;

  @Column('decimal', { precision: 5, scale: 2 })
  service_charge_rate: number;

  @Column('decimal', { precision: 10, scale: 2 })
  service_charge_amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: InvoiceStatus })
  status: InvoiceStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'issued_by' })
  issuedBy: User;

  @Column()
  issued_by: string;

  @OneToMany(() => Payment, payment => payment.invoice)
  payments: Payment[];

  @OneToMany(() => Refund, refund => refund.invoice)
  refunds: Refund[];

  @CreateDateColumn()
  issued_at: Date;
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, invoice => invoice.payments)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column()
  invoice_id: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  reference_number: string;

  @Column({ nullable: true })
  card_last_four: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'processed_by' })
  processedBy: User;

  @Column()
  processed_by: string;

  @CreateDateColumn()
  received_at: Date;
}

@Entity('refunds')
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, invoice => invoice.refunds)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column()
  invoice_id: string;

  @ManyToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ nullable: true })
  payment_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  reason: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User;

  @Column()
  approved_by: string;

  @CreateDateColumn()
  refunded_at: Date;
}
