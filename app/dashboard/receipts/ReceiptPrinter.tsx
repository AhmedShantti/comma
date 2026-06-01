'use client';

import type { Receipt } from '@/lib/types';

export function printReceipt(receipt: Receipt, paperSize: '58mm' | '80mm' = '80mm') {
  const width = paperSize === '58mm' ? '48mm' : '72mm';
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) return;

  const itemsHtml = (receipt.items || []).map(item =>
    `<tr>
      <td style="text-align:left">${item.item_name_en}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">${Number(item.unit_price).toFixed(2)}</td>
      <td style="text-align:right">${Number(item.line_total).toFixed(2)}</td>
    </tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Receipt ${receipt.receipt_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      width: ${width};
      margin: 0 auto;
      padding: 4mm;
    }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }
    .separator { border-top: 1px dashed #000; margin: 4px 0; }
    .business-name { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 2px 0; }
    .total-row td { font-weight: bold; font-size: 14px; padding-top: 4px; }
    @media print { body { width: ${width}; } }
  </style>
</head>
<body>
  ${receipt.business_name ? `<div class="business-name">${receipt.business_name}</div>` : '<div class="business-name">COMMA</div>'}
  ${receipt.business_address ? `<div class="center">${receipt.business_address}</div>` : ''}
  ${receipt.business_phone ? `<div class="center">Tel: ${receipt.business_phone}</div>` : ''}
  ${receipt.tax_id ? `<div class="center">Tax ID: ${receipt.tax_id}</div>` : ''}
  <div class="separator"></div>
  <div>Receipt: ${receipt.receipt_number}</div>
  ${receipt.order_number ? `<div>Order: ${receipt.order_number}</div>` : ''}
  ${receipt.table_number ? `<div>Table: ${receipt.table_number}</div>` : ''}
  <div>Date: ${new (globalThis.Date as any)(receipt.created_at).toLocaleString()}</div>
  ${receipt.cashier_name ? `<div>Cashier: ${receipt.cashier_name}</div>` : ''}
  ${receipt.waiter_name ? `<div>Waiter: ${receipt.waiter_name}</div>` : ''}
  <div class="separator"></div>
  <table>
    <tr class="bold">
      <td>Item</td>
      <td style="text-align:center">Qty</td>
      <td style="text-align:right">Price</td>
      <td style="text-align:right">Total</td>
    </tr>
    ${itemsHtml}
  </table>
  <div class="separator"></div>
  <table>
    <tr><td>Subtotal</td><td class="right">${Number(receipt.subtotal).toFixed(2)}</td></tr>
    ${Number(receipt.discount_amount) > 0 ? `<tr><td>Discount</td><td class="right">-${Number(receipt.discount_amount).toFixed(2)}</td></tr>` : ''}
    ${Number(receipt.tax_amount) > 0 ? `<tr><td>Tax (${receipt.tax_rate}%)</td><td class="right">${Number(receipt.tax_amount).toFixed(2)}</td></tr>` : ''}
    ${Number(receipt.service_charge_amount) > 0 ? `<tr><td>Service (${receipt.service_charge_rate}%)</td><td class="right">${Number(receipt.service_charge_amount).toFixed(2)}</td></tr>` : ''}
    <tr class="total-row"><td>TOTAL</td><td class="right">EGP ${Number(receipt.total).toFixed(2)}</td></tr>
  </table>
  <div class="separator"></div>
  <div>Payment: ${(receipt.payment_method || 'cash').toUpperCase()}</div>
  <div>Status: ${(receipt.payment_status || 'paid').toUpperCase()}</div>
  ${receipt.footer_message ? `<div class="separator"></div><div class="center">${receipt.footer_message}</div>` : ''}
  <div class="separator"></div>
  <div class="center" style="margin-top:8px">Thank you!</div>
  <script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);};</script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
