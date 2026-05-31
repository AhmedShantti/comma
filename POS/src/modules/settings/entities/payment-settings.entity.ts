import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export interface CardProcessor {
  name: string;
  enabled: boolean;
  apiKey?: string;
}

@Entity('payment_settings')
export class PaymentSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  restaurant_id: string;

  @Column('jsonb', { default: JSON.stringify(['cash', 'card']) })
  accepted_payment_methods: string[];

  @Column('jsonb', { default: JSON.stringify([
    { name: 'stripe', enabled: false },
    { name: 'paypal', enabled: false },
    { name: 'square', enabled: false },
  ]) })
  card_processors: CardProcessor[];

  @Column({ default: true })
  tip_enabled: boolean;

  @Column('jsonb', { default: JSON.stringify([10, 15, 20, 25]) })
  tip_percentages: number[];

  @Column({ default: 'disabled' })
  tip_suggestion_mode: 'disabled' | 'percentage' | 'fixed';

  @Column('jsonb', { default: JSON.stringify([50, 100, 200]) })
  fixed_tip_amounts: number[];

  @Column({ default: false })
  split_bill_enabled: boolean;

  @Column({ default: true })
  require_payment_confirmation: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  tax_rate_percent: number;

  @Column({ default: false })
  service_charge_included_in_price: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
