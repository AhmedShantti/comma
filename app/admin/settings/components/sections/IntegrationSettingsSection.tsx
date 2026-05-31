'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface IntegrationSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function IntegrationSettingsSection({ settings, onSave, error }: IntegrationSettingsSectionProps) {
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      title="Integration Settings"
      description="Connect third-party services and platforms"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Accounting Integration</h3>

      <FormField
        label="Enable Accounting Sync"
        type="checkbox"
        value={formData.enable_accounting_sync || false}
        onChange={v => handleChange('enable_accounting_sync', v)}
      />

      {formData.enable_accounting_sync && (
        <FormField
          label="Accounting Provider"
          type="select"
          value={formData.accounting_provider || 'xero'}
          onChange={v => handleChange('accounting_provider', v)}
          options={[
            { label: 'Xero', value: 'xero' },
            { label: 'QuickBooks', value: 'quickbooks' },
            { label: 'Other', value: 'other' },
          ]}
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Delivery Integration</h3>

      <FormField
        label="Enable Delivery Integration"
        type="checkbox"
        value={formData.enable_delivery_integration || false}
        onChange={v => handleChange('enable_delivery_integration', v)}
      />

      {formData.enable_delivery_integration && (
        <FormField
          label="Delivery Providers (comma-separated)"
          type="text"
          value={formData.delivery_providers?.join(', ') || ''}
          onChange={v => handleChange('delivery_providers', v.split(',').map((p: string) => p.trim()).filter((p: string) => p))}
          placeholder="uber_eats, deliveroo, talabat"
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Loyalty Program</h3>

      <FormField
        label="Enable Loyalty Program"
        type="checkbox"
        value={formData.enable_loyalty_program || false}
        onChange={v => handleChange('enable_loyalty_program', v)}
      />

      {formData.enable_loyalty_program && (
        <FormField
          label="Loyalty Provider"
          type="select"
          value={formData.loyalty_provider || 'custom'}
          onChange={v => handleChange('loyalty_provider', v)}
          options={[
            { label: 'Custom', value: 'custom' },
            { label: 'Third Party', value: 'third_party' },
          ]}
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Inventory Management</h3>

      <FormField
        label="Enable Inventory Sync"
        type="checkbox"
        value={formData.enable_inventory_sync || false}
        onChange={v => handleChange('enable_inventory_sync', v)}
      />

      {formData.enable_inventory_sync && (
        <FormField
          label="Inventory Provider"
          type="text"
          value={formData.inventory_provider || ''}
          onChange={v => handleChange('inventory_provider', v)}
          placeholder="e.g., MarginEdge, Toast"
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Staff Scheduling</h3>

      <FormField
        label="Enable Staff Scheduling Sync"
        type="checkbox"
        value={formData.enable_staff_scheduling_sync || false}
        onChange={v => handleChange('enable_staff_scheduling_sync', v)}
      />

      {formData.enable_staff_scheduling_sync && (
        <FormField
          label="Scheduling Provider"
          type="text"
          value={formData.scheduling_provider || ''}
          onChange={v => handleChange('scheduling_provider', v)}
          placeholder="e.g., Deputy, Zip Schedules"
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Webhooks</h3>

      <FormField
        label="Enable Webhook Notifications"
        type="checkbox"
        value={formData.enable_webhook_notifications || false}
        onChange={v => handleChange('enable_webhook_notifications', v)}
      />

      {formData.enable_webhook_notifications && (
        <>
          <FormField
            label="Webhook URL"
            type="text"
            value={formData.webhook_url || ''}
            onChange={v => handleChange('webhook_url', v)}
            placeholder="https://your-app.com/webhooks/comma"
          />

          <FormField
            label="Webhook Events (comma-separated)"
            type="text"
            value={formData.webhook_events?.join(', ') || ''}
            onChange={v => handleChange('webhook_events', v.split(',').map((e: string) => e.trim()).filter((e: string) => e))}
            placeholder="order.created, payment.received, order.cancelled"
          />

          <div style={{ padding: '12px', backgroundColor: '#FFF3E0', borderRadius: '6px', marginBottom: '24px', fontSize: '12px', color: '#E65100' }}>
            ⚠️ Webhook secret key is encrypted and never displayed
          </div>
        </>
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>API Credentials</h3>

      <div style={{ padding: '12px', backgroundColor: '#FFF3E0', borderRadius: '6px', marginBottom: '24px', fontSize: '12px', color: '#E65100' }}>
        ⚠️ API credentials are encrypted and stored securely. They are never displayed after initial setup.
      </div>

      <FormField
        label="API Key Status"
        type="text"
        value={formData.api_key_configured ? '✓ Configured' : '✗ Not configured'}
        disabled
      />

      <FormField
        label="API Secret Status"
        type="text"
        value={formData.api_secret_configured ? '✓ Configured' : '✗ Not configured'}
        disabled
      />

      <div style={{ padding: '12px', backgroundColor: '#E3F2FD', borderRadius: '6px', marginTop: '24px', fontSize: '12px', color: '#1565C0' }}>
        💡 To update API credentials, contact your system administrator or visit the API management dashboard.
      </div>
    </SettingsForm>
  );
}
