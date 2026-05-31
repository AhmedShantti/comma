'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface PaymentSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function PaymentSettingsSection({ settings, onSave, error }: PaymentSettingsSectionProps) {
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const paymentMethods = ['cash', 'card', 'mobile_wallet', 'check', 'bank_transfer'];
  const cardProcessors = ['stripe', 'paypal', 'square', 'tap', 'fawry'];
  const tipPercentages = [10, 15, 20, 25];

  const acceptedMethods = formData.accepted_payment_methods || [];
  const enabledProcessors = formData.card_processors || [];
  const tipAmounts = formData.tip_percentages || [];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePaymentMethod = (method: string) => {
    const updated = acceptedMethods.includes(method)
      ? acceptedMethods.filter((m: string) => m !== method)
      : [...acceptedMethods, method];
    handleChange('accepted_payment_methods', updated);
  };

  const toggleProcessor = (processor: string) => {
    const updated = enabledProcessors.includes(processor)
      ? enabledProcessors.filter((p: string) => p !== processor)
      : [...enabledProcessors, processor];
    handleChange('card_processors', updated);
  };

  const toggleTipPercentage = (percentage: number) => {
    const updated = tipAmounts.includes(percentage)
      ? tipAmounts.filter((p: number) => p !== percentage)
      : [...tipAmounts, percentage].sort((a, b) => a - b);
    handleChange('tip_percentages', updated);
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
      title="Payment Settings"
      description="Configure payment methods, processors, and tip settings"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Accepted Payment Methods</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paymentMethods.map(method => (
            <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={acceptedMethods.includes(method)}
                onChange={() => togglePaymentMethod(method)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>
                {method.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Card Processors</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cardProcessors.map(processor => (
            <label key={processor} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enabledProcessors.includes(processor)}
                onChange={() => toggleProcessor(processor)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{processor}</span>
            </label>
          ))}
        </div>
      </div>

      <FormField
        label="Tax Rate (%)"
        type="number"
        value={formData.tax_rate_percent || 0}
        onChange={v => handleChange('tax_rate_percent', v)}
        placeholder="0"
      />

      <FormField
        label="Enable Tips"
        type="checkbox"
        value={formData.tip_enabled || false}
        onChange={v => handleChange('tip_enabled', v)}
      />

      {formData.tip_enabled && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>Tip Percentages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tipPercentages.map(percentage => (
                <label key={percentage} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={tipAmounts.includes(percentage)}
                    onChange={() => toggleTipPercentage(percentage)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px' }}>{percentage}%</span>
                </label>
              ))}
            </div>
          </div>

          <FormField
            label="Tip Suggestion Mode"
            type="select"
            value={formData.tip_suggestion_mode || 'percentage'}
            onChange={v => handleChange('tip_suggestion_mode', v)}
            options={[
              { label: 'Percentage Based', value: 'percentage' },
              { label: 'Fixed Amount', value: 'fixed' },
              { label: 'Disabled', value: 'disabled' },
            ]}
          />
        </>
      )}

      <FormField
        label="Split Bill Enabled"
        type="checkbox"
        value={formData.split_bill_enabled || false}
        onChange={v => handleChange('split_bill_enabled', v)}
        helperText="Allow splitting a single bill between multiple payments"
      />

      <FormField
        label="Require Payment Confirmation"
        type="checkbox"
        value={formData.require_payment_confirmation || false}
        onChange={v => handleChange('require_payment_confirmation', v)}
        helperText="Confirm payment before completing the transaction"
      />

      <FormField
        label="Service Charge Included in Price"
        type="checkbox"
        value={formData.service_charge_included_in_price || false}
        onChange={v => handleChange('service_charge_included_in_price', v)}
        helperText="Service charge is already part of menu prices"
      />
    </SettingsForm>
  );
}
