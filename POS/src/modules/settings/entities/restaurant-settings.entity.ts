import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('restaurant_settings')
export class RestaurantSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ type: 'time', nullable: true })
  opening_time: string;

  @Column({ type: 'time', nullable: true })
  closing_time: string;

  @Column({ nullable: true, default: 'UTC' })
  timezone: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  default_service_charge_percent: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  default_discount_percent: number;

  @Column({ default: 'percentage' })
  service_charge_type: 'fixed' | 'percentage';

  @Column({ default: false })
  service_tax_included: boolean;

  @Column({ default: false })
  accept_online_orders: boolean;

  @Column({ default: false })
  accept_delivery: boolean;

  @Column({ default: false })
  accepts_reservations: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
