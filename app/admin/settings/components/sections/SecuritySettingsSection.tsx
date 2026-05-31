'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface SecuritySettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function SecuritySettingsSection({ settings, onSave, error }: SecuritySettingsSectionProps) {
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
      title="Security Settings"
      description="Configure security measures and access controls"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
      hasChanges={hasChanges}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>IP Security</h3>

      <FormField
        label="Enable IP Whitelist"
        type="checkbox"
        value={formData.ip_whitelist_enabled || false}
        onChange={v => handleChange('ip_whitelist_enabled', v)}
        helperText="Only allow access from specified IP addresses"
      />

      {formData.ip_whitelist_enabled && (
        <FormField
          label="Whitelisted IPs (one per line)"
          type="textarea"
          value={(formData.ip_whitelist || []).join('\n')}
          onChange={v => handleChange('ip_whitelist', v.split('\n').filter((ip: string) => ip.trim()))}
          placeholder="192.168.1.1&#10;10.0.0.0/8"
        />
      )}

      <FormField
        label="Enable IP Blacklist"
        type="checkbox"
        value={formData.ip_blacklist_enabled || false}
        onChange={v => handleChange('ip_blacklist_enabled', v)}
        helperText="Block access from specified IP addresses"
      />

      {formData.ip_blacklist_enabled && (
        <FormField
          label="Blacklisted IPs (one per line)"
          type="textarea"
          value={(formData.ip_blacklist || []).join('\n')}
          onChange={v => handleChange('ip_blacklist', v.split('\n').filter((ip: string) => ip.trim()))}
          placeholder="192.168.1.100&#10;10.0.0.50"
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>HTTPS & Protocol</h3>

      <FormField
        label="Enforce HTTPS Only"
        type="checkbox"
        value={formData.enforce_https_only || false}
        onChange={v => handleChange('enforce_https_only', v)}
        helperText="Redirect all HTTP traffic to HTTPS"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>CORS Settings</h3>

      <FormField
        label="Enable CORS"
        type="checkbox"
        value={formData.cors_enabled !== false}
        onChange={v => handleChange('cors_enabled', v)}
        helperText="Allow cross-origin requests from specified domains"
      />

      {formData.cors_enabled && (
        <FormField
          label="CORS Origins (one per line)"
          type="textarea"
          value={(formData.cors_origins || []).join('\n')}
          onChange={v => handleChange('cors_origins', v.split('\n').filter((origin: string) => origin.trim()))}
          placeholder="https://example.com&#10;https://app.example.com"
        />
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Protection</h3>

      <FormField
        label="Enable CSRF Protection"
        type="checkbox"
        value={formData.csrf_protection_enabled !== false}
        onChange={v => handleChange('csrf_protection_enabled', v)}
        helperText="Protect against Cross-Site Request Forgery attacks"
      />

      <FormField
        label="Enable Audit Logging"
        type="checkbox"
        value={formData.audit_logging_enabled !== false}
        onChange={v => handleChange('audit_logging_enabled', v)}
        helperText="Log all administrative actions for compliance"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Data Protection</h3>

      <FormField
        label="Enable Data Encryption"
        type="checkbox"
        value={formData.data_encryption_enabled !== false}
        onChange={v => handleChange('data_encryption_enabled', v)}
        helperText="Encrypt sensitive data at rest"
      />

      <FormField
        label="Audit Log Retention (days)"
        type="number"
        value={formData.audit_log_retention_days || 365}
        onChange={v => handleChange('audit_log_retention_days', v)}
        placeholder="365"
      />

      <FormField
        label="Suspicious Activity Threshold"
        type="number"
        value={formData.suspicious_activity_threshold || 5}
        onChange={v => handleChange('suspicious_activity_threshold', v)}
        placeholder="5"
        helperText="Number of failed login attempts before alerting"
      />
    </SettingsForm>
  );
}
