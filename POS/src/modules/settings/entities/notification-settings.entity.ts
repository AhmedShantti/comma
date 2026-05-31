import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notification_settings')
export class NotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ default: true })
  email_notifications_enabled: boolean;

  @Column({ default: false })
  sms_notifications_enabled: boolean;

  @Column({ default: true })
  push_notifications_enabled: boolean;

  @Column({ default: true })
  in_app_notifications_enabled: boolean;

  @Column({ default: true })
  notify_on_new_orders: boolean;

  @Column({ default: true })
  notify_on_payment_received: boolean;

  @Column({ default: false })
  notify_on_staff_late: boolean;

  @Column({ default: false })
  notify_on_low_inventory: boolean;

  @Column({ nullable: true })
  notification_email_address: string;

  @Column({ nullable: true })
  notification_phone_number: string;

  @Column({ default: false })
  quiet_hours_enabled: boolean;

  @Column({ type: 'time', nullable: true })
  quiet_hours_start: string;

  @Column({ type: 'time', nullable: true })
  quiet_hours_end: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
