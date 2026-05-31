'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface AppearanceSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function AppearanceSettingsSection({ settings, onSave, error }: AppearanceSettingsSectionProps) {
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
      title="Appearance Settings"
      description="Customize the look and feel of your restaurant's POS system"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Colors</h3>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <FormField
            label="Primary Color"
            type="text"
            value={formData.primary_color || '#c9a84c'}
            onChange={v => handleChange('primary_color', v)}
            placeholder="#c9a84c"
          />
        </div>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: formData.primary_color || '#c9a84c',
            borderRadius: '8px',
            border: '2px solid #ddd',
            marginTop: '24px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <FormField
            label="Secondary Color"
            type="text"
            value={formData.secondary_color || '#0f0e0d'}
            onChange={v => handleChange('secondary_color', v)}
            placeholder="#0f0e0d"
          />
        </div>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: formData.secondary_color || '#0f0e0d',
            borderRadius: '8px',
            border: '2px solid #ddd',
            marginTop: '24px',
          }}
        />
      </div>

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Theme</h3>

      <FormField
        label="Theme Preset"
        type="select"
        value={formData.theme_preset || 'modern'}
        onChange={v => handleChange('theme_preset', v)}
        options={[
          { label: 'Modern', value: 'modern' },
          { label: 'Elegant', value: 'elegant' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Casual', value: 'casual' },
        ]}
      />

      <FormField
        label="Enable Dark Mode"
        type="checkbox"
        value={formData.dark_mode_enabled || false}
        onChange={v => handleChange('dark_mode_enabled', v)}
      />

      <FormField
        label="Font Family"
        type="text"
        value={formData.font_family || 'Inter'}
        onChange={v => handleChange('font_family', v)}
        placeholder="Inter"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Branding</h3>

      <FormField
        label="Logo URL"
        type="text"
        value={formData.logo_url || ''}
        onChange={v => handleChange('logo_url', v)}
        placeholder="https://example.com/logo.png"
      />

      <FormField
        label="Favicon URL"
        type="text"
        value={formData.favicon_url || ''}
        onChange={v => handleChange('favicon_url', v)}
        placeholder="https://example.com/favicon.ico"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Invoice & Receipt</h3>

      <FormField
        label="Invoice Header Text"
        type="textarea"
        value={formData.invoice_header_text || ''}
        onChange={v => handleChange('invoice_header_text', v)}
        placeholder="Your restaurant name and details"
      />

      <FormField
        label="Invoice Footer Text"
        type="textarea"
        value={formData.invoice_footer_text || ''}
        onChange={v => handleChange('invoice_footer_text', v)}
        placeholder="Thank you for your purchase!"
      />

      <FormField
        label="Receipt Header Text"
        type="textarea"
        value={formData.receipt_header_text || ''}
        onChange={v => handleChange('receipt_header_text', v)}
        placeholder="Your restaurant name"
      />

      <FormField
        label="Receipt Footer Text"
        type="textarea"
        value={formData.receipt_footer_text || ''}
        onChange={v => handleChange('receipt_footer_text', v)}
        placeholder="Thank you, come again!"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Advanced</h3>

      <FormField
        label="Custom CSS"
        type="textarea"
        value={formData.custom_css || ''}
        onChange={v => handleChange('custom_css', v)}
        placeholder=".custom-class { color: blue; }"
        helperText="Advanced: Add custom CSS for additional styling"
      />
    </SettingsForm>
  );
}
