'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface TableQRSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function TableQRSection({ settings, onSave, error }: TableQRSectionProps) {
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

  return (
    <SettingsForm
      title="Tables & QR Codes"
      description="Manage table configurations and QR code settings"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <FormField
        label="Default Table Count"
        type="number"
        value={formData.default_table_count || 10}
        onChange={v => handleChange('default_table_count', v)}
        placeholder="10"
      />

      <FormField
        label="Enable QR Codes"
        type="checkbox"
        value={formData.enable_qr_codes !== false}
        onChange={v => handleChange('enable_qr_codes', v)}
      />

      <FormField
        label="QR Code Format"
        type="select"
        value={formData.qr_code_format || 'url'}
        onChange={v => handleChange('qr_code_format', v)}
        options={[
          { label: 'URL Link', value: 'url' },
          { label: 'Text', value: 'text' },
        ]}
      />

      <FormField
        label="QR Prefix URL"
        value={formData.qr_prefix_url || 'https://menu.comma.com/table/'}
        onChange={v => handleChange('qr_prefix_url', v)}
        placeholder="https://menu.comma.com/table/"
        helperText="The URL that will be embedded in QR codes"
      />

      <FormField
        label="Enable Table Transfer"
        type="checkbox"
        value={formData.enable_table_transfer || false}
        onChange={v => handleChange('enable_table_transfer', v)}
        helperText="Allow customers to move between tables"
      />

      <FormField
        label="Allow Table Merge"
        type="checkbox"
        value={formData.table_merge_enabled || false}
        onChange={v => handleChange('table_merge_enabled', v)}
        helperText="Allow merging multiple tables"
      />

      <FormField
        label="Auto Reserve Duration (minutes)"
        type="number"
        value={formData.auto_reserve_duration_minutes || 120}
        onChange={v => handleChange('auto_reserve_duration_minutes', v)}
        placeholder="120"
      />
    </SettingsForm>
  );
}
