'use client';

import { useState } from 'react';
import { useSettings } from '@/app/admin/settings/hooks/useSettings';
import { BusinessInfoSection } from '@/app/admin/settings/components/sections/BusinessInfoSection';
import { RestaurantConfigSection } from '@/app/admin/settings/components/sections/RestaurantConfigSection';
import { MenuSettingsSection } from '@/app/admin/settings/components/sections/MenuSettingsSection';
import { TableQRSection } from '@/app/admin/settings/components/sections/TableQRSection';
import { OrderWorkflowSection } from '@/app/admin/settings/components/sections/OrderWorkflowSection';
import { PaymentSettingsSection } from '@/app/admin/settings/components/sections/PaymentSettingsSection';
import { UserManagementSettingsSection } from '@/app/admin/settings/components/sections/UserManagementSettingsSection';
import { ShiftSettingsSection } from '@/app/admin/settings/components/sections/ShiftSettingsSection';
import { NotificationSettingsSection } from '@/app/admin/settings/components/sections/NotificationSettingsSection';
import { ReportSettingsSection } from '@/app/admin/settings/components/sections/ReportSettingsSection';
import { AppearanceSettingsSection } from '@/app/admin/settings/components/sections/AppearanceSettingsSection';
import { SecuritySettingsSection } from '@/app/admin/settings/components/sections/SecuritySettingsSection';
import { MonitoringSettingsSection } from '@/app/admin/settings/components/sections/MonitoringSettingsSection';
import { IntegrationSettingsSection } from '@/app/admin/settings/components/sections/IntegrationSettingsSection';
import { ReceiptSettingsSection } from '@/app/admin/settings/components/sections/ReceiptSettingsSection';

const SECTIONS = [
  { id: 'business-info', label: '🏢 Business Information', component: BusinessInfoSection },
  { id: 'restaurant-config', label: '🍽️ Restaurant Configuration', component: RestaurantConfigSection },
  { id: 'menu', label: '📋 Menu Settings', component: MenuSettingsSection },
  { id: 'tables-qr', label: '🪑 Tables & QR Codes', component: TableQRSection },
  { id: 'order-workflow', label: '📊 Order Workflow', component: OrderWorkflowSection },
  { id: 'payments', label: '💳 Payment Settings', component: PaymentSettingsSection },
  { id: 'receipt', label: '🧾 Receipt Settings', component: ReceiptSettingsSection },
  { id: 'users', label: '👥 User Management', component: UserManagementSettingsSection },
  { id: 'shifts', label: '⏰ Shift Rules', component: ShiftSettingsSection },
  { id: 'notifications', label: '🔔 Notifications', component: NotificationSettingsSection },
  { id: 'reports', label: '📈 Reports', component: ReportSettingsSection },
  { id: 'appearance', label: '🎨 Appearance', component: AppearanceSettingsSection },
  { id: 'security', label: '🔒 Security', component: SecuritySettingsSection },
  { id: 'monitoring', label: '📡 Monitoring', component: MonitoringSettingsSection },
  { id: 'integrations', label: '🔗 Integrations', component: IntegrationSettingsSection },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('business-info');
  const { settings, loading, error, updateSettings } = useSettings();

  const section = SECTIONS.find(s => s.id === activeSection);
  const SectionComponent = section?.component || BusinessInfoSection;

  return (
    <div className="settings-container">
      <div className="settings-layout">
        {/* Sidebar Navigation */}
        <aside className="settings-sidebar">
          <div className="sidebar-header">
            <h3>Settings</h3>
          </div>
          <nav className="sidebar-nav">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`nav-item ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="settings-main">
          {loading ? (
            <div className="loading-state">
              <p>Loading settings...</p>
            </div>
          ) : (
            <SectionComponent
              settings={settings[activeSection] || {}}
              onSave={(data: any) => updateSettings(activeSection, data)}
              error={error}
            />
          )}
        </main>
      </div>

      <style jsx>{`
        .settings-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .settings-layout {
          display: flex;
          flex: 1;
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
        }

        .settings-sidebar {
          width: 280px;
          background: white;
          border-radius: 8px;
          padding: 0;
          overflow-y: auto;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e8e8e8;
          sticky: top;
          background: white;
        }

        .sidebar-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          padding: 10px;
        }

        .nav-item {
          padding: 12px 16px;
          margin: 4px 0;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          color: #666;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .nav-item:hover {
          background: #f5f5f5;
          color: #333;
        }

        .nav-item.active {
          background: #c9a84c20;
          color: #c9a84c;
          font-weight: 500;
          border-left: 3px solid #c9a84c;
          padding-left: 13px;
        }

        .settings-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .settings-layout {
            flex-direction: column;
            gap: 0;
          }

          .settings-sidebar {
            width: 100%;
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            height: auto;
          }

          .sidebar-nav {
            flex-direction: row;
            flex-wrap: wrap;
            flex: 1;
          }

          .nav-item {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
