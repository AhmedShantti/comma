import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ReportType, ReportStatus, ReportTrigger } from '../enums/report-type.enum';

@Entity('report_generation_logs')
export class ReportLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReportType })
  report_type: ReportType;

  @Column({ type: 'uuid', nullable: true })
  report_id: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'int', nullable: true })
  generation_time_ms: number;

  @Column({ type: 'enum', enum: ReportTrigger })
  triggered_by: ReportTrigger;

  @CreateDateColumn()
  created_at: Date;
}
