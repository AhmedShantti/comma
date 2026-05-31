'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface RestaurantConfigSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function RestaurantConfigSection({ settings, onSave, error }: RestaurantConfigSectionProps) {
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

  const timezones = [
    'UTC', 'EET', 'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'IST', 'JST', 'AEST',
  ];

  return (
    <SettingsForm
      title="Restaurant Configuration"
      description="Configure your restaurant's operating hours, timezone, and service charges"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
      hasChanges={hasChanges}
    >
      <FormField
        label="Opening Time"
        type="time"
        value={formData.opening_time || '09:00'}
        onChange={v => handleChange('opening_time', v)}
      />

      <FormField
        label="Closing Time"
        type="time"
        value={formData.closing_time || '23:00'}
        onChange={v => handleChange('closing_time', v)}
      />

      <FormField
        label="Timezone"
        type="select"
        value={formData.timezone || 'UTC'}
        onChange={v => handleChange('timezone', v)}
        options={timezones.map(tz => ({ label: tz, value: tz }))}
      />

      <FormField
        label="Default Service Charge (%)"
        type="number"
        value={formData.default_service_charge_percent || 0}
        onChange={v => handleChange('default_service_charge_percent', v)}
        placeholder="0"
      />

      <FormField
        label="Default Discount (%)"
        type="number"
        value={formData.default_discount_percent || 0}
        onChange={v => handleChange('default_discount_percent', v)}
        placeholder="0"
      />

      <FormField
        label="Service Charge Type"
        type="select"
        value={formData.service_charge_type || 'percentage'}
        onChange={v => handleChange('service_charge_type', v)}
        options={[
          { label: 'Percentage', value: 'percentage' },
          { label: 'Fixed Amount', value: 'fixed' },
        ]}
      />

      <FormField
        label="Service Tax Included in Price"
        type="checkbox"
        value={formData.service_tax_included || false}
        onChange={v => handleChange('service_tax_included', v)}
        helperText="Enable if service charge is already included in menu prices"
      />

      <FormField
        label="Accept Online Orders"
        type="checkbox"
        value={formData.accept_online_orders || false}
        onChange={v => handleChange('accept_online_orders', v)}
      />

      <FormField
        label="Accept Delivery"
        type="checkbox"
        value={formData.accept_delivery || false}
        onChange={v => handleChange('accept_delivery', v)}
      />

      <FormField
        label="Accept Reservations"
        type="checkbox"
        value={formData.accepts_reservations || false}
        onChange={v => handleChange('accepts_reservations', v)}
      />
    </SettingsForm>
  );
}
