import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { OrderType, OrderStatus } from '../../../common/enums/order.enum';
import { User } from '../../users/entities/user.entity';
import { Shift } from '../../shifts/entities/shift.entity';
import { Table } from '../../tables/entities/table.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_number: string;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ default: 'pos' })
  source: 'pos' | 'self_order';

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.OPEN })
  status: OrderStatus;

  @Column({ type: 'int', nullable: true })
  table_number: number;

  @ManyToOne(() => Table, table => table.orders, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @Column({ nullable: true })
  table_id: string;

  @Column({ nullable: true })
  customer_name: string;

  @Column({ nullable: true })
  customer_phone: string;

  @Column({ nullable: true })
  delivery_address: string;

  @Column({ nullable: true })
  notes: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number = 0;

  @Column({ nullable: true })
  discount_type: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount_value: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discount_amount: number = 0;

  @Column('decimal', { precision: 5, scale: 2 })
  tax_rate: number;

  @Column('decimal', { precision: 10, scale: 2 })
  tax_amount: number = 0;

  @Column('decimal', { precision: 5, scale: 2 })
  service_charge_rate: number = 0;

  @Column('decimal', { precision: 10, scale: 2 })
  service_charge_amount: number = 0;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number = 0;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'cashier_id' })
  cashier: User;

  @Column({ nullable: true })
  cashier_id: string;

  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column({ nullable: true })
  shift_id: string;

  @Column({ nullable: true })
  confirmed_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  cancelled_at: Date;

  @Column({ nullable: true })
  cancel_reason: string;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderStatusLog, log => log.order, { cascade: true })
  statusLogs: OrderStatusLog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  order_id: string;

  @Column()
  menu_item_id: string;

  @Column({ nullable: true })
  variant_id: string;

  @Column()
  item_name_ar: string;

  @Column()
  item_name_en: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('integer', { default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number = 0;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  is_voided: boolean;

  @Column({ nullable: true })
  void_reason: string;

  @Column({ nullable: true })
  voided_by: string;

  @Column({ nullable: true })
  voided_at: Date;

  @OneToMany(() => OrderItemAddOn, addon => addon.orderItem, { cascade: true })
  addons: OrderItemAddOn[];

  @CreateDateColumn()
  created_at: Date;
}

@Entity('order_item_addons')
export class OrderItemAddOn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderItem, item => item.addons)
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;

  @Column()
  order_item_id: string;

  @Column()
  addon_id: string;

  @Column()
  addon_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}

@Entity('order_status_logs')
export class OrderStatusLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.statusLogs)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  order_id: string;

  @Column({ nullable: true })
  from_status: string;

  @Column()
  to_status: string;

  @Column({ nullable: true })
  changed_by: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  changed_at: Date;
}
