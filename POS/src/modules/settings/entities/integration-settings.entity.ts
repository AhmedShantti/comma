import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('integration_settings')
export class IntegrationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  restaurant_id: string;

  @Column({ default: false })
  enable_accounting_sync: boolean;

  @Column({ nullable: true })
  accounting_provider: string;

  @Column({ default: false })
  enable_delivery_integration: boolean;

  @Column('jsonb', { default: JSON.stringify([]) })
  delivery_providers: string[];

  @Column({ default: false })
  enable_loyalty_program: boolean;

  @Column({ nullable: true })
  loyalty_provider: string;

  @Column({ default: false })
  enable_inventory_sync: boolean;

  @Column({ nullable: true })
  inventory_provider: string;

  @Column({ default: false })
  enable_staff_scheduling_sync: boolean;

  @Column({ nullable: true })
  scheduling_provider: string;

  @Column({ default: false })
  enable_webhook_notifications: boolean;

  @Column({ nullable: true })
  webhook_url: string;

  @Column({ type: 'text', nullable: true, select: false })
  webhook_secret_key: string;

  @Column('jsonb', { default: JSON.stringify([]) })
  webhook_events: string[];

  @Column({ type: 'text', nullable: true, select: false })
  api_key: string;

  @Column({ type: 'text', nullable: true, select: false })
  api_secret: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
