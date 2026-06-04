import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('business_settings')
export class BusinessSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurant_id: string;

  @Column({ nullable: true })
  restaurant_name: string;

  @Column({ nullable: true })
  restaurant_phone: string;

  @Column({ nullable: true })
  restaurant_email: string;

  @Column({ nullable: true })
  business_address: string;

  @Column({ nullable: true })
  business_city: string;

  @Column({ nullable: true })
  business_postal_code: string;

  @Column({ nullable: true })
  business_license_number: string;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ default: 'ILS' })
  currency_code: string;

  @Column({ nullable: true })
  owner_name: string;

  @Column({ nullable: true })
  owner_email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
