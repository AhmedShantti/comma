import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface OrderStatus {
  id: string;
  name: string;
  displayColor: string;
  order: number;
  isTerminal: boolean;
  isPredefined: boolean;
}

export interface TransitionRule {
  from: string;
  to: string[];
}

@Entity('order_status_settings')
export class OrderStatusSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column('jsonb', {
    default: JSON.stringify([
      { id: 'open', name: 'Open', displayColor: '#FFB800', order: 1, isTerminal: false, isPredefined: true },
      { id: 'confirmed', name: 'Confirmed', displayColor: '#4CAF50', order: 2, isTerminal: false, isPredefined: true },
      { id: 'preparing', name: 'Preparing', displayColor: '#2196F3', order: 3, isTerminal: false, isPredefined: true },
      { id: 'ready', name: 'Ready', displayColor: '#9C27B0', order: 4, isTerminal: false, isPredefined: true },
      { id: 'served', name: 'Served', displayColor: '#4CAF50', order: 5, isTerminal: false, isPredefined: true },
      { id: 'paid', name: 'Paid', displayColor: '#00BCD4', order: 6, isTerminal: true, isPredefined: true },
      { id: 'cancelled', name: 'Cancelled', displayColor: '#F44336', order: 7, isTerminal: true, isPredefined: true },
    ])
  })
  statuses: OrderStatus[];

  @Column('jsonb', { nullable: true })
  transition_rules: TransitionRule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
