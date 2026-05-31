'use client';

import React from 'react';

interface SettingsSidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const SECTIONS = [
  { id: 'business-info', label: '🏢 Business Information' },
  { id: 'restaurant-config', label: '🍽️ Restaurant Configuration' },
  { id: 'menu', label: '📋 Menu Settings' },
  { id: 'tables-qr', label: '🪑 Tables & QR Codes' },
  { id: 'order-workflow', label: '📊 Order Workflow' },
  { id: 'payments', label: '💳 Payment Settings' },
  { id: 'users', label: '👥 User Management' },
  { id: 'shifts', label: '⏰ Shift Rules' },
  { id: 'notifications', label: '🔔 Notifications' },
  { id: 'reports', label: '📈 Reports' },
  { id: 'appearance', label: '🎨 Appearance' },
  { id: 'security', label: '🔒 Security' },
  { id: 'monitoring', label: '📡 Monitoring' },
  { id: 'integrations', label: '🔗 Integrations' },
];

export function SettingsSidebar({ activeSection, onSelectSection }: SettingsSidebarProps) {
  return (
    <aside
      style={{
        width: '250px',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto',
        maxHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <nav style={{ padding: '16px 0' }}>
        {SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 20px',
              textAlign: 'left',
              border: 'none',
              background: activeSection === section.id ? '#f5f5f5' : 'transparent',
              borderLeft: activeSection === section.id ? '3px solid #c9a84c' : '3px solid transparent',
              color: activeSection === section.id ? '#000' : '#666',
              fontWeight: activeSection === section.id ? 500 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (activeSection !== section.id) {
                (e.currentTarget as HTMLElement).style.background = '#fafafa';
              }
            }}
            onMouseLeave={e => {
              if (activeSection !== section.id) {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
