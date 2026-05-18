import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportGeneratorService } from './report-generator.service';
import { ReportTrigger } from './enums/report-type.enum';

@Injectable()
export class ReportSchedulerService {
  private readonly logger = new Logger(ReportSchedulerService.name);

  constructor(private readonly generator: ReportGeneratorService) {}

  @Cron('0 1 * * *') // 1:00 AM every day
  async generateDailyReport() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.logger.log(`Auto-generating daily report for ${yesterday.toISOString().split('T')[0]}`);
    try {
      await this.generator.generateDailyReport(yesterday, ReportTrigger.AUTO);
      this.logger.log('Daily report generated successfully');
    } catch (err) {
      this.logger.error(`Failed to auto-generate daily report: ${err.message}`);
    }
  }

  @Cron('0 2 * * 1') // 2:00 AM every Monday
  async generateWeeklyReport() {
    const lastMonday = new Date();
    lastMonday.setDate(lastMonday.getDate() - 7);
    const week = this.getISOWeekNumber(lastMonday);
    const year = lastMonday.getFullYear();
    this.logger.log(`Auto-generating weekly report for W${week} ${year}`);
    try {
      await this.generator.generateWeeklyReport(week, year, ReportTrigger.AUTO);
      this.logger.log('Weekly report generated successfully');
    } catch (err) {
      this.logger.error(`Failed to auto-generate weekly report: ${err.message}`);
    }
  }

  @Cron('0 3 1 * *') // 3:00 AM on the 1st of every month
  async generateMonthlyReport() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const month = lastMonth.getMonth() + 1;
    const year = lastMonth.getFullYear();
    this.logger.log(`Auto-generating monthly report for ${month}/${year}`);
    try {
      await this.generator.generateMonthlyReport(month, year, ReportTrigger.AUTO);
      this.logger.log('Monthly report generated successfully');
    } catch (err) {
      this.logger.error(`Failed to auto-generate monthly report: ${err.message}`);
    }
  }

  private getISOWeekNumber(d: Date): number {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
