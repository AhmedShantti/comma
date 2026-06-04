'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface ReceiptSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function ReceiptSettingsSection({ settings, onSave, error }: ReceiptSettingsSectionProps) {
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
      title="Receipt Settings"
      description="Configure receipt layout, branding, and printing options"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
      hasChanges={hasChanges}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Receipt Branding</h3>

      <FormField
        label="Business Name on Receipt"
        value={formData.business_name_on_receipt || ''}
        onChange={v => handleChange('business_name_on_receipt', v)}
        placeholder="COMMA"
      />

      <FormField
        label="Business Address"
        value={formData.business_address_on_receipt || ''}
        onChange={v => handleChange('business_address_on_receipt', v)}
        placeholder="123 Main St, Cairo"
      />

      <FormField
        label="Business Phone"
        value={formData.business_phone_on_receipt || ''}
        onChange={v => handleChange('business_phone_on_receipt', v)}
        placeholder="+20 xxx xxx xxxx"
      />

      <FormField
        label="Tax Number"
        value={formData.tax_number_on_receipt || ''}
        onChange={v => handleChange('tax_number_on_receipt', v)}
        placeholder="Tax registration number"
      />

      <FormField
        label="Logo URL"
        value={formData.logo_url || ''}
        onChange={v => handleChange('logo_url', v)}
        placeholder="https://example.com/logo.png"
      />

      <FormField
        label="Header Text"
        type="textarea"
        value={formData.header_text || ''}
        onChange={v => handleChange('header_text', v)}
        placeholder="Custom text displayed above items"
      />

      <FormField
        label="Footer Message"
        type="textarea"
        value={formData.footer_message || ''}
        onChange={v => handleChange('footer_message', v)}
        placeholder="Thank you for visiting!"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Receipt Format</h3>

      <FormField
        label="Receipt Prefix"
        value={formData.receipt_prefix || 'RCT'}
        onChange={v => handleChange('receipt_prefix', v)}
        placeholder="RCT"
      />

      <FormField
        label="Currency Symbol"
        value={formData.currency_symbol || 'ILS'}
        onChange={v => handleChange('currency_symbol', v)}
        placeholder="ILS"
      />

      <FormField
        label="Default Paper Size"
        type="select"
        value={formData.default_paper_size || '80mm'}
        onChange={v => handleChange('default_paper_size', v)}
        options={[
          { label: '58mm (Small)', value: '58mm' },
          { label: '80mm (Standard)', value: '80mm' },
        ]}
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Display Options</h3>

      <FormField
        label="Show Tax Breakdown"
        type="checkbox"
        value={formData.show_tax_breakdown !== false}
        onChange={v => handleChange('show_tax_breakdown', v)}
      />

      <FormField
        label="Show Service Charge"
        type="checkbox"
        value={formData.show_service_charge !== false}
        onChange={v => handleChange('show_service_charge', v)}
      />

      <FormField
        label="Show Waiter Name"
        type="checkbox"
        value={formData.show_waiter_name !== false}
        onChange={v => handleChange('show_waiter_name', v)}
      />

      <FormField
        label="Show Cashier Name"
        type="checkbox"
        value={formData.show_cashier_name !== false}
        onChange={v => handleChange('show_cashier_name', v)}
      />

      <FormField
        label="Show Order Number"
        type="checkbox"
        value={formData.show_order_number !== false}
        onChange={v => handleChange('show_order_number', v)}
      />

      <FormField
        label="Show Table Number"
        type="checkbox"
        value={formData.show_table_number !== false}
        onChange={v => handleChange('show_table_number', v)}
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Financial Defaults</h3>

      <FormField
        label="Tax Percentage"
        type="number"
        value={formData.tax_percentage || 15}
        onChange={v => handleChange('tax_percentage', v)}
        placeholder="15"
      />

      <FormField
        label="Service Charge Percentage"
        type="number"
        value={formData.service_charge_percentage || 0}
        onChange={v => handleChange('service_charge_percentage', v)}
        placeholder="0"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Automation</h3>

      <FormField
        label="Auto Print After Payment"
        type="checkbox"
        value={formData.auto_print_after_payment || false}
        onChange={v => handleChange('auto_print_after_payment', v)}
        helperText="Automatically open print dialog after checkout"
      />
    </SettingsForm>
  );
}
