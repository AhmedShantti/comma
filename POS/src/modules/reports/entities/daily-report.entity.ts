import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('daily_reports')
export class DailyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', unique: true })
  report_date: string;

  @Column({ type: 'int', default: 0 })
  total_orders: number;

  @Column({ type: 'int', default: 0 })
  completed_orders: number;

  @Column({ type: 'int', default: 0 })
  cancelled_orders: number;

  @Column({ type: 'int', default: 0 })
  pending_orders: number;

  @Column({ type: 'int', default: 0 })
  new_customers: number;

  @Column({ type: 'int', default: 0 })
  returning_customers: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_revenue: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_cost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  gross_profit: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  net_profit: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  average_order_value: number;

  @Column({ type: 'jsonb', default: [] })
  top_selling_products: { productId: string; name: string; quantity: number; revenue: number }[];

  @Column({ type: 'jsonb', default: {} })
  payment_methods_breakdown: Record<string, number>;

  @Column({ type: 'jsonb', default: [] })
  hourly_distribution: { hour: number; orders_count: number; revenue: number }[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
