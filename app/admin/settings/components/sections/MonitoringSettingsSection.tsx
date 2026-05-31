'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface MonitoringSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function MonitoringSettingsSection({ settings, onSave, error }: MonitoringSettingsSectionProps) {
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(settings || {});

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsForm
      title="Monitoring Settings"
      description="Configure system monitoring and alerting"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
      hasChanges={hasChanges}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Error Tracking</h3>

      <FormField
        label="Enable Error Tracking"
        type="checkbox"
        value={formData.error_tracking_enabled || false}
        onChange={v => handleChange('error_tracking_enabled', v)}
      />

      {formData.error_tracking_enabled && (
        <FormField
          label="Error Tracking Provider"
          type="select"
          value={formData.error_tracking_provider || 'sentry'}
          onChange={v => handleChange('error_tracking_provider', v)}
          options={[
            { label: 'Sentry', value: 'sentry' },
            { label: 'Datadog', value: 'datadog' },
            { label: 'Custom', value: 'custom' },
          ]}
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Uptime Monitoring</h3>

      <FormField
        label="Enable Uptime Monitoring"
        type="checkbox"
        value={formData.uptime_monitoring_enabled || false}
        onChange={v => handleChange('uptime_monitoring_enabled', v)}
      />

      {formData.uptime_monitoring_enabled && (
        <FormField
          label="Uptime Check Interval (minutes)"
          type="number"
          value={formData.uptime_check_interval_minutes || 5}
          onChange={v => handleChange('uptime_check_interval_minutes', v)}
          placeholder="5"
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Performance Monitoring</h3>

      <FormField
        label="Enable Database Performance Monitoring"
        type="checkbox"
        value={formData.database_performance_monitoring || false}
        onChange={v => handleChange('database_performance_monitoring', v)}
      />

      <FormField
        label="API Response Time Threshold (ms)"
        type="number"
        value={formData.api_response_time_threshold_ms || 1000}
        onChange={v => handleChange('api_response_time_threshold_ms', v)}
        placeholder="1000"
        helperText="Alert if API responds slower than this"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>System Alerts</h3>

      <FormField
        label="Alert on Low Disk Space (%)"
        type="number"
        value={formData.alert_low_disk_space_threshold_percent || 10}
        onChange={v => handleChange('alert_low_disk_space_threshold_percent', v)}
        placeholder="10"
        helperText="Alert when disk usage exceeds this percentage"
      />

      <FormField
        label="Alert on High CPU Usage (%)"
        type="number"
        value={formData.alert_high_cpu_threshold_percent || 80}
        onChange={v => handleChange('alert_high_cpu_threshold_percent', v)}
        placeholder="80"
        helperText="Alert when CPU usage exceeds this percentage"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Notifications</h3>

      <FormField
        label="Alert Email Recipients (comma-separated)"
        type="textarea"
        value={(formData.alert_email_recipients || []).join(', ')}
        onChange={v => handleChange('alert_email_recipients', v.split(',').map((e: string) => e.trim()).filter((e: string) => e))}
        placeholder="admin@restaurant.com, ops@restaurant.com"
      />

      <FormField
        label="Performance Log Retention (days)"
        type="number"
        value={formData.performance_log_retention_days || 30}
        onChange={v => handleChange('performance_log_retention_days', v)}
        placeholder="30"
      />
    </SettingsForm>
  );
}
