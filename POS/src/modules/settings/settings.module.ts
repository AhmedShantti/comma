import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { BusinessSettings } from './entities/business-settings.entity';
import { RestaurantSettings } from './entities/restaurant-settings.entity';
import { MenuSettings } from './entities/menu-settings.entity';
import { TableSettings } from './entities/table-settings.entity';
import { OrderStatusSettings } from './entities/order-status-settings.entity';
import { PaymentSettings } from './entities/payment-settings.entity';
import { UserManagementSettings } from './entities/user-management-settings.entity';
import { ShiftSettings } from './entities/shift-settings.entity';
import { NotificationSettings } from './entities/notification-settings.entity';
import { ReportSettings } from './entities/report-settings.entity';
import { AppearanceSettings } from './entities/appearance-settings.entity';
import { SecuritySettings } from './entities/security-settings.entity';
import { MonitoringSettings } from './entities/monitoring-settings.entity';
import { IntegrationSettings } from './entities/integration-settings.entity';
import { ReceiptSettings } from './entities/receipt-settings.entity';
import { SettingsService } from './settings.service';
import { SettingsController } from './controllers/settings.controller';
import { BusinessSettingsService } from './services/business-settings.service';
import { RestaurantSettingsService } from './services/restaurant-settings.service';
import { MenuSettingsService } from './services/menu-settings.service';
import { TableSettingsService } from './services/table-settings.service';
import { OrderStatusService } from './services/order-status.service';
import { PaymentSettingsService } from './services/payment-settings.service';
import { UserManagementSettingsService } from './services/user-management-settings.service';
import { ShiftSettingsService } from './services/shift-settings.service';
import { NotificationSettingsService } from './services/notification-settings.service';
import { ReportSettingsService } from './services/report-settings.service';
import { AppearanceSettingsService } from './services/appearance-settings.service';
import { SecuritySettingsService } from './services/security-settings.service';
import { MonitoringSettingsService } from './services/monitoring-settings.service';
import { IntegrationSettingsService } from './services/integration-settings.service';
import { ReceiptSettingsService } from './services/receipt-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Setting,
    BusinessSettings,
    RestaurantSettings,
    MenuSettings,
    TableSettings,
    OrderStatusSettings,
    PaymentSettings,
    UserManagementSettings,
    ShiftSettings,
    NotificationSettings,
    ReportSettings,
    AppearanceSettings,
    SecuritySettings,
    MonitoringSettings,
    IntegrationSettings,
    ReceiptSettings,
  ])],
  controllers: [SettingsController],
  providers: [
    SettingsService,
    BusinessSettingsService,
    RestaurantSettingsService,
    MenuSettingsService,
    TableSettingsService,
    OrderStatusService,
    PaymentSettingsService,
    UserManagementSettingsService,
    ShiftSettingsService,
    NotificationSettingsService,
    ReportSettingsService,
    AppearanceSettingsService,
    SecuritySettingsService,
    MonitoringSettingsService,
    IntegrationSettingsService,
    ReceiptSettingsService,
  ],
  exports: [
    SettingsService,
    BusinessSettingsService,
    RestaurantSettingsService,
    MenuSettingsService,
    TableSettingsService,
    OrderStatusService,
    PaymentSettingsService,
    UserManagementSettingsService,
    ShiftSettingsService,
    NotificationSettingsService,
    ReportSettingsService,
    AppearanceSettingsService,
    SecuritySettingsService,
    MonitoringSettingsService,
    IntegrationSettingsService,
    ReceiptSettingsService,
  ],
})
export class SettingsModule {}
