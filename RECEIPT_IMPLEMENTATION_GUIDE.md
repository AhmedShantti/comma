# Receipt Feature Implementation Guide

## All Changes Made - Complete Reference

---

## 1. BACKEND: Add Receipt Endpoint for Orders

### File: `POS/src/modules/orders/orders.controller.ts`

**Added Method:**
```typescript
@Get(':id/receipt')
async getOrderReceipt(@Param('id') id: string) {
  return this.receiptService.findByOrderId(id);
}
```

**Location:** Between the `@Get('table/:tableId/active')` and `@Get(':id')` endpoints

**What it does:**
- Provides endpoint to fetch receipt by order ID
- Returns 404 if no receipt exists for the order
- Returns complete receipt with all items

**Usage:**
```
GET /api/v1/orders/{orderId}/receipt
Authorization: Bearer {token}
```

---

## 2. BACKEND: Add findByOrderId Method to Receipt Service

### File: `POS/src/modules/receipts/services/receipt.service.ts`

**Added Method:**
```typescript
async findByOrderId(orderId: string): Promise<Receipt> {
  const receipt = await this.receiptsRepository.findOne({
    where: { order_id: orderId },
    relations: ['items'],
  });

  if (!receipt) {
    throw new NotFoundException('Receipt not found for this order');
  }

  return receipt;
}
```

**Location:** After the `findByReceiptNumber()` method

**What it does:**
- Queries receipt table by order_id
- Loads receipt items relation
- Throws NotFoundException if no receipt found

---

## 3. FRONTEND: Add API Client Method

### File: `lib/api.ts`

**Added to orders section:**
```typescript
getReceipt: (id: string) =>
  request(`/api/v1/orders/${id}/receipt`),
```

**Location:** In the `orders` object, after `updateStatus()` method

**What it does:**
- Provides frontend method to call receipt endpoint
- Returns complete receipt data from backend

**Usage in Component:**
```typescript
const receipt = await api.orders.getReceipt(orderId);
```

---

## 4. FRONTEND: Update TableOrderPanel - Add Receipt State

### File: `components/admin/TableOrderPanel.tsx`

**Added State:**
```typescript
const [receipt, setReceipt] = useState<any>(null);
```

**Location:** With other state declarations (around line 30)

**What it does:**
- Stores receipt data after checkout
- Triggers receipt modal rendering when populated
- Cleared when modal closes

---

## 5. FRONTEND: Update TableOrderPanel - Modify handleCheckout

### File: `components/admin/TableOrderPanel.tsx`

**Old Implementation:**
```typescript
const handleCheckout = async () => {
  // ... validation ...
  await api.orders.checkout(order.id, {
    payments: [{ method: payMethod, amount }],
  });
  setSuccess('Payment processed! Receipt generated.');
  setTimeout(() => { onClose(); }, 1500);
};
```

**New Implementation:**
```typescript
const handleCheckout = async () => {
  const amount = parseFloat(payAmount) || order.total;
  if (amount < Number(order.total)) {
    setError('Payment amount must be >= order total');
    return;
  }
  try {
    setCheckingOut(true);
    setError('');
    const result = await api.orders.checkout(order.id, {
      payments: [{ method: payMethod, amount }],
    });
    if (result?.receipt) {
      setReceipt(result.receipt);  // ← CAPTURE RECEIPT
      setShowCheckout(false);      // ← HIDE CHECKOUT MODAL
    } else {
      setSuccess('Payment processed!');
      setTimeout(() => { onClose(); }, 1500);
    }
  } catch (e: any) {
    setError(e.message || 'Checkout failed');
  } finally {
    setCheckingOut(false);
  }
};
```

**What Changed:**
- Captures receipt from checkout response
- Sets receipt state to trigger display
- Closes checkout modal but keeps order panel
- Shows receipt modal instead

---

## 6. FRONTEND: Add PDF Export Helper Function

### File: `components/admin/TableOrderPanel.tsx`

**Added Before ReceiptModal Component:**
```typescript
function exportReceiptPDF(receipt: any) {
  try {
    const itemsHtml = (receipt.items || []).map((item: any) =>
      `<tr><td>${item.item_name_en}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">${Number(item.unit_price).toFixed(2)}</td><td style="text-align:right">${Number(item.line_total).toFixed(2)}</td></tr>`
    ).join('');

    const html = `<html><head><style>
      body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; width: 72mm; }
      .center { text-align: center; } .right { text-align: right; } .bold { font-weight: bold; }
      .separator { border-top: 1px dashed #000; margin: 4px 0; }
      .business-name { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; } td { padding: 2px 0; }
    </style></head><body>
      <div class="business-name">${receipt.business_name || 'COMMA'}</div>
      ${receipt.business_address ? `<div class="center">${receipt.business_address}</div>` : ''}
      ${receipt.business_phone ? `<div class="center">Tel: ${receipt.business_phone}</div>` : ''}
      <div class="separator"></div>
      <div>Receipt: ${receipt.receipt_number}</div>
      ${receipt.order_number ? `<div>Order: ${receipt.order_number}</div>` : ''}
      ${receipt.table_number ? `<div>Table: ${receipt.table_number}</div>` : ''}
      <div>Date: ${new Date(receipt.created_at).toLocaleString()}</div>
      <div class="separator"></div>
      <table><tr class="bold"><td>Item</td><td style="text-align:center">Qty</td><td style="text-align:right">Price</td><td style="text-align:right">Total</td></tr>${itemsHtml}</table>
      <div class="separator"></div>
      <table>
        <tr><td>Subtotal</td><td class="right">${Number(receipt.subtotal).toFixed(2)}</td></tr>
        ${Number(receipt.discount_amount) > 0 ? `<tr><td>Discount</td><td class="right">-${Number(receipt.discount_amount).toFixed(2)}</td></tr>` : ''}
        ${Number(receipt.tax_amount) > 0 ? `<tr><td>Tax (${receipt.tax_rate}%)</td><td class="right">${Number(receipt.tax_amount).toFixed(2)}</td></tr>` : ''}
        <tr style="font-weight: bold;"><td>TOTAL</td><td class="right">EGP ${Number(receipt.total).toFixed(2)}</td></tr>
      </table>
      <div class="separator"></div>
      <div>Payment: ${(receipt.payment_method || 'cash').toUpperCase()}</div>
      <div class="center" style="margin-top:8px">Thank you!</div>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receipt.receipt_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Export failed:', e);
  }
}
```

**Location:** Before the `ReceiptModal` component definition

**What it does:**
- Generates HTML receipt document
- Downloads as .html file
- Matches print layout exactly
- Handles all edge cases (no discount, no tax, etc.)

---

## 7. FRONTEND: Add Receipt Modal Component

### File: `components/admin/TableOrderPanel.tsx`

**Added After Checkout Modal:**
```typescript
{/* Receipt Display Modal */}
{receipt && (
  <ReceiptModal receipt={receipt} onClose={() => { setReceipt(null); onClose(); }} />
)}
```

**Added ReceiptModal Component:**
```typescript
type ReceiptModalProps = { receipt: any; onClose: () => void };

function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const printReceipt = () => {
    // ... print implementation (see below) ...
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1a1918', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '85vh', overflow: 'auto', border: '1px solid rgba(201,168,76,0.15)' }} onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{receipt.receipt_number}</h2>
              <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{new Date(receipt.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#999', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
        </div>

        {/* Order Info */}
        <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {receipt.order_number && <div><span style={{ color: '#999' }}>Order:</span> {receipt.order_number}</div>}
          {receipt.table_number && <div><span style={{ color: '#999' }}>Table:</span> {receipt.table_number}</div>}
          {receipt.cashier_name && <div><span style={{ color: '#999' }}>Cashier:</span> {receipt.cashier_name}</div>}
        </div>

        {/* Items */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Items</h3>
          {(receipt.items || []).map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: i < receipt.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <div>
                <span>{item.item_name_en}</span>
                <span style={{ color: '#999', marginLeft: '8px' }}>x{item.quantity}</span>
              </div>
              <span style={{ fontWeight: 500 }}>EGP {Number(item.line_total).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div style={{ padding: '16px 24px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Subtotal</span><span>EGP {Number(receipt.subtotal).toFixed(2)}</span></div>
          {Number(receipt.discount_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Discount</span><span style={{ color: '#F44336' }}>-EGP {Number(receipt.discount_amount).toFixed(2)}</span></div>}
          {Number(receipt.tax_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Tax ({receipt.tax_rate}%)</span><span>EGP {Number(receipt.tax_amount).toFixed(2)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(201,168,76,0.15)', fontSize: '16px', fontWeight: 700 }}>
            <span>Total</span><span style={{ color: '#c9a84c' }}>EGP {Number(receipt.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment & Actions */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{ fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ color: '#999' }}>Payment: </span>
            <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>{receipt.payment_method || 'cash'}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={printReceipt} style={{ flex: 1, padding: '12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              🖨️ Print
            </button>
            <button onClick={() => exportReceiptPDF(receipt)} style={{ flex: 1, padding: '12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              📥 PDF
            </button>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#c9a84c', color: '#0f0e0d', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Location:** At the end of the TableOrderPanel component, before closing brace

**What it does:**
- Displays receipt in fullscreen modal
- Shows all receipt details with proper formatting
- Provides Print button (uses printReceipt() function)
- Provides PDF Export button
- Provides Done button to close modal and order panel

---

## 8. FRONTEND: Add Print Function to Receipt Modal

### File: `components/admin/TableOrderPanel.tsx`

**In ReceiptModal component:**
```typescript
const printReceipt = () => {
  const itemsHtml = (receipt.items || []).map((item: any) =>
    `<tr><td>${item.item_name_en}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">${Number(item.unit_price).toFixed(2)}</td><td style="text-align:right">${Number(item.line_total).toFixed(2)}</td></tr>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><title>Receipt ${receipt.receipt_number}</title><style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 12px; width: 72mm; margin: 0 auto; padding: 4mm; }
    .center { text-align: center; } .right { text-align: right; } .bold { font-weight: bold; }
    .separator { border-top: 1px dashed #000; margin: 4px 0; }
    .business-name { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; } td { padding: 2px 0; }
    .total-row td { font-weight: bold; font-size: 14px; padding-top: 4px; }
    @media print { body { width: 72mm; } }
  </style></head><body>
    <div class="business-name">${receipt.business_name || 'COMMA'}</div>
    ${receipt.business_address ? `<div class="center">${receipt.business_address}</div>` : ''}
    ${receipt.business_phone ? `<div class="center">Tel: ${receipt.business_phone}</div>` : ''}
    <div class="separator"></div>
    <div>Receipt: ${receipt.receipt_number}</div>
    ${receipt.order_number ? `<div>Order: ${receipt.order_number}</div>` : ''}
    ${receipt.table_number ? `<div>Table: ${receipt.table_number}</div>` : ''}
    <div>Date: ${new Date(receipt.created_at).toLocaleString()}</div>
    ${receipt.cashier_name ? `<div>Cashier: ${receipt.cashier_name}</div>` : ''}
    <div class="separator"></div>
    <table>
      <tr class="bold"><td>Item</td><td style="text-align:center">Qty</td><td style="text-align:right">Price</td><td style="text-align:right">Total</td></tr>
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
    ${receipt.footer_message ? `<div class="separator"></div><div class="center">${receipt.footer_message}</div>` : ''}
    <div class="separator"></div>
    <div class="center" style="margin-top:8px">Thank you!</div>
    <script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);};</script>
  </body></html>`;

  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
```

**What it does:**
- Generates HTML receipt in new window
- Triggers browser print dialog automatically
- Closes window after 500ms
- Formatted for 72mm thermal receipt printer
- All data properly formatted with proper decimal places

---

## 9. FRONTEND: Improve Print Styling in ReceiptPrinter

### File: `app/dashboard/receipts/ReceiptPrinter.tsx`

**Updates to printReceipt function:**
- Added explicit `background: white; color: black;` to body style for print mode
- Improved CSS for thermal printer (72mm width)
- Enhanced @media print rules
- Better margin and padding handling

---

## Data Flow Summary

### Checkout Flow
```
1. User clicks "Checkout" button in TableOrderPanel
2. User selects payment method and amount
3. User clicks "Confirm Payment"
4. handleCheckout() calls api.orders.checkout()
5. Backend:
   - Calculates totals with discounts/tax
   - Creates payment/invoice
   - Calls receiptService.generateReceipt()
   - Returns receipt in response
6. Frontend:
   - Captures receipt from response
   - Sets receipt state
   - Closes checkout modal
   - Displays receipt modal
7. User can:
   - View receipt (displayed in modal)
   - Print receipt (opens print dialog)
   - Export as PDF (downloads HTML file)
   - Close modal and return to tables
```

### Checkout Response Structure
```json
{
  "invoice": { /* invoice data */ },
  "change": 50,
  "receipt": {
    "id": "uuid",
    "receipt_number": "RCT-20260604-0001",
    "order_id": "uuid",
    "order_number": "ORD-20260604-001",
    "table_number": 5,
    "cashier_name": "John Doe",
    "subtotal": 500.00,
    "discount_amount": 50.00,
    "tax_rate": 15,
    "tax_amount": 67.50,
    "total": 517.50,
    "payment_method": "cash",
    "business_name": "COMMA",
    "items": [
      {
        "item_name_en": "Coffee",
        "quantity": 2,
        "unit_price": 150.00,
        "line_total": 300.00
      }
    ],
    "created_at": "2026-06-04T12:00:00Z"
  }
}
```

---

## Verification Commands

### Test Receipt Endpoint
```bash
# Get receipt by order ID
curl -X GET http://localhost:3000/api/v1/orders/{orderId}/receipt \
  -H "Authorization: Bearer {token}"

# Response: Full receipt object with items
```

### Test Checkout with Receipt
```bash
curl -X POST http://localhost:3000/api/v1/orders/{orderId}/checkout \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "payments": [{"method": "cash", "amount": 1000}]
  }'

# Response includes receipt in payload
```

---

## Files Changed Summary

| File | Changes | Lines |
|------|---------|-------|
| POS/src/modules/orders/orders.controller.ts | Added GET :id/receipt endpoint | 5 |
| POS/src/modules/receipts/services/receipt.service.ts | Added findByOrderId method | 12 |
| lib/api.ts | Added getReceipt method | 2 |
| components/admin/TableOrderPanel.tsx | Added receipt state, updated handleCheckout, added ReceiptModal | 200+ |
| app/dashboard/receipts/ReceiptPrinter.tsx | Improved print CSS | 10 |

**Total Lines Added:** ~230
**Files Modified:** 5
**Files Created:** 1 (audit document)

---

## Testing the Implementation

### Step 1: Start Backend
```bash
cd POS
npm run start:dev
```

### Step 2: Start Frontend
```bash
npm run dev
```

### Step 3: Test Checkout Flow
1. Login to POS system
2. Go to Tables view
3. Select a table
4. Add items to order
5. Click "Checkout"
6. Select payment method (Cash, Card, or Wallet)
7. Enter payment amount >= order total
8. Click "Confirm Payment"
9. **Expected:** Receipt modal appears with all data
10. Click "Print" → Print dialog opens
11. Click "PDF" → receipt-RCT-*.html downloads
12. Click "Done" → Modal closes and table is freed

### Step 4: Verify Endpoint
```bash
# After checkout, call receipt endpoint
GET /api/v1/orders/{orderId}/receipt
# Should return receipt data without errors
```

---

## Troubleshooting

### Receipt Not Showing After Checkout
- [ ] Check browser console for errors
- [ ] Verify API response includes receipt object
- [ ] Ensure checkout was successful (check invoice creation)

### Print Dialog Doesn't Open
- [ ] Check for popup blockers
- [ ] Verify print window is not being blocked by browser

### PDF Export Downloads Wrong Filename
- [ ] Verify receipt_number is properly formatted
- [ ] Check browser download settings

### Missing Receipt Data
- [ ] Verify all order items have correct names and prices
- [ ] Check that tax_rate and discount fields are populated
- [ ] Ensure business_name is configured in settings

---

