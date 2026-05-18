import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Order, OrderItem } from '../orders/entities/order.entity';
import { Invoice, Payment } from '../invoices/entities/invoice.entity';
import { DailyReport } from './entities/daily-report.entity';
import { WeeklyReport } from './entities/weekly-report.entity';
import { MonthlyReport } from './entities/monthly-report.entity';
import { ReportLog } from './entities/report-log.entity';
import { ReportType, ReportStatus, ReportTrigger } from './enums/report-type.enum';
import { OrderStatus } from '../../common/enums/order.enum';

@Injectable()
export class ReportGeneratorService {
  private readonly logger = new Logger(ReportGeneratorService.name);

  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(Invoice)
    private invoicesRepo: Repository<Invoice>,
    @InjectRepository(Payment)
    private paymentsRepo: Repository<Payment>,
    @InjectRepository(DailyReport)
    private dailyRepo: Repository<DailyReport>,
    @InjectRepository(WeeklyReport)
    private weeklyRepo: Repository<WeeklyReport>,
    @InjectRepository(MonthlyReport)
    private monthlyRepo: Repository<MonthlyReport>,
    @InjectRepository(ReportLog)
    private logRepo: Repository<ReportLog>,
  ) {}

  // ── helpers ──────────────────────────────────────────────────────

  private dateStr(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  private startOfDay(d: Date): Date {
    const r = new Date(d);
    r.setHours(0, 0, 0, 0);
    return r;
  }

  private endOfDay(d: Date): Date {
    const r = new Date(d);
    r.setHours(23, 59, 59, 999);
    return r;
  }

  private pctChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  }

  private getISOWeekNumber(d: Date): number {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  private getWeekStartDate(week: number, year: number): Date {
    const jan4 = new Date(year, 0, 4);
    const dow = jan4.getDay() || 7;
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - dow + 1 + (week - 1) * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  private async logGeneration(
    type: ReportType,
    trigger: ReportTrigger,
    fn: () => Promise<{ id: string }>,
  ): Promise<any> {
    const log = this.logRepo.create({
      report_type: type,
      triggered_by: trigger,
      status: ReportStatus.GENERATING,
    });
    await this.logRepo.save(log);
    const start = Date.now();

    try {
      const result = await fn();
      log.status = ReportStatus.COMPLETED;
      log.report_id = result.id;
      log.generation_time_ms = Date.now() - start;
      await this.logRepo.save(log);
      return result;
    } catch (err) {
      log.status = ReportStatus.FAILED;
      log.error_message = err.message;
      log.generation_time_ms = Date.now() - start;
      await this.logRepo.save(log);
      throw err;
    }
  }

  private async fetchOrders(from: Date, to: Date): Promise<Order[]> {
    return this.ordersRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'item')
      .where('o.created_at >= :from', { from })
      .andWhere('o.created_at <= :to', { to })
      .getMany();
  }

  private async fetchPayments(from: Date, to: Date): Promise<Payment[]> {
    return this.paymentsRepo
      .createQueryBuilder('p')
      .where('p.received_at >= :from', { from })
      .andWhere('p.received_at <= :to', { to })
      .getMany();
  }

  private computeOrderMetrics(orders: Order[]) {
    const total = orders.length;
    const completed = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
    const cancelled = orders.filter(o => o.status === OrderStatus.CANCELLED).length;
    const pending = orders.filter(o =>
      [OrderStatus.OPEN, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY].includes(o.status as OrderStatus),
    ).length;

    const completedOrders = orders.filter(o =>
      o.status === OrderStatus.COMPLETED || o.status === OrderStatus.REFUNDED,
    );
    const revenue = completedOrders.reduce((s, o) => s + Number(o.total), 0);
    const avg = completedOrders.length > 0 ? revenue / completedOrders.length : 0;

    return { total, completed, cancelled, pending, revenue, avg, completedOrders };
  }

  private computeTopProducts(orders: Order[], limit = 10) {
    const map: Record<string, { productId: string; name: string; quantity: number; revenue: number }> = {};
    for (const o of orders) {
      for (const item of o.items || []) {
        if (item.is_voided) continue;
        const key = item.menu_item_id;
        if (!map[key]) {
          map[key] = { productId: key, name: item.item_name_en, quantity: 0, revenue: 0 };
        }
        map[key].quantity += item.quantity;
        map[key].revenue += Number(item.subtotal);
      }
    }
    const sorted = Object.values(map).sort((a, b) => b.quantity - a.quantity);
    return { top: sorted.slice(0, limit), bottom: sorted.slice(-limit).reverse(), all: sorted };
  }

  private computePaymentBreakdown(payments: Payment[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    for (const p of payments) {
      breakdown[p.method] = (breakdown[p.method] || 0) + Number(p.amount);
    }
    return breakdown;
  }

  private computeCustomerStats(orders: Order[]) {
    const names = new Set<string>();
    let newC = 0;
    for (const o of orders) {
      const n = (o.customer_name || '').trim().toLowerCase();
      if (!n) continue;
      if (!names.has(n)) {
        names.add(n);
        newC++;
      }
    }
    return { new_customers: newC, returning_customers: Math.max(0, orders.length - newC), total_unique: names.size };
  }

  // ── DAILY ────────────────────────────────────────────────────────

  async generateDailyReport(date: Date, trigger: ReportTrigger = ReportTrigger.MANUAL): Promise<DailyReport> {
    return this.logGeneration(ReportType.DAILY, trigger, async () => {
      const from = this.startOfDay(date);
      const to = this.endOfDay(date);
      const dateKey = this.dateStr(date);

      const orders = await this.fetchOrders(from, to);
      const payments = await this.fetchPayments(from, to);
      const metrics = this.computeOrderMetrics(orders);
      const products = this.computeTopProducts(metrics.completedOrders);
      const payBreak = this.computePaymentBreakdown(payments);
      const custStats = this.computeCustomerStats(orders);

      // hourly distribution
      const hourly: { hour: number; orders_count: number; revenue: number }[] = [];
      for (let h = 0; h < 24; h++) hourly.push({ hour: h, orders_count: 0, revenue: 0 });
      for (const o of metrics.completedOrders) {
        const h = new Date(o.created_at).getHours();
        hourly[h].orders_count++;
        hourly[h].revenue += Number(o.total);
      }

      const grossProfit = metrics.revenue * 0.65;
      const netProfit = metrics.revenue * 0.45;

      const data: Partial<DailyReport> = {
        report_date: dateKey,
        total_orders: metrics.total,
        completed_orders: metrics.completed,
        cancelled_orders: metrics.cancelled,
        pending_orders: metrics.pending,
        new_customers: custStats.new_customers,
        returning_customers: custStats.returning_customers,
        total_revenue: Number(metrics.revenue.toFixed(2)),
        total_cost: Number((metrics.revenue * 0.35).toFixed(2)),
        gross_profit: Number(grossProfit.toFixed(2)),
        net_profit: Number(netProfit.toFixed(2)),
        average_order_value: Number(metrics.avg.toFixed(2)),
        top_selling_products: products.top,
        payment_methods_breakdown: payBreak,
        hourly_distribution: hourly,
      };

      let report = await this.dailyRepo.findOne({ where: { report_date: dateKey } });
      if (report) {
        Object.assign(report, data);
      } else {
        report = this.dailyRepo.create(data);
      }
      return this.dailyRepo.save(report);
    });
  }

  // ── WEEKLY ───────────────────────────────────────────────────────

  async generateWeeklyReport(week: number, year: number, trigger: ReportTrigger = ReportTrigger.MANUAL): Promise<WeeklyReport> {
    return this.logGeneration(ReportType.WEEKLY, trigger, async () => {
      const startDate = this.getWeekStartDate(week, year);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      const from = this.startOfDay(startDate);
      const to = this.endOfDay(endDate);

      const orders = await this.fetchOrders(from, to);
      const payments = await this.fetchPayments(from, to);
      const metrics = this.computeOrderMetrics(orders);
      const products = this.computeTopProducts(metrics.completedOrders);
      const payBreak = this.computePaymentBreakdown(payments);

      // daily breakdown (7 days)
      const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const daily: { date: string; orders: number; revenue: number; profit: number }[] = [];
      let busiestIdx = 0;
      let busiestCount = 0;

      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dayFrom = this.startOfDay(d);
        const dayTo = this.endOfDay(d);
        const dayOrders = orders.filter(o => {
          const t = new Date(o.created_at).getTime();
          return t >= dayFrom.getTime() && t <= dayTo.getTime();
        });
        const dayCompleted = dayOrders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.REFUNDED);
        const dayRev = dayCompleted.reduce((s, o) => s + Number(o.total), 0);
        daily.push({ date: this.dateStr(d), orders: dayOrders.length, revenue: Number(dayRev.toFixed(2)), profit: Number((dayRev * 0.45).toFixed(2)) });
        if (dayOrders.length > busiestCount) {
          busiestCount = dayOrders.length;
          busiestIdx = i;
        }
      }

      // growth vs previous week
      const prevStart = new Date(startDate);
      prevStart.setDate(prevStart.getDate() - 7);
      const prevEnd = new Date(prevStart);
      prevEnd.setDate(prevEnd.getDate() + 6);
      const prevOrders = await this.fetchOrders(this.startOfDay(prevStart), this.endOfDay(prevEnd));
      const prevMetrics = this.computeOrderMetrics(prevOrders);

      const grossProfit = metrics.revenue * 0.65;
      const netProfit = metrics.revenue * 0.45;

      const data: Partial<WeeklyReport> = {
        week_number: week,
        year,
        week_start_date: this.dateStr(startDate),
        week_end_date: this.dateStr(endDate),
        total_orders: metrics.total,
        completed_orders: metrics.completed,
        cancelled_orders: metrics.cancelled,
        total_revenue: Number(metrics.revenue.toFixed(2)),
        total_cost: Number((metrics.revenue * 0.35).toFixed(2)),
        gross_profit: Number(grossProfit.toFixed(2)),
        net_profit: Number(netProfit.toFixed(2)),
        average_order_value: Number(metrics.avg.toFixed(2)),
        order_growth_percentage: this.pctChange(metrics.total, prevMetrics.total),
        revenue_growth_percentage: this.pctChange(metrics.revenue, prevMetrics.revenue),
        daily_breakdown: daily,
        top_selling_products: products.top,
        payment_methods_breakdown: payBreak,
        busiest_day: DAY_NAMES[busiestIdx],
      };

      let report = await this.weeklyRepo.findOne({ where: { week_number: week, year } });
      if (report) {
        Object.assign(report, data);
      } else {
        report = this.weeklyRepo.create(data);
      }
      return this.weeklyRepo.save(report);
    });
  }

  // ── MONTHLY ──────────────────────────────────────────────────────

  async generateMonthlyReport(month: number, year: number, trigger: ReportTrigger = ReportTrigger.MANUAL): Promise<MonthlyReport> {
    return this.logGeneration(ReportType.MONTHLY, trigger, async () => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // last day of month
      const from = this.startOfDay(startDate);
      const to = this.endOfDay(endDate);

      const orders = await this.fetchOrders(from, to);
      const payments = await this.fetchPayments(from, to);
      const metrics = this.computeOrderMetrics(orders);
      const products = this.computeTopProducts(metrics.completedOrders, 10);
      const payBreak = this.computePaymentBreakdown(payments);
      const custStats = this.computeCustomerStats(orders);

      // daily breakdown
      const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayCounts: Record<string, number> = {};
      const dailyBreak: { date: string; orders: number; revenue: number; profit: number }[] = [];

      const daysInMonth = endDate.getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const day = new Date(year, month - 1, d);
        const dayFrom = this.startOfDay(day);
        const dayTo = this.endOfDay(day);
        const dayOrders = orders.filter(o => {
          const t = new Date(o.created_at).getTime();
          return t >= dayFrom.getTime() && t <= dayTo.getTime();
        });
        const dayCompleted = dayOrders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.REFUNDED);
        const dayRev = dayCompleted.reduce((s, o) => s + Number(o.total), 0);
        dailyBreak.push({ date: this.dateStr(day), orders: dayOrders.length, revenue: Number(dayRev.toFixed(2)), profit: Number((dayRev * 0.45).toFixed(2)) });

        const dayName = DAY_NAMES[day.getDay()];
        dayCounts[dayName] = (dayCounts[dayName] || 0) + dayOrders.length;
      }

      // busiest / slowest day of week
      const dayEntries = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
      const busiest = dayEntries[0]?.[0] || '';
      const slowest = dayEntries[dayEntries.length - 1]?.[0] || '';

      // weekly breakdown
      const weeklyBreak: { week_number: number; orders: number; revenue: number; profit: number }[] = [];
      const weekMap = new Map<number, { orders: number; revenue: number; profit: number }>();
      for (const entry of dailyBreak) {
        const wk = this.getISOWeekNumber(new Date(entry.date));
        const existing = weekMap.get(wk) || { orders: 0, revenue: 0, profit: 0 };
        existing.orders += entry.orders;
        existing.revenue += entry.revenue;
        existing.profit += entry.profit;
        weekMap.set(wk, existing);
      }
      for (const [wk, vals] of weekMap) {
        weeklyBreak.push({ week_number: wk, ...vals });
      }
      weeklyBreak.sort((a, b) => a.week_number - b.week_number);

      // growth vs previous month
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const prevStart = new Date(prevYear, prevMonth - 1, 1);
      const prevEnd = new Date(prevYear, prevMonth, 0);
      const prevOrders = await this.fetchOrders(this.startOfDay(prevStart), this.endOfDay(prevEnd));
      const prevMetrics = this.computeOrderMetrics(prevOrders);

      const grossProfit = metrics.revenue * 0.65;
      const netProfit = metrics.revenue * 0.45;
      const profitMargin = metrics.revenue > 0 ? (netProfit / metrics.revenue) * 100 : 0;

      const data: Partial<MonthlyReport> = {
        month,
        year,
        month_start_date: this.dateStr(startDate),
        month_end_date: this.dateStr(endDate),
        total_orders: metrics.total,
        completed_orders: metrics.completed,
        cancelled_orders: metrics.cancelled,
        total_revenue: Number(metrics.revenue.toFixed(2)),
        total_cost: Number((metrics.revenue * 0.35).toFixed(2)),
        gross_profit: Number(grossProfit.toFixed(2)),
        net_profit: Number(netProfit.toFixed(2)),
        profit_margin_percentage: Number(profitMargin.toFixed(2)),
        average_order_value: Number(metrics.avg.toFixed(2)),
        order_growth_percentage: this.pctChange(metrics.total, prevMetrics.total),
        revenue_growth_percentage: this.pctChange(metrics.revenue, prevMetrics.revenue),
        weekly_breakdown: weeklyBreak,
        daily_breakdown: dailyBreak,
        top_selling_products: products.top,
        worst_selling_products: products.bottom,
        payment_methods_breakdown: payBreak,
        customer_stats: custStats,
        busiest_day: busiest,
        slowest_day: slowest,
      };

      let report = await this.monthlyRepo.findOne({ where: { month, year } });
      if (report) {
        Object.assign(report, data);
      } else {
        report = this.monthlyRepo.create(data);
      }
      return this.monthlyRepo.save(report);
    });
  }
}
