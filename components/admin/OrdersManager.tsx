'use client';

import { useState } from 'react';
import { useLang } from '../LangProvider';
import { OrdersTable } from './OrdersTable';
import { AddOrderModal } from './AddOrderModal';

export function OrdersManager() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="orders-toolbar">
        <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
          + {t('add_order')}
        </button>
      </div>
      <OrdersTable />
      <AddOrderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
