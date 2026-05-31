import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BusinessSettingsService } from '../services/business-settings.service';
import { RestaurantSettingsService } from '../services/restaurant-settings.service';
import { MenuSettingsService } from '../services/menu-settings.service';
import { TableSettingsService } from '../services/table-settings.service';
import { OrderStatusService } from '../services/order-status.service';
import { PaymentSettingsService } from '../services/payment-settings.service';
import { UserManagementSettingsService } from '../services/user-management-settings.service';
import { ShiftSettingsService } from '../services/shift-settings.service';
import { NotificationSettingsService } from '../services/notification-settings.service';
import { ReportSettingsService } from '../services/report-settings.service';
import { AppearanceSettingsService } from '../services/appearance-settings.service';
import { SecuritySettingsService } from '../services/security-settings.service';
import { MonitoringSettingsService } from '../services/monitoring-settings.service';
import { IntegrationSettingsService } from '../services/integration-settings.service';
import { UpdateBusinessSettingsDto } from '../dto/update-business-settings.dto';
import { UpdateRestaurantSettingsDto } from '../dto/update-restaurant-settings.dto';
import { UpdateMenuSettingsDto } from '../dto/update-menu-settings.dto';
import { UpdateTableSettingsDto } from '../dto/update-table-settings.dto';
import { UpdateOrderStatusSettingsDto, CreateCustomStatusDto } from '../dto/update-order-status-settings.dto';
import { UpdatePaymentSettingsDto } from '../dto/update-payment-settings.dto';
import { UpdateUserManagementSettingsDto } from '../dto/update-user-management-settings.dto';
import { UpdateShiftSettingsDto } from '../dto/update-shift-settings.dto';
import { UpdateNotificationSettingsDto } from '../dto/update-notification-settings.dto';
import { UpdateReportSettingsDto } from '../dto/update-report-settings.dto';
import { UpdateAppearanceSettingsDto } from '../dto/update-appearance-settings.dto';
import { UpdateSecuritySettingsDto } from '../dto/update-security-settings.dto';
import { UpdateMonitoringSettingsDto } from '../dto/update-monitoring-settings.dto';
import { UpdateIntegrationSettingsDto } from '../dto/update-integration-settings.dto';

@Controller('api/v1/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(
    private businessSettingsService: BusinessSettingsService,
    private restaurantSettingsService: RestaurantSettingsService,
    private menuSettingsService: MenuSettingsService,
    private tableSettingsService: TableSettingsService,
    private orderStatusService: OrderStatusService,
    private paymentSettingsService: PaymentSettingsService,
    private userManagementSettingsService: UserManagementSettingsService,
    private shiftSettingsService: ShiftSettingsService,
    private notificationSettingsService: NotificationSettingsService,
    private reportSettingsService: ReportSettingsService,
    private appearanceSettingsService: AppearanceSettingsService,
    private securitySettingsService: SecuritySettingsService,
    private monitoringSettingsService: MonitoringSettingsService,
    private integrationSettingsService: IntegrationSettingsService,
  ) {}

  // Business Info
  @Get('business-info')
  async getBusinessInfo(@Request() req) {
    return this.businessSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('business-info')
  async updateBusinessInfo(@Request() req, @Body() dto: UpdateBusinessSettingsDto) {
    return this.businessSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Restaurant Config
  @Get('restaurant-config')
  async getRestaurantConfig(@Request() req) {
    return this.restaurantSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('restaurant-config')
  async updateRestaurantConfig(@Request() req, @Body() dto: UpdateRestaurantSettingsDto) {
    return this.restaurantSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Menu Settings
  @Get('menu')
  async getMenuSettings(@Request() req) {
    return this.menuSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('menu')
  async updateMenuSettings(@Request() req, @Body() dto: UpdateMenuSettingsDto) {
    return this.menuSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Table & QR Settings
  @Get('tables-qr')
  async getTableSettings(@Request() req) {
    return this.tableSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('tables-qr')
  async updateTableSettings(@Request() req, @Body() dto: UpdateTableSettingsDto) {
    return this.tableSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Order Workflow
  @Get('order-workflow')
  async getOrderStatusSettings(@Request() req) {
    return this.orderStatusService.getSettings(req.user.restaurantId);
  }

  @Patch('order-workflow')
  async updateOrderStatusSettings(@Request() req, @Body() dto: UpdateOrderStatusSettingsDto) {
    return this.orderStatusService.updateSettings(req.user.restaurantId, dto);
  }

  @Post('order-workflow/statuses')
  async addCustomStatus(@Request() req, @Body() dto: CreateCustomStatusDto) {
    return this.orderStatusService.addCustomStatus(
      req.user.restaurantId,
      dto.name,
      dto.displayColor,
      dto.isTerminal,
    );
  }

  @Delete('order-workflow/statuses/:statusId')
  async deleteCustomStatus(@Request() req, @Param('statusId') statusId: string) {
    await this.orderStatusService.deleteCustomStatus(req.user.restaurantId, statusId);
    return { success: true };
  }

  // Payment Settings
  @Get('payments')
  async getPaymentSettings(@Request() req) {
    return this.paymentSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('payments')
  async updatePaymentSettings(@Request() req, @Body() dto: UpdatePaymentSettingsDto) {
    return this.paymentSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // User Management Settings
  @Get('users')
  async getUserManagementSettings(@Request() req) {
    return this.userManagementSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('users')
  async updateUserManagementSettings(@Request() req, @Body() dto: UpdateUserManagementSettingsDto) {
    return this.userManagementSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Shift Settings
  @Get('shifts')
  async getShiftSettings(@Request() req) {
    return this.shiftSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('shifts')
  async updateShiftSettings(@Request() req, @Body() dto: UpdateShiftSettingsDto) {
    return this.shiftSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Notification Settings
  @Get('notifications')
  async getNotificationSettings(@Request() req) {
    return this.notificationSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('notifications')
  async updateNotificationSettings(@Request() req, @Body() dto: UpdateNotificationSettingsDto) {
    return this.notificationSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Report Settings
  @Get('reports')
  async getReportSettings(@Request() req) {
    return this.reportSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('reports')
  async updateReportSettings(@Request() req, @Body() dto: UpdateReportSettingsDto) {
    return this.reportSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Appearance Settings
  @Get('appearance')
  async getAppearanceSettings(@Request() req) {
    return this.appearanceSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('appearance')
  async updateAppearanceSettings(@Request() req, @Body() dto: UpdateAppearanceSettingsDto) {
    return this.appearanceSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Security Settings
  @Get('security')
  async getSecuritySettings(@Request() req) {
    return this.securitySettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('security')
  async updateSecuritySettings(@Request() req, @Body() dto: UpdateSecuritySettingsDto) {
    return this.securitySettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Monitoring Settings
  @Get('monitoring')
  async getMonitoringSettings(@Request() req) {
    return this.monitoringSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('monitoring')
  async updateMonitoringSettings(@Request() req, @Body() dto: UpdateMonitoringSettingsDto) {
    return this.monitoringSettingsService.updateSettings(req.user.restaurantId, dto);
  }

  // Integration Settings
  @Get('integrations')
  async getIntegrationSettings(@Request() req) {
    return this.integrationSettingsService.getSettings(req.user.restaurantId);
  }

  @Patch('integrations')
  async updateIntegrationSettings(@Request() req, @Body() dto: UpdateIntegrationSettingsDto) {
    return this.integrationSettingsService.updateSettings(req.user.restaurantId, dto);
  }
}
