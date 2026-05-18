import { Controller, Get, Post, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import {
  DailyReportQueryDto,
  WeeklyReportQueryDto,
  MonthlyReportQueryDto,
  DateRangeQueryDto,
  YearQueryDto,
  ReportLogQueryDto,
} from './dto/report-query.dto';
import {
  GenerateDailyDto,
  GenerateWeeklyDto,
  GenerateMonthlyDto,
  BulkGenerateDto,
} from './dto/generate-report.dto';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MANAGER, UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // ── Dashboard summary ───────────────────────────────────
  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Quick summary for dashboard widgets' })
  getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  // ── DAILY ───────────────────────────────────────────────
  @Get('daily/latest')
  @ApiOperation({ summary: 'Get latest daily report' })
  getLatestDaily() {
    return this.reportsService.getLatestDailyReport();
  }

  @Get('daily/range')
  @ApiOperation({ summary: 'Get daily reports in date range' })
  getDailyRange(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getDailyRange(query.from, query.to);
  }

  @Get('daily/:id/pdf')
  @ApiOperation({ summary: 'Download daily report as PDF' })
  async downloadDailyPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.reportsService.getDailyPdf(id);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="daily-report-${id}.pdf"` });
    res.send(buffer);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily report for a specific date' })
  getDaily(@Query() query: DailyReportQueryDto) {
    return this.reportsService.getDailyReport(query.date);
  }

  @Post('generate/daily')
  @ApiOperation({ summary: 'Manually generate daily report' })
  generateDaily(@Query() query: GenerateDailyDto) {
    return this.reportsService.triggerDailyGeneration(query.date);
  }

  // ── WEEKLY ──────────────────────────────────────────────
  @Get('weekly/latest')
  @ApiOperation({ summary: 'Get latest weekly report' })
  getLatestWeekly() {
    return this.reportsService.getLatestWeeklyReport();
  }

  @Get('weekly/range')
  @ApiOperation({ summary: 'Get weekly reports in date range' })
  getWeeklyRange(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getWeeklyRange(query.from, query.to);
  }

  @Get('weekly/:id/pdf')
  @ApiOperation({ summary: 'Download weekly report as PDF' })
  async downloadWeeklyPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.reportsService.getWeeklyPdf(id);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="weekly-report-${id}.pdf"` });
    res.send(buffer);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly report for specific week/year' })
  getWeekly(@Query() query: WeeklyReportQueryDto) {
    return this.reportsService.getWeeklyReport(query.week, query.year);
  }

  @Post('generate/weekly')
  @ApiOperation({ summary: 'Manually generate weekly report' })
  generateWeekly(@Query() query: GenerateWeeklyDto) {
    return this.reportsService.triggerWeeklyGeneration(query.week, query.year);
  }

  // ── MONTHLY ─────────────────────────────────────────────
  @Get('monthly/latest')
  @ApiOperation({ summary: 'Get latest monthly report' })
  getLatestMonthly() {
    return this.reportsService.getLatestMonthlyReport();
  }

  @Get('monthly/range')
  @ApiOperation({ summary: 'Get monthly reports for a year' })
  getMonthlyRange(@Query() query: YearQueryDto) {
    return this.reportsService.getMonthlyRange(query.year);
  }

  @Get('monthly/:id/pdf')
  @ApiOperation({ summary: 'Download monthly report as PDF' })
  async downloadMonthlyPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.reportsService.getMonthlyPdf(id);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="monthly-report-${id}.pdf"` });
    res.send(buffer);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly report for specific month/year' })
  getMonthly(@Query() query: MonthlyReportQueryDto) {
    return this.reportsService.getMonthlyReport(query.month, query.year);
  }

  @Post('generate/monthly')
  @ApiOperation({ summary: 'Manually generate monthly report' })
  generateMonthly(@Query() query: GenerateMonthlyDto) {
    return this.reportsService.triggerMonthlyGeneration(query.month, query.year);
  }

  // ── BULK ────────────────────────────────────────────────
  @Post('generate/bulk')
  @ApiOperation({ summary: 'Generate all missing reports for a date range' })
  generateBulk(@Query() query: BulkGenerateDto) {
    return this.reportsService.triggerBulkGeneration(query.from, query.to);
  }

  // ── LOGS ────────────────────────────────────────────────
  @Get('logs')
  @ApiOperation({ summary: 'Get report generation logs' })
  getLogs(@Query() query: ReportLogQueryDto) {
    return this.reportsService.getLogs(query.type, query.limit);
  }
}
