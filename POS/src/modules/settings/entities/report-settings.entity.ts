import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('report_settings')
export class ReportSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ default: false })
  auto_daily_reports: boolean;

  @Column({ type: 'time', default: '23:00' })
  daily_report_time: string;

  @Column('jsonb', { default: JSON.stringify([]) })
  daily_report_recipients: string[];

  @Column({ default: false })
  auto_weekly_reports: boolean;

  @Column({ default: 0, type: 'integer' })
  weekly_report_day: number;

  @Column({ type: 'time', nullable: true })
  weekly_report_time: string;

  @Column('jsonb', { default: JSON.stringify([]) })
  weekly_report_recipients: string[];

  @Column({ default: true })
  enable_profit_margins: boolean;

  @Column({ default: true })
  enable_sales_by_category: boolean;

  @Column({ default: false })
  enable_inventory_reports: boolean;

  @Column({ default: false })
  enable_staff_performance: boolean;

  @Column({ default: 'pdf' })
  export_format_default: 'pdf' | 'excel' | 'csv';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
