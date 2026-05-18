import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getStats() {
    const now = new Date();

    // Today boundaries
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    // Yesterday boundaries
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // Week boundaries (Monday start)
    const weekStart = new Date(todayStart);
    const dayOfWeek = weekStart.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    weekStart.setDate(weekStart.getDate() - diff);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [statCards, revenueChart, categoryBreakdown, mostOrdered, statusSummary] =
      await Promise.all([
        this.getStatCards(todayStart, tomorrowStart, yesterdayStart),
        this.getRevenueChart(weekStart, weekEnd),
        this.getCategoryBreakdown(weekStart, weekEnd),
        this.getMostOrdered(weekStart, weekEnd),
        this.getStatusSummary(),
      ]);

    return {
      stat_cards: statCards,
      revenue_chart: revenueChart,
      category_breakdown: categoryBreakdown,
      most_ordered: mostOrdered,
      status_summary: statusSummary,
      generated_at: now.toISOString(),
    };
  }

  private async getStatCards(
    todayStart: Date,
    tomorrowStart: Date,
    yesterdayStart: Date,
  ) {
    // Orders + revenue for today & yesterday in a single query
    const orderStats = await this.dataSource.query(
      `SELECT
        COUNT(CASE WHEN created_at >= $1 AND created_at < $2 THEN 1 END) AS today_orders,
        COALESCE(SUM(CASE WHEN created_at >= $1 AND created_at < $2 THEN total ELSE 0 END), 0) AS today_revenue,
        COUNT(CASE WHEN created_at >= $3 AND created_at < $1 THEN 1 END) AS yesterday_orders,
        COALESCE(SUM(CASE WHEN created_at >= $3 AND created_at < $1 THEN total ELSE 0 END), 0) AS yesterday_revenue
      FROM orders
      WHERE status IN ('completed', 'refunded')
        AND created_at >= $3 AND created_at < $2`,
      [todayStart, tomorrowStart, yesterdayStart],
    );

    // Items sold for today & yesterday
    const itemStats = await this.dataSource.query(
      `SELECT
        COALESCE(SUM(CASE WHEN o.created_at >= $1 AND o.created_at < $2 THEN oi.quantity ELSE 0 END), 0) AS today_items,
        COALESCE(SUM(CASE WHEN o.created_at >= $3 AND o.created_at < $1 THEN oi.quantity ELSE 0 END), 0) AS yesterday_items
      FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('completed', 'refunded')
        AND oi.is_voided = false
        AND o.created_at >= $3 AND o.created_at < $2`,
      [todayStart, tomorrowStart, yesterdayStart],
    );

    const row = orderStats[0] || {};
    const iRow = itemStats[0] || {};

    const todayOrders = Number(row.today_orders) || 0;
    const todayRevenue = Number(row.today_revenue) || 0;
    const yesterdayOrders = Number(row.yesterday_orders) || 0;
    const yesterdayRevenue = Number(row.yesterday_revenue) || 0;
    const todayItems = Number(iRow.today_items) || 0;
    const yesterdayItems = Number(iRow.yesterday_items) || 0;

    const todayAvg = todayOrders > 0 ? todayRevenue / todayOrders : 0;
    const yesterdayAvg = yesterdayOrders > 0 ? yesterdayRevenue / yesterdayOrders : 0;

    const pct = (curr: number, prev: number) =>
      prev > 0 ? Math.round(((curr - prev) / prev) * 100) : curr > 0 ? 100 : 0;

    return {
      total_revenue: Math.round(todayRevenue * 100) / 100,
      total_orders: todayOrders,
      average_order_value: Math.round(todayAvg * 100) / 100,
      items_sold: todayItems,
      growth: {
        revenue_pct: pct(todayRevenue, yesterdayRevenue),
        orders_pct: pct(todayOrders, yesterdayOrders),
        avg_order_pct: pct(todayAvg, yesterdayAvg),
        items_sold_pct: pct(todayItems, yesterdayItems),
      },
    };
  }

  private async getRevenueChart(weekStart: Date, weekEnd: Date) {
    const rows = await this.dataSource.query(
      `SELECT
        DATE(created_at) AS day_date,
        COALESCE(SUM(total), 0) AS revenue
      FROM orders
      WHERE status IN ('completed', 'refunded')
        AND created_at >= $1 AND created_at < $2
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)`,
      [weekStart, weekEnd],
    );

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const revenueMap = new Map<string, number>();
    for (const r of rows) {
      revenueMap.set(r.day_date.toISOString().split('T')[0], Number(r.revenue) || 0);
    }

    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        day_name: dayNames[i],
        day_date: dateStr,
        revenue: revenueMap.get(dateStr) || 0,
      });
    }
    return result;
  }

  private async getCategoryBreakdown(weekStart: Date, weekEnd: Date) {
    const rows = await this.dataSource.query(
      `SELECT
        c.id AS category_id,
        c.name_en,
        c.name_ar,
        COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS revenue,
        COUNT(DISTINCT o.id) AS order_count
      FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN menu_items mi ON oi.menu_item_id::uuid = mi.id
        JOIN categories c ON mi.category_id = c.id
      WHERE o.status IN ('completed', 'refunded')
        AND oi.is_voided = false
        AND o.created_at >= $1 AND o.created_at < $2
      GROUP BY c.id, c.name_en, c.name_ar
      ORDER BY revenue DESC`,
      [weekStart, weekEnd],
    );

    const totalRevenue = rows.reduce((s: number, r: any) => s + Number(r.revenue), 0);
    return rows.map((r: any) => ({
      category_id: r.category_id,
      name_en: r.name_en,
      name_ar: r.name_ar,
      revenue: Number(r.revenue),
      order_count: Number(r.order_count),
      percentage: totalRevenue > 0 ? Math.round((Number(r.revenue) / totalRevenue) * 100) : 0,
    }));
  }

  private async getMostOrdered(weekStart: Date, weekEnd: Date) {
    const rows = await this.dataSource.query(
      `SELECT
        oi.menu_item_id,
        oi.item_name_en,
        oi.item_name_ar,
        SUM(oi.quantity)::int AS total_quantity,
        COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS total_revenue
      FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('completed', 'refunded')
        AND oi.is_voided = false
        AND o.created_at >= $1 AND o.created_at < $2
      GROUP BY oi.menu_item_id, oi.item_name_en, oi.item_name_ar
      ORDER BY total_quantity DESC
      LIMIT 10`,
      [weekStart, weekEnd],
    );

    const maxQty = rows.length > 0 ? Number(rows[0].total_quantity) : 1;
    return rows.map((r: any) => ({
      menu_item_id: r.menu_item_id,
      name_en: r.item_name_en,
      name_ar: r.item_name_ar,
      quantity: Number(r.total_quantity),
      revenue: Number(r.total_revenue),
      percentage: Math.round((Number(r.total_quantity) / maxQty) * 100),
    }));
  }

  private async getStatusSummary() {
    const rows = await this.dataSource.query(
      `SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status`,
    );

    const summary: Record<string, number> = {
      open: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0,
    };
    for (const r of rows) {
      summary[r.status] = Number(r.count) || 0;
    }
    return summary;
  }
}
