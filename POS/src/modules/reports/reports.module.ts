import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Order, OrderItem } from '../orders/entities/order.entity';
import { Invoice, Payment } from '../invoices/entities/invoice.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { Category } from '../categories/entities/category.entity';
import { DailyReport } from './entities/daily-report.entity';
import { WeeklyReport } from './entities/weekly-report.entity';
import { MonthlyReport } from './entities/monthly-report.entity';
import { ReportLog } from './entities/report-log.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportGeneratorService } from './report-generator.service';
import { ReportSchedulerService } from './report-scheduler.service';
import { ReportPdfService } from './report-pdf.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Invoice,
      Payment,
      MenuItem,
      Category,
      DailyReport,
      WeeklyReport,
      MonthlyReport,
      ReportLog,
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportGeneratorService,
    ReportSchedulerService,
    ReportPdfService,
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
