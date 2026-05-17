'use client';

import { useLang } from '../LangProvider';

export function SettingsForm() {
  const { t } = useLang();
  return (
    <div className="section-card">
      <div className="section-head">
        <div>
          <div className="section-title">{t('settings')}</div>
          <div className="section-sub">{t('settings_sub')}</div>
        </div>
      </div>
      <div className="chart-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>{t('cafe_name')}</div>
          <input className="search-input" type="text" defaultValue={t('cafe_name_value')} style={{ paddingLeft: 16, paddingRight: 16 }} />
        </div>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>{t('location')}</div>
          <input className="search-input" type="text" defaultValue={t('location_value')} style={{ paddingLeft: 16, paddingRight: 16 }} />
        </div>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>{t('currency')}</div>
          <input className="search-input" type="text" defaultValue={t('egp')} style={{ paddingLeft: 16, paddingRight: 16 }} />
        </div>
        <div>
          <button className="btn-ghost" style={{ alignSelf: 'flex-start' }}>{t('save_changes')}</button>
        </div>
      </div>
    </div>
  );
}
