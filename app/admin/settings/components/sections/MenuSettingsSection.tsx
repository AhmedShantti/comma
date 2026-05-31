'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface MenuSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function MenuSettingsSection({ settings, onSave, error }: MenuSettingsSectionProps) {
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
      title="Menu Settings"
      description="Configure how your menu is displayed to customers"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <FormField
        label="Hide Sold Out Items"
        type="checkbox"
        value={formData.hide_sold_out_items || false}
        onChange={v => handleChange('hide_sold_out_items', v)}
        helperText="Hide items that are currently unavailable"
      />

      <FormField
        label="Show Item Descriptions"
        type="checkbox"
        value={formData.show_item_descriptions !== false}
        onChange={v => handleChange('show_item_descriptions', v)}
      />

      <FormField
        label="Enable Add-ons"
        type="checkbox"
        value={formData.enable_addons !== false}
        onChange={v => handleChange('enable_addons', v)}
        helperText="Allow customers to add options to items"
      />

      <FormField
        label="Enable Variants"
        type="checkbox"
        value={formData.enable_variants !== false}
        onChange={v => handleChange('enable_variants', v)}
        helperText="Allow customers to select sizes or variations"
      />

      <FormField
        label="Enable Allergen Warnings"
        type="checkbox"
        value={formData.enable_allergen_warnings || false}
        onChange={v => handleChange('enable_allergen_warnings', v)}
      />

      <FormField
        label="Default Portion Size"
        type="select"
        value={formData.default_portion_size || 'medium'}
        onChange={v => handleChange('default_portion_size', v)}
        options={[
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ]}
      />

      <FormField
        label="Show Item Images"
        type="checkbox"
        value={formData.show_item_images !== false}
        onChange={v => handleChange('show_item_images', v)}
      />

      <FormField
        label="Enable Menu Search"
        type="checkbox"
        value={formData.enable_menu_search !== false}
        onChange={v => handleChange('enable_menu_search', v)}
      />

      <FormField
        label="Items Per Page"
        type="number"
        value={formData.items_per_page || 12}
        onChange={v => handleChange('items_per_page', v)}
        placeholder="12"
      />
    </SettingsForm>
  );
}
