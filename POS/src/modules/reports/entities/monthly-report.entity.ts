import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('monthly_reports')
@Unique(['month', 'year'])
export class MonthlyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'date' })
  month_start_date: string;

  @Column({ type: 'date' })
  month_end_date: string;

  @Column({ type: 'int', default: 0 })
  total_orders: number;

  @Column({ type: 'int', default: 0 })
  completed_orders: number;

  @Column({ type: 'int', default: 0 })
  cancelled_orders: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_revenue: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_cost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  gross_profit: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  net_profit: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  profit_margin_percentage: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  average_order_value: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  order_growth_percentage: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  revenue_growth_percentage: number;

  @Column({ type: 'jsonb', default: [] })
  weekly_breakdown: { week_number: number; orders: number; revenue: number; profit: number }[];

  @Column({ type: 'jsonb', default: [] })
  daily_breakdown: { date: string; orders: number; revenue: number; profit: number }[];

  @Column({ type: 'jsonb', default: [] })
  top_selling_products: { productId: string; name: string; quantity: number; revenue: number }[];

  @Column({ type: 'jsonb', default: [] })
  worst_selling_products: { productId: string; name: string; quantity: number; revenue: number }[];

  @Column({ type: 'jsonb', default: {} })
  payment_methods_breakdown: Record<string, number>;

  @Column({ type: 'jsonb', default: {} })
  customer_stats: { new_customers: number; returning_customers: number; total_unique: number };

  @Column({ nullable: true })
  busiest_day: string;

  @Column({ nullable: true })
  slowest_day: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
