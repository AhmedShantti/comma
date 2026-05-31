'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface ShiftSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function ShiftSettingsSection({ settings, onSave, error }: ShiftSettingsSectionProps) {
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
      title="Shift Settings"
      description="Manage shift duration, breaks, and staff scheduling configurations"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
      hasChanges={hasChanges}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Shift Configuration</h3>

      <FormField
        label="Shift Duration (minutes)"
        type="number"
        value={formData.shift_duration_minutes || 480}
        onChange={v => handleChange('shift_duration_minutes', v)}
        placeholder="480"
        helperText="Default shift duration in minutes (480 = 8 hours)"
      />

      <FormField
        label="Allow Shift Overlap"
        type="checkbox"
        value={formData.allow_shift_overlap || false}
        onChange={v => handleChange('allow_shift_overlap', v)}
        helperText="Allow multiple shifts at the same time"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Auto Clock-Out</h3>

      <FormField
        label="Enable Auto Clock-Out"
        type="checkbox"
        value={formData.auto_clock_out_enabled || false}
        onChange={v => handleChange('auto_clock_out_enabled', v)}
        helperText="Automatically clock out staff after inactive period"
      />

      <FormField
        label="Auto Clock-Out After (minutes)"
        type="number"
        value={formData.auto_clock_out_minutes || 600}
        onChange={v => handleChange('auto_clock_out_minutes', v)}
        placeholder="600"
        helperText="Minutes of inactivity before auto clock-out (600 = 10 hours)"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Break Settings</h3>

      <FormField
        label="Break Duration (minutes)"
        type="number"
        value={formData.break_duration_minutes || 30}
        onChange={v => handleChange('break_duration_minutes', v)}
        placeholder="30"
      />

      <FormField
        label="Breaks Per Shift"
        type="number"
        value={formData.breaks_per_shift || 2}
        onChange={v => handleChange('breaks_per_shift', v)}
        placeholder="2"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Staff Management</h3>

      <FormField
        label="Allow Manual Clock In/Out"
        type="checkbox"
        value={formData.allow_manual_clock_in_out !== false}
        onChange={v => handleChange('allow_manual_clock_in_out', v)}
        helperText="Allow staff to manually record clock in/out times"
      />

      <FormField
        label="Warn on Long Shifts"
        type="checkbox"
        value={formData.warn_long_shifts || false}
        onChange={v => handleChange('warn_long_shifts', v)}
      />

      {formData.warn_long_shifts && (
        <FormField
          label="Long Shift Threshold (hours)"
          type="number"
          value={formData.warn_long_shift_hours || 10}
          onChange={v => handleChange('warn_long_shift_hours', v)}
          placeholder="10"
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Payroll Integration</h3>

      <FormField
        label="Enable Payroll Integration"
        type="checkbox"
        value={formData.payroll_integration_enabled || false}
        onChange={v => handleChange('payroll_integration_enabled', v)}
      />

      {formData.payroll_integration_enabled && (
        <FormField
          label="Payroll Provider"
          type="text"
          value={formData.payroll_provider || ''}
          onChange={v => handleChange('payroll_provider', v)}
          placeholder="e.g., ADP, Gusto, BambooHR"
        />
      )}
    </SettingsForm>
  );
}
