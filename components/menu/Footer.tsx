'use client';

import { useLang } from '../LangProvider';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-brand">C O M M A</span>
          <span className="footer-copy">{t('footer_copy')}</span>
        </div>
      </div>
    </footer>
  );
}
