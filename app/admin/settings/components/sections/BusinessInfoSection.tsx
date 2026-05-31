'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface BusinessInfoSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function BusinessInfoSection({ settings, onSave, error }: BusinessInfoSectionProps) {
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Detect if there are unsaved changes
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
      title="Business Information"
      description="Manage your restaurant's basic information and business details"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
      hasChanges={hasChanges}
    >
      <FormField
        label="Restaurant Name"
        value={formData.restaurant_name || ''}
        onChange={v => handleChange('restaurant_name', v)}
        placeholder="e.g., My Restaurant"
      />

      <FormField
        label="Restaurant Phone"
        type="text"
        value={formData.restaurant_phone || ''}
        onChange={v => handleChange('restaurant_phone', v)}
        placeholder="+20 xxx xxx xxxx"
      />

      <FormField
        label="Restaurant Email"
        type="email"
        value={formData.restaurant_email || ''}
        onChange={v => handleChange('restaurant_email', v)}
        placeholder="info@restaurant.com"
      />

      <FormField
        label="Business Address"
        value={formData.business_address || ''}
        onChange={v => handleChange('business_address', v)}
        placeholder="Street address"
      />

      <FormField
        label="City"
        value={formData.business_city || ''}
        onChange={v => handleChange('business_city', v)}
        placeholder="Cairo, Alexandria, etc."
      />

      <FormField
        label="Postal Code"
        value={formData.business_postal_code || ''}
        onChange={v => handleChange('business_postal_code', v)}
        placeholder="Postal code"
      />

      <FormField
        label="Tax ID"
        value={formData.tax_id || ''}
        onChange={v => handleChange('tax_id', v)}
        placeholder="Tax identification number"
      />

      <FormField
        label="Business License Number"
        value={formData.business_license_number || ''}
        onChange={v => handleChange('business_license_number', v)}
        placeholder="License number"
      />

      <FormField
        label="Currency Code"
        value={formData.currency_code || 'EGP'}
        onChange={v => handleChange('currency_code', v)}
        placeholder="EGP, USD, EUR"
      />

      <FormField
        label="Owner Name"
        value={formData.owner_name || ''}
        onChange={v => handleChange('owner_name', v)}
        placeholder="Full name"
      />

      <FormField
        label="Owner Email"
        type="email"
        value={formData.owner_email || ''}
        onChange={v => handleChange('owner_email', v)}
        placeholder="owner@email.com"
      />
    </SettingsForm>
  );
}
