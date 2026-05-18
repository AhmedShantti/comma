import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { DailyReport } from './entities/daily-report.entity';
import { WeeklyReport } from './entities/weekly-report.entity';
import { MonthlyReport } from './entities/monthly-report.entity';
import { ReportLog } from './entities/report-log.entity';
import { ReportGeneratorService } from './report-generator.service';
import { ReportPdfService } from './report-pdf.service';
import { ReportType, ReportTrigger } from './enums/report-type.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(DailyReport)
    private dailyRepo: Repository<DailyReport>,
    @InjectRepository(WeeklyReport)
    private weeklyRepo: Repository<WeeklyReport>,
    @InjectRepository(MonthlyReport)
    private monthlyRepo: Repository<MonthlyReport>,
    @InjectRepository(ReportLog)
    private logRepo: Repository<ReportLog>,
    private readonly generator: ReportGeneratorService,
    private readonly pdf: ReportPdfService,
  ) {}

  // ── Dashboard ───────────────────────────────────────────

  async getDashboardSummary() {
    const latestDaily = await this.dailyRepo.findOne({ where: {}, order: { report_date: 'DESC' } });
    const latestWeekly = await this.weeklyRepo.findOne({ where: {}, order: { year: 'DESC', week_number: 'DESC' } });
    const latestMonthly = await this.monthlyRepo.findOne({ where: {}, order: { year: 'DESC', month: 'DESC' } });

    return {
      daily: latestDaily
        ? {
            date: latestDaily.report_date,
            total_orders: latestDaily.total_orders,
            total_revenue: latestDaily.total_revenue,
            net_profit: latestDaily.net_profit,
            average_order_value: latestDaily.average_order_value,
          }
        : null,
      weekly: latestWeekly
        ? {
            week: latestWeekly.week_number,
            year: latestWeekly.year,
            total_orders: latestWeekly.total_orders,
            total_revenue: latestWeekly.total_revenue,
            net_profit: latestWeekly.net_profit,
            order_growth_percentage: latestWeekly.order_growth_percentage,
            revenue_growth_percentage: latestWeekly.revenue_growth_percentage,
          }
        : null,
      monthly: latestMonthly
        ? {
            month: latestMonthly.month,
            year: latestMonthly.year,
            total_orders: latestMonthly.total_orders,
            total_revenue: latestMonthly.total_revenue,
            net_profit: latestMonthly.net_profit,
            profit_margin_percentage: latestMonthly.profit_margin_percentage,
            order_growth_percentage: latestMonthly.order_growth_percentage,
            revenue_growth_percentage: latestMonthly.revenue_growth_percentage,
          }
        : null,
    };
  }

  // ── DAILY ───────────────────────────────────────────────

  async getLatestDailyReport(): Promise<DailyReport> {
    const report = await this.dailyRepo.findOne({ where: {}, order: { report_date: 'DESC' } });
    if (!report) throw new NotFoundException('No daily reports found');
    return report;
  }

  async getDailyReport(date?: string): Promise<DailyReport> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const report = await this.dailyRepo.findOne({ where: { report_date: targetDate } });
    if (!report) throw new NotFoundException(`No daily report for ${targetDate}`);
    return report;
  }

  async getDailyRange(from?: string, to?: string): Promise<DailyReport[]> {
    const now = new Date();
    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 30);

    const where: any = {};
    if (from) where.report_date = MoreThanOrEqual(from);
    if (to) {
      where.report_date = from
        ? Between(from, to)
        : LessThanOrEqual(to);
    }
    if (!from && !to) {
      where.report_date = MoreThanOrEqual(defaultFrom.toISOString().split('T')[0]);
    }

    return this.dailyRepo.find({ where, order: { report_date: 'DESC' } });
  }

  async getDailyPdf(id: string): Promise<Buffer> {
    const report = await this.dailyRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Daily report not found');
    return this.pdf.generateDailyPdf(report);
  }

  async triggerDailyGeneration(date?: string): Promise<DailyReport> {
    const target = date ? new Date(date) : new Date();
    return this.generator.generateDailyReport(target, ReportTrigger.MANUAL);
  }

  // ── WEEKLY ──────────────────────────────────────────────

  async getLatestWeeklyReport(): Promise<WeeklyReport> {
    const report = await this.weeklyRepo.findOne({ where: {}, order: { year: 'DESC', week_number: 'DESC' } });
    if (!report) throw new NotFoundException('No weekly reports found');
    return report;
  }

  async getWeeklyReport(week?: number, year?: number): Promise<WeeklyReport> {
    const now = new Date();
    const targetWeek = week || this.getISOWeekNumber(now);
    const targetYear = year || now.getFullYear();
    const report = await this.weeklyRepo.findOne({ where: { week_number: targetWeek, year: targetYear } });
    if (!report) throw new NotFoundException(`No weekly report for W${targetWeek} ${targetYear}`);
    return report;
  }

  async getWeeklyRange(from?: string, to?: string): Promise<WeeklyReport[]> {
    const now = new Date();
    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 90);

    const where: any = {};
    if (from) where.week_start_date = MoreThanOrEqual(from);
    if (to) {
      where.week_start_date = from
        ? Between(from, to)
        : LessThanOrEqual(to);
    }
    if (!from && !to) {
      where.week_start_date = MoreThanOrEqual(defaultFrom.toISOString().split('T')[0]);
    }

    return this.weeklyRepo.find({ where, order: { year: 'DESC', week_number: 'DESC' } });
  }

  async getWeeklyPdf(id: string): Promise<Buffer> {
    const report = await this.weeklyRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Weekly report not found');
    return this.pdf.generateWeeklyPdf(report);
  }

  async triggerWeeklyGeneration(week?: number, year?: number): Promise<WeeklyReport> {
    const now = new Date();
    const targetWeek = week || this.getISOWeekNumber(now);
    const targetYear = year || now.getFullYear();
    return this.generator.generateWeeklyReport(targetWeek, targetYear, ReportTrigger.MANUAL);
  }

  // ── MONTHLY ─────────────────────────────────────────────

  async getLatestMonthlyReport(): Promise<MonthlyReport> {
    const report = await this.monthlyRepo.findOne({ where: {}, order: { year: 'DESC', month: 'DESC' } });
    if (!report) throw new NotFoundException('No monthly reports found');
    return report;
  }

  async getMonthlyReport(month?: number, year?: number): Promise<MonthlyReport> {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();
    const report = await this.monthlyRepo.findOne({ where: { month: targetMonth, year: targetYear } });
    if (!report) throw new NotFoundException(`No monthly report for ${targetMonth}/${targetYear}`);
    return report;
  }

  async getMonthlyRange(year?: number): Promise<MonthlyReport[]> {
    const targetYear = year || new Date().getFullYear();
    return this.monthlyRepo.find({
      where: { year: targetYear },
      order: { month: 'ASC' },
    });
  }

  async getMonthlyPdf(id: string): Promise<Buffer> {
    const report = await this.monthlyRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Monthly report not found');
    return this.pdf.generateMonthlyPdf(report);
  }

  async triggerMonthlyGeneration(month?: number, year?: number): Promise<MonthlyReport> {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();
    return this.generator.generateMonthlyReport(targetMonth, targetYear, ReportTrigger.MANUAL);
  }

  // ── BULK ────────────────────────────────────────────────

  async triggerBulkGeneration(from?: string, to?: string) {
    const now = new Date();
    const startDate = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = to ? new Date(to) : now;

    const results = { daily: 0, weekly: 0, monthly: 0, errors: [] as string[] };

    // generate daily reports for each day in range
    const current = new Date(startDate);
    while (current <= endDate) {
      try {
        await this.generator.generateDailyReport(new Date(current), ReportTrigger.MANUAL);
        results.daily++;
      } catch (err) {
        results.errors.push(`Daily ${current.toISOString().split('T')[0]}: ${err.message}`);
      }
      current.setDate(current.getDate() + 1);
    }

    // generate weekly reports for weeks in range
    const weeks = new Set<string>();
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const wk = this.getISOWeekNumber(cursor);
      const yr = cursor.getFullYear();
      const key = `${yr}-${wk}`;
      if (!weeks.has(key)) {
        weeks.add(key);
        try {
          await this.generator.generateWeeklyReport(wk, yr, ReportTrigger.MANUAL);
          results.weekly++;
        } catch (err) {
          results.errors.push(`Weekly W${wk} ${yr}: ${err.message}`);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    // generate monthly reports for months in range
    const months = new Set<string>();
    const mCursor = new Date(startDate);
    while (mCursor <= endDate) {
      const m = mCursor.getMonth() + 1;
      const y = mCursor.getFullYear();
      const key = `${y}-${m}`;
      if (!months.has(key)) {
        months.add(key);
        try {
          await this.generator.generateMonthlyReport(m, y, ReportTrigger.MANUAL);
          results.monthly++;
        } catch (err) {
          results.errors.push(`Monthly ${m}/${y}: ${err.message}`);
        }
      }
      mCursor.setMonth(mCursor.getMonth() + 1);
    }

    return results;
  }

  // ── LOGS ────────────────────────────────────────────────

  async getLogs(type?: string, limit?: number): Promise<ReportLog[]> {
    const where: any = {};
    if (type) where.report_type = type;
    return this.logRepo.find({
      where,
      order: { created_at: 'DESC' },
      take: limit || 50,
    });
  }

  // ── helpers ─────────────────────────────────────────────

  private getISOWeekNumber(d: Date): number {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
