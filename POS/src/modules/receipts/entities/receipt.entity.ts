import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  receipt_number: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  order_id: string;

  @Column({ type: 'int', nullable: true })
  table_number: number;

  @Column({ nullable: true })
  table_id: string;

  @Column()
  order_number: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'cashier_id' })
  cashier: User;

  @Column({ nullable: true })
  cashier_id: string;

  @Column({ nullable: true })
  cashier_name: string;

  @Column({ nullable: true })
  waiter_id: string;

  @Column({ nullable: true })
  waiter_name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ nullable: true })
  discount_type: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  tax_rate: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  service_charge_rate: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  service_charge_amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ nullable: true })
  payment_method: string;

  @Column({ default: 'paid' })
  payment_status: string;

  @Column({ nullable: true })
  business_name: string;

  @Column({ nullable: true })
  business_address: string;

  @Column({ nullable: true })
  business_phone: string;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ nullable: true, type: 'text' })
  footer_message: string;

  @OneToMany(() => ReceiptItem, item => item.receipt, { cascade: true })
  items: ReceiptItem[];

  @CreateDateColumn()
  created_at: Date;
}

@Entity('receipt_items')
export class ReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Receipt, receipt => receipt.items)
  @JoinColumn({ name: 'receipt_id' })
  receipt: Receipt;

  @Column()
  receipt_id: string;

  @Column()
  item_name_en: string;

  @Column()
  item_name_ar: string;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  unit_price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  addons_total: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  line_total: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;
}
