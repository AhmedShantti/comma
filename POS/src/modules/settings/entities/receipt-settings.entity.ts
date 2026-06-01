import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('receipt_settings')
export class ReceiptSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurant_id: string;

  @Column({ default: 'RCT' })
  receipt_prefix: string;

  @Column({ default: 'PREFIX-YYYYMMDD-XXXX' })
  receipt_number_format: string;

  @Column({ nullable: true })
  business_name_on_receipt: string;

  @Column({ nullable: true })
  business_address_on_receipt: string;

  @Column({ nullable: true })
  business_phone_on_receipt: string;

  @Column({ nullable: true })
  tax_number_on_receipt: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true, type: 'text' })
  header_text: string;

  @Column({ nullable: true, type: 'text' })
  footer_message: string;

  @Column({ default: true })
  show_tax_breakdown: boolean;

  @Column({ default: true })
  show_service_charge: boolean;

  @Column({ default: true })
  show_waiter_name: boolean;

  @Column({ default: true })
  show_cashier_name: boolean;

  @Column({ default: true })
  show_order_number: boolean;

  @Column({ default: true })
  show_table_number: boolean;

  @Column({ default: false })
  auto_print_after_payment: boolean;

  @Column({ default: '80mm' })
  default_paper_size: string;

  @Column({ default: 'EGP' })
  currency_symbol: string;

  @Column('decimal', { precision: 5, scale: 2, default: 15 })
  tax_percentage: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  service_charge_percentage: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
