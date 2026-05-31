'use client';

// Platform Control Center Settings - Phase 2 Complete
// All 14 settings sections with backend integration

import { useState } from 'react';
import { useSettings } from './hooks/useSettings';
import { SettingsSidebar } from './components/SettingsSidebar';
import { BusinessInfoSection } from './components/sections/BusinessInfoSection';
import { RestaurantConfigSection } from './components/sections/RestaurantConfigSection';
import { MenuSettingsSection } from './components/sections/MenuSettingsSection';
import { TableQRSection } from './components/sections/TableQRSection';
import { OrderWorkflowSection } from './components/sections/OrderWorkflowSection';
import { PaymentSettingsSection } from './components/sections/PaymentSettingsSection';
import { UserManagementSettingsSection } from './components/sections/UserManagementSettingsSection';
import { ShiftSettingsSection } from './components/sections/ShiftSettingsSection';
import { NotificationSettingsSection } from './components/sections/NotificationSettingsSection';
import { ReportSettingsSection } from './components/sections/ReportSettingsSection';
import { AppearanceSettingsSection } from './components/sections/AppearanceSettingsSection';
import { SecuritySettingsSection } from './components/sections/SecuritySettingsSection';
import { MonitoringSettingsSection } from './components/sections/MonitoringSettingsSection';
import { IntegrationSettingsSection } from './components/sections/IntegrationSettingsSection';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('business-info');
  const { settings, loading, error, updateSettings } = useSettings();

  const sections: Record<string, React.ComponentType<any>> = {
    'business-info': BusinessInfoSection,
    'restaurant-config': RestaurantConfigSection,
    'menu': MenuSettingsSection,
    'tables-qr': TableQRSection,
    'order-workflow': OrderWorkflowSection,
    'payments': PaymentSettingsSection,
    'users': UserManagementSettingsSection,
    'shifts': ShiftSettingsSection,
    'notifications': NotificationSettingsSection,
    'reports': ReportSettingsSection,
    'appearance': AppearanceSettingsSection,
    'security': SecuritySettingsSection,
    'monitoring': MonitoringSettingsSection,
    'integrations': IntegrationSettingsSection,
  };

  const SectionComponent = sections[activeSection] || BusinessInfoSection;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <SettingsSidebar activeSection={activeSection} onSelectSection={setActiveSection} />

      <main style={{ flex: 1, padding: '32px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
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
  );
}
