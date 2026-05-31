'use client';

import { useState } from 'react';
import { SettingsForm } from '../SettingsForm';
import { FormField } from '../FormField';

interface OrderWorkflowSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  error?: string | null;
}

export function OrderWorkflowSection({ settings, onSave, error }: OrderWorkflowSectionProps) {
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(settings || {});
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [newStatus, setNewStatus] = useState({ name: '', displayColor: '#FFB800' });

  const statuses = formData.statuses || [];

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomStatus = async () => {
    if (!newStatus.name.trim()) return;

    const customStatus = {
      id: `custom-${Date.now()}`,
      name: newStatus.name,
      displayColor: newStatus.displayColor,
      order: Math.max(...statuses.map((s: any) => s.order || 0)) + 1,
      isTerminal: false,
      isPredefined: false,
    };

    const updatedStatuses = [...statuses, customStatus];
    setFormData((prev: any) => ({ ...prev, statuses: updatedStatuses }));
    setNewStatus({ name: '', displayColor: '#FFB800' });
    setShowAddStatus(false);
  };

  const handleDeleteCustomStatus = (statusId: string) => {
    const updatedStatuses = statuses.filter((s: any) => s.id !== statusId);
    setFormData((prev: any) => ({ ...prev, statuses: updatedStatuses }));
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
      title="Order Workflow"
      description="Manage order statuses and workflow configurations"
      onSubmit={handleSubmit}
      loading={saving}
      error={saveError || error}
      success={saveSuccess}
      hasChanges={hasChanges}
    >
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Order Statuses</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {statuses.map((status: any, idx: number) => (
            <div
              key={status.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: status.displayColor,
                    border: '1px solid #ccc',
                  }}
                />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{status.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {status.isPredefined ? '🔒 Predefined' : '✏️ Custom'} • {status.isTerminal ? 'Terminal' : 'In Progress'}
                  </div>
                </div>
              </div>
              {!status.isPredefined && (
                <button
                  onClick={() => handleDeleteCustomStatus(status.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#F44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {!showAddStatus ? (
        <button
          onClick={() => setShowAddStatus(true)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#c9a84c',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          + Add Custom Status
        </button>
      ) : (
        <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '6px', marginBottom: '24px', border: '1px solid #e0e0e0' }}>
          <FormField
            label="Status Name"
            type="text"
            value={newStatus.name}
            onChange={v => setNewStatus(prev => ({ ...prev, name: v }))}
            placeholder="e.g., Packaging"
          />
          <FormField
            label="Color"
            type="text"
            value={newStatus.displayColor}
            onChange={v => setNewStatus(prev => ({ ...prev, displayColor: v }))}
            placeholder="#FFB800"
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddCustomStatus}
              style={{
                padding: '10px 16px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Save Status
            </button>
            <button
              onClick={() => setShowAddStatus(false)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <FormField
        label="Enable Status Transitions"
        type="checkbox"
        value={formData.enable_status_transitions !== false}
        onChange={v => handleChange('enable_status_transitions', v)}
        helperText="Allow orders to move between statuses"
      />

      <FormField
        label="Allow Order Cancellation"
        type="checkbox"
        value={formData.allow_order_cancellation !== false}
        onChange={v => handleChange('allow_order_cancellation', v)}
        helperText="Allow cancelling orders at any status"
      />

      <FormField
        label="Auto-Complete Orders (minutes)"
        type="number"
        value={formData.auto_complete_orders_minutes || 0}
        onChange={v => handleChange('auto_complete_orders_minutes', v)}
        placeholder="0"
        helperText="Set to 0 to disable auto-completion"
      />
    </SettingsForm>
  );
}
