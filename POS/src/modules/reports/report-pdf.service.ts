import { Injectable } from '@nestjs/common';
import { DailyReport } from './entities/daily-report.entity';
import { WeeklyReport } from './entities/weekly-report.entity';
import { MonthlyReport } from './entities/monthly-report.entity';
import PDFDocument = require('pdfkit');

@Injectable()
export class ReportPdfService {

  private createDoc(): PDFKit.PDFDocument {
    return new PDFDocument({ size: 'A4', margin: 50 });
  }

  private drawHeader(doc: PDFKit.PDFDocument, title: string, subtitle: string) {
    doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').fillColor('#666666').text(subtitle, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(8).text(`Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}`, { align: 'center' });
    doc.fillColor('#000000');
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#cccccc');
    doc.moveDown(1);
  }

  private drawKPI(doc: PDFKit.PDFDocument, label: string, value: string) {
    doc.fontSize(9).font('Helvetica').text(label, { continued: true });
    doc.font('Helvetica-Bold').text(`  ${value}`);
    doc.moveDown(0.3);
  }

  private drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: string[][], colWidths: number[]) {
    const startX = 50;
    let y = doc.y;

    // header row
    doc.font('Helvetica-Bold').fontSize(8);
    let x = startX;
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], x, y, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    }
    y += 16;
    doc.moveTo(startX, y).lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y).stroke('#cccccc');
    y += 4;

    // data rows
    doc.font('Helvetica').fontSize(8);
    for (const row of rows) {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
      x = startX;
      for (let i = 0; i < row.length; i++) {
        doc.text(row[i], x, y, { width: colWidths[i], align: 'left' });
        x += colWidths[i];
      }
      y += 14;
    }
    doc.y = y + 8;
  }

  private fmtNum(n: number): string {
    return Math.round(Number(n)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  // ── DAILY PDF ──────────────────────────────────────────

  async generateDailyPdf(report: DailyReport): Promise<Buffer> {
    const doc = this.createDoc();
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));

    this.drawHeader(doc, 'Daily Report', `Date: ${report.report_date}`);

    doc.fontSize(12).font('Helvetica-Bold').text('Key Metrics');
    doc.moveDown(0.5);
    this.drawKPI(doc, 'Total Orders:', String(report.total_orders));
    this.drawKPI(doc, 'Completed:', String(report.completed_orders));
    this.drawKPI(doc, 'Cancelled:', String(report.cancelled_orders));
    this.drawKPI(doc, 'Revenue:', `ILS ${this.fmtNum(report.total_revenue)}`);
    this.drawKPI(doc, 'Net Profit:', `ILS ${this.fmtNum(report.net_profit)}`);
    this.drawKPI(doc, 'Avg Order Value:', `ILS ${this.fmtNum(report.average_order_value)}`);
    doc.moveDown(1);

    // payment breakdown
    const payEntries = Object.entries(report.payment_methods_breakdown || {});
    if (payEntries.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Payment Methods');
      doc.moveDown(0.5);
      for (const [method, amount] of payEntries) {
        this.drawKPI(doc, `${method}:`, `ILS ${this.fmtNum(amount as number)}`);
      }
      doc.moveDown(1);
    }

    // top products
    const products = report.top_selling_products || [];
    if (products.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Top Selling Products');
      doc.moveDown(0.5);
      this.drawTable(doc,
        ['#', 'Product', 'Qty', 'Revenue'],
        products.map((p, i) => [String(i + 1), p.name, String(p.quantity), `ILS ${this.fmtNum(p.revenue)}`]),
        [30, 250, 60, 120],
      );
    }

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));
  }

  // ── WEEKLY PDF ─────────────────────────────────────────

  async generateWeeklyPdf(report: WeeklyReport): Promise<Buffer> {
    const doc = this.createDoc();
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));

    this.drawHeader(doc, 'Weekly Report', `Week ${report.week_number}, ${report.year}  (${report.week_start_date} — ${report.week_end_date})`);

    doc.fontSize(12).font('Helvetica-Bold').text('Key Metrics');
    doc.moveDown(0.5);
    this.drawKPI(doc, 'Total Orders:', `${report.total_orders}  (${report.order_growth_percentage >= 0 ? '+' : ''}${report.order_growth_percentage}%)`);
    this.drawKPI(doc, 'Revenue:', `ILS ${this.fmtNum(report.total_revenue)}  (${report.revenue_growth_percentage >= 0 ? '+' : ''}${report.revenue_growth_percentage}%)`);
    this.drawKPI(doc, 'Net Profit:', `ILS ${this.fmtNum(report.net_profit)}`);
    this.drawKPI(doc, 'Avg Order Value:', `ILS ${this.fmtNum(report.average_order_value)}`);
    this.drawKPI(doc, 'Busiest Day:', report.busiest_day || '—');
    doc.moveDown(1);

    // daily breakdown
    const daily = report.daily_breakdown || [];
    if (daily.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Daily Breakdown');
      doc.moveDown(0.5);
      this.drawTable(doc,
        ['Date', 'Orders', 'Revenue', 'Profit'],
        daily.map(d => [d.date, String(d.orders), `ILS ${this.fmtNum(d.revenue)}`, `ILS ${this.fmtNum(d.profit)}`]),
        [120, 80, 140, 140],
      );
    }

    // top products
    const products = report.top_selling_products || [];
    if (products.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Top Selling Products');
      doc.moveDown(0.5);
      this.drawTable(doc,
        ['#', 'Product', 'Qty', 'Revenue'],
        products.map((p, i) => [String(i + 1), p.name, String(p.quantity), `ILS ${this.fmtNum(p.revenue)}`]),
        [30, 250, 60, 120],
      );
    }

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));
  }

  // ── MONTHLY PDF ────────────────────────────────────────

  async generateMonthlyPdf(report: MonthlyReport): Promise<Buffer> {
    const doc = this.createDoc();
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));

    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.drawHeader(doc, 'Monthly Report', `${monthNames[report.month]} ${report.year}  (${report.month_start_date} — ${report.month_end_date})`);

    doc.fontSize(12).font('Helvetica-Bold').text('Key Metrics');
    doc.moveDown(0.5);
    this.drawKPI(doc, 'Total Orders:', `${report.total_orders}  (${report.order_growth_percentage >= 0 ? '+' : ''}${report.order_growth_percentage}%)`);
    this.drawKPI(doc, 'Revenue:', `ILS ${this.fmtNum(report.total_revenue)}  (${report.revenue_growth_percentage >= 0 ? '+' : ''}${report.revenue_growth_percentage}%)`);
    this.drawKPI(doc, 'Net Profit:', `ILS ${this.fmtNum(report.net_profit)}`);
    this.drawKPI(doc, 'Profit Margin:', `${report.profit_margin_percentage}%`);
    this.drawKPI(doc, 'Avg Order Value:', `ILS ${this.fmtNum(report.average_order_value)}`);
    this.drawKPI(doc, 'Busiest Day:', report.busiest_day || '—');
    this.drawKPI(doc, 'Slowest Day:', report.slowest_day || '—');
    doc.moveDown(1);

    // weekly breakdown
    const weekly = report.weekly_breakdown || [];
    if (weekly.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Weekly Breakdown');
      doc.moveDown(0.5);
      this.drawTable(doc,
        ['Week', 'Orders', 'Revenue', 'Profit'],
        weekly.map(w => [`W${w.week_number}`, String(w.orders), `ILS ${this.fmtNum(w.revenue)}`, `ILS ${this.fmtNum(w.profit)}`]),
        [80, 80, 160, 160],
      );
    }

    // top products
    const products = report.top_selling_products || [];
    if (products.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Top Selling Products');
      doc.moveDown(0.5);
      this.drawTable(doc,
        ['#', 'Product', 'Qty', 'Revenue'],
        products.map((p, i) => [String(i + 1), p.name, String(p.quantity), `ILS ${this.fmtNum(p.revenue)}`]),
        [30, 250, 60, 120],
      );
    }

    // worst products
    const worst = report.worst_selling_products || [];
    if (worst.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Worst Selling Products');
      doc.moveDown(0.5);
      this.drawTable(doc,
        ['#', 'Product', 'Qty', 'Revenue'],
        worst.map((p, i) => [String(i + 1), p.name, String(p.quantity), `ILS ${this.fmtNum(p.revenue)}`]),
        [30, 250, 60, 120],
      );
    }

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));
  }
}
