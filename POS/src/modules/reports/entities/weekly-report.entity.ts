import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('weekly_reports')
@Unique(['week_number', 'year'])
export class WeeklyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  week_number: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'date' })
  week_start_date: string;

  @Column({ type: 'date' })
  week_end_date: string;

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

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  average_order_value: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  order_growth_percentage: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  revenue_growth_percentage: number;

  @Column({ type: 'jsonb', default: [] })
  daily_breakdown: { date: string; orders: number; revenue: number; profit: number }[];

  @Column({ type: 'jsonb', default: [] })
  top_selling_products: { productId: string; name: string; quantity: number; revenue: number }[];

  @Column({ type: 'jsonb', default: {} })
  payment_methods_breakdown: Record<string, number>;

  @Column({ nullable: true })
  busiest_day: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
