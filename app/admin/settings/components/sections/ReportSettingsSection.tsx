'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface ReportSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function ReportSettingsSection({ settings, onSave, error }: ReportSettingsSectionProps) {
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <SettingsForm
      title="Report Settings"
      description="Configure automated reports and export preferences"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Daily Reports</h3>

      <FormField
        label="Enable Daily Reports"
        type="checkbox"
        value={formData.auto_daily_reports || false}
        onChange={v => handleChange('auto_daily_reports', v)}
      />

      {formData.auto_daily_reports && (
        <>
          <FormField
            label="Daily Report Time"
            type="time"
            value={formData.daily_report_time || '23:00'}
            onChange={v => handleChange('daily_report_time', v)}
          />

          <FormField
            label="Daily Report Recipients (comma-separated emails)"
            type="textarea"
            value={(formData.daily_report_recipients || []).join(', ')}
            onChange={v => handleChange('daily_report_recipients', v.split(',').map((e: string) => e.trim()).filter((e: string) => e))}
            placeholder="admin@restaurant.com, manager@restaurant.com"
          />
        </>
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Weekly Reports</h3>

      <FormField
        label="Enable Weekly Reports"
        type="checkbox"
        value={formData.auto_weekly_reports || false}
        onChange={v => handleChange('auto_weekly_reports', v)}
      />

      {formData.auto_weekly_reports && (
        <>
          <FormField
            label="Weekly Report Day"
            type="select"
            value={formData.weekly_report_day || 0}
            onChange={v => handleChange('weekly_report_day', parseInt(v))}
            options={dayNames.map((day, idx) => ({ label: day, value: idx.toString() }))}
          />

          <FormField
            label="Weekly Report Time"
            type="time"
            value={formData.weekly_report_time || '09:00'}
            onChange={v => handleChange('weekly_report_time', v)}
          />

          <FormField
            label="Weekly Report Recipients (comma-separated emails)"
            type="textarea"
            value={(formData.weekly_report_recipients || []).join(', ')}
            onChange={v => handleChange('weekly_report_recipients', v.split(',').map((e: string) => e.trim()).filter((e: string) => e))}
            placeholder="admin@restaurant.com"
          />
        </>
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Report Content</h3>

      <FormField
        label="Enable Profit Margins Report"
        type="checkbox"
        value={formData.enable_profit_margins !== false}
        onChange={v => handleChange('enable_profit_margins', v)}
      />

      <FormField
        label="Enable Sales by Category Report"
        type="checkbox"
        value={formData.enable_sales_by_category !== false}
        onChange={v => handleChange('enable_sales_by_category', v)}
      />

      <FormField
        label="Enable Inventory Reports"
        type="checkbox"
        value={formData.enable_inventory_reports || false}
        onChange={v => handleChange('enable_inventory_reports', v)}
      />

      <FormField
        label="Enable Staff Performance Reports"
        type="checkbox"
        value={formData.enable_staff_performance || false}
        onChange={v => handleChange('enable_staff_performance', v)}
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Export Settings</h3>

      <FormField
        label="Default Export Format"
        type="select"
        value={formData.export_format_default || 'pdf'}
        onChange={v => handleChange('export_format_default', v)}
        options={[
          { label: 'PDF', value: 'pdf' },
          { label: 'Excel', value: 'excel' },
          { label: 'CSV', value: 'csv' },
        ]}
      />
    </SettingsForm>
  );
}
