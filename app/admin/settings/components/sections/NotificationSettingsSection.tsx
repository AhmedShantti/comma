'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface NotificationSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function NotificationSettingsSection({ settings, onSave, error }: NotificationSettingsSectionProps) {
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
      title="Notification Settings"
      description="Configure notification channels and alert preferences"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Notification Channels</h3>

      <FormField
        label="Enable Email Notifications"
        type="checkbox"
        value={formData.email_notifications_enabled !== false}
        onChange={v => handleChange('email_notifications_enabled', v)}
      />

      <FormField
        label="Enable SMS Notifications"
        type="checkbox"
        value={formData.sms_notifications_enabled || false}
        onChange={v => handleChange('sms_notifications_enabled', v)}
      />

      <FormField
        label="Enable Push Notifications"
        type="checkbox"
        value={formData.push_notifications_enabled !== false}
        onChange={v => handleChange('push_notifications_enabled', v)}
      />

      <FormField
        label="Enable In-App Notifications"
        type="checkbox"
        value={formData.in_app_notifications_enabled !== false}
        onChange={v => handleChange('in_app_notifications_enabled', v)}
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Alert Types</h3>

      <FormField
        label="Notify on New Orders"
        type="checkbox"
        value={formData.notify_on_new_orders !== false}
        onChange={v => handleChange('notify_on_new_orders', v)}
      />

      <FormField
        label="Notify on Payment Received"
        type="checkbox"
        value={formData.notify_on_payment_received !== false}
        onChange={v => handleChange('notify_on_payment_received', v)}
      />

      <FormField
        label="Notify on Staff Late"
        type="checkbox"
        value={formData.notify_on_staff_late || false}
        onChange={v => handleChange('notify_on_staff_late', v)}
      />

      <FormField
        label="Notify on Low Inventory"
        type="checkbox"
        value={formData.notify_on_low_inventory || false}
        onChange={v => handleChange('notify_on_low_inventory', v)}
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Contact Information</h3>

      <FormField
        label="Notification Email Address"
        type="email"
        value={formData.notification_email_address || ''}
        onChange={v => handleChange('notification_email_address', v)}
        placeholder="alerts@restaurant.com"
      />

      <FormField
        label="Notification Phone Number"
        type="text"
        value={formData.notification_phone_number || ''}
        onChange={v => handleChange('notification_phone_number', v)}
        placeholder="+20 xxx xxx xxxx"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Quiet Hours</h3>

      <FormField
        label="Enable Quiet Hours"
        type="checkbox"
        value={formData.quiet_hours_enabled || false}
        onChange={v => handleChange('quiet_hours_enabled', v)}
        helperText="Disable notifications during specified hours"
      />

      {formData.quiet_hours_enabled && (
        <>
          <FormField
            label="Quiet Hours Start Time"
            type="time"
            value={formData.quiet_hours_start || '22:00'}
            onChange={v => handleChange('quiet_hours_start', v)}
          />

          <FormField
            label="Quiet Hours End Time"
            type="time"
            value={formData.quiet_hours_end || '08:00'}
            onChange={v => handleChange('quiet_hours_end', v)}
          />
        </>
      )}
    </SettingsForm>
  );
}
