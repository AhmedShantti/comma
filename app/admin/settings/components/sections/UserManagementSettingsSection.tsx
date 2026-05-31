'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface UserManagementSettingsSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function UserManagementSettingsSection({ settings, onSave, error }: UserManagementSettingsSectionProps) {
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
      title="User Management"
      description="Configure password policies, session settings, and security requirements"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Password Policy</h3>

      <FormField
        label="Minimum Password Length"
        type="number"
        value={formData.password_min_length || 8}
        onChange={v => handleChange('password_min_length', v)}
        placeholder="8"
      />

      <FormField
        label="Require Uppercase Letters"
        type="checkbox"
        value={formData.password_require_uppercase || false}
        onChange={v => handleChange('password_require_uppercase', v)}
        helperText="Password must contain at least one uppercase letter (A-Z)"
      />

      <FormField
        label="Require Numbers"
        type="checkbox"
        value={formData.password_require_numbers || false}
        onChange={v => handleChange('password_require_numbers', v)}
        helperText="Password must contain at least one number (0-9)"
      />

      <FormField
        label="Require Special Characters"
        type="checkbox"
        value={formData.password_require_special_chars || false}
        onChange={v => handleChange('password_require_special_chars', v)}
        helperText="Password must contain special characters (!@#$%^&*)"
      />

      <FormField
        label="Require Password Reset (days)"
        type="number"
        value={formData.require_password_reset_days || 90}
        onChange={v => handleChange('require_password_reset_days', v)}
        placeholder="90"
        helperText="Force password change after this many days (0 to disable)"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Session Settings</h3>

      <FormField
        label="Session Timeout (minutes)"
        type="number"
        value={formData.session_timeout_minutes || 30}
        onChange={v => handleChange('session_timeout_minutes', v)}
        placeholder="30"
        helperText="Automatically logout inactive users"
      />

      <FormField
        label="Require Two-Factor Authentication"
        type="checkbox"
        value={formData.require_2fa || false}
        onChange={v => handleChange('require_2fa', v)}
        helperText="All users must enable 2FA for their accounts"
      />

      <FormField
        label="Enable Email Login"
        type="checkbox"
        value={formData.enable_email_login !== false}
        onChange={v => handleChange('enable_email_login', v)}
        helperText="Allow users to login with email instead of username"
      />

      <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '16px', fontWeight: '600' }}>Account Management</h3>

      <FormField
        label="Auto-Disable Inactive Users (days)"
        type="number"
        value={formData.auto_disable_inactive_users_days || 90}
        onChange={v => handleChange('auto_disable_inactive_users_days', v)}
        placeholder="90"
        helperText="Automatically disable accounts inactive for this many days"
      />

      <FormField
        label="Allow Account Lockout"
        type="checkbox"
        value={formData.allow_account_lockout !== false}
        onChange={v => handleChange('allow_account_lockout', v)}
        helperText="Lock accounts after multiple failed login attempts"
      />

      <FormField
        label="Failed Login Attempts Before Lockout"
        type="number"
        value={formData.max_failed_login_attempts || 5}
        onChange={v => handleChange('max_failed_login_attempts', v)}
        placeholder="5"
      />

      <FormField
        label="Account Lockout Duration (minutes)"
        type="number"
        value={formData.account_lockout_duration_minutes || 30}
        onChange={v => handleChange('account_lockout_duration_minutes', v)}
        placeholder="30"
      />
    </SettingsForm>
  );
}
