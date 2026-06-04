# Receipt Feature - Testing Checklist

## Quick Start Testing (5 minutes)

### Prerequisites
- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:3001
- [ ] User logged in to POS system
- [ ] At least one table available
- [ ] At least one menu item available

### Basic Checkout Flow Test
```
1. Open Tables view
2. Click a table
3. Add 2-3 menu items to order
4. Verify subtotal, tax, and total calculate correctly
5. Click "Checkout" button
6. Select "Cash" payment method
7. Enter amount >= order total
8. Click "Confirm Payment"
9. ✅ Receipt modal should appear
```

---

## Detailed Testing Matrix

### Backend Endpoints

#### Test 1: GET /api/v1/orders/:id/receipt (Before Checkout)
```
URL: GET /api/v1/orders/{orderId}/receipt
Status: Should return 404 (no receipt yet)

curl -X GET http://localhost:3000/api/v1/orders/{orderId}/receipt \
  -H "Authorization: Bearer {token}"

Expected Response:
{
  "message": "Receipt not found for this order"
}
```

#### Test 2: POST /api/v1/orders/:id/checkout
```
URL: POST /api/v1/orders/{orderId}/checkout
Status: Should return 200 with receipt in response

curl -X POST http://localhost:3000/api/v1/orders/{orderId}/checkout \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "payments": [{"method": "cash", "amount": 1000}]
  }'

Expected Response:
{
  "success": true,
  "data": {
    "invoice": { /* invoice object */ },
    "change": 500,
    "receipt": {
      "id": "...",
      "receipt_number": "RCT-20260604-0001",
      "order_id": "{orderId}",
      "items": [...],
      "total": 500,
      ...
    }
  }
}
```

#### Test 3: GET /api/v1/orders/:id/receipt (After Checkout)
```
URL: GET /api/v1/orders/{orderId}/receipt
Status: Should return 200 with receipt data

curl -X GET http://localhost:3000/api/v1/orders/{orderId}/receipt \
  -H "Authorization: Bearer {token}"

Expected Response:
{
  "success": true,
  "data": {
    "id": "...",
    "receipt_number": "RCT-20260604-0001",
    "order_number": "ORD-20260604-001",
    "table_number": 5,
    "subtotal": 500.00,
    "discount_amount": 0,
    "tax_rate": 15,
    "tax_amount": 75.00,
    "total": 575.00,
    "payment_method": "cash",
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

### Frontend Modal Display

#### Test 4: Receipt Modal Appears After Checkout
```
Steps:
1. Add items to order
2. Click Checkout
3. Select Cash, enter amount
4. Click Confirm Payment
5. Wait for API response

Check:
✅ Receipt modal appears
✅ Receipt number displays correctly
✅ Order number displays
✅ Table number displays (if applicable)
✅ Cashier name displays
✅ Date/time shows current date
✅ All items listed with quantities and prices
✅ Subtotal displays
✅ Tax displays with percentage
✅ Total displays in gold color
✅ Payment method shows (CASH, CARD, WALLET)
```

#### Test 5: Receipt Modal Data Accuracy
```
For an order with:
- 2x Coffee @ 150 each = 300
- 1x Pastry @ 100 = 100
- Subtotal: 400
- Tax (15%): 60
- Discount: 0
- Total: 460

Receipt should show:
✅ Item 1: Coffee, Qty 2, Price 150.00, Total 300.00
✅ Item 2: Pastry, Qty 1, Price 100.00, Total 100.00
✅ Subtotal: 400.00
✅ Tax (15%): 60.00
✅ Total: 460.00
```

#### Test 6: Receipt Modal with Discount
```
Setup: Create order with discount applied

Expected:
✅ Discount line shows between subtotal and tax
✅ Discount amount shows as negative (red text)
✅ Total includes discount deduction
✅ Calculation: Subtotal - Discount + Tax = Total
```

#### Test 7: Print Button Functionality
```
Steps:
1. Open receipt modal
2. Click "Print" button
3. Wait for print dialog

Check:
✅ Print dialog opens
✅ Print preview shows receipt only
✅ No UI elements (navbar, sidebar, buttons) visible
✅ Receipt fits on page
✅ Text is readable
✅ All data visible in preview
✅ Can select printer and print
✅ Preview closes after cancel or print
```

#### Test 8: PDF Export Button
```
Steps:
1. Open receipt modal
2. Click "PDF" button
3. Check downloads folder

Check:
✅ File downloads automatically
✅ Filename format: receipt-RCT-YYYYMMDD-XXXX.html
✅ File can be opened in browser
✅ Layout matches print preview
✅ All data present
✅ Can save as PDF using browser "Save as PDF" option
```

#### Test 9: Done Button
```
Steps:
1. Open receipt modal
2. Click "Done" button

Check:
✅ Receipt modal closes
✅ Order panel closes
✅ Returns to Tables view
✅ Table status shows "available" (not occupied)
✅ No console errors
```

---

### Edge Cases

#### Test 10: Order with No Discount
```
Create order without discount

Check:
✅ Receipt generates successfully
✅ Discount line does NOT appear on receipt
✅ Total = Subtotal + Tax
```

#### Test 11: Order with Service Charge
```
Create order with service charge (if applicable)

Check:
✅ Service charge displays on receipt
✅ Shows percentage and amount
✅ Total includes service charge
```

#### Test 12: Voided Items
```
Setup: Create order, void one item, then checkout

Check:
✅ Only non-voided items appear on receipt
✅ Receipt total matches only active items
✅ Voided items completely excluded
```

#### Test 13: Multiple Receipts Same Day
```
Steps:
1. Complete first checkout → Receipt RCT-20260604-0001
2. Complete second checkout → Receipt RCT-20260604-0002

Check:
✅ Receipt numbers increment correctly
✅ Each receipt has unique number
✅ No duplicate numbers
```

#### Test 14: Very Large Order
```
Create order with 20+ items

Check:
✅ Receipt modal scrolls properly
✅ All items visible
✅ Calculation correct
✅ Performance acceptable
```

#### Test 15: Special Characters in Item Names
```
Create menu item with: áéíóú, café, café au lait, 中文

Check:
✅ Characters display correctly in receipt
✅ No encoding issues
✅ Print shows correct characters
```

---

### Database Verification

#### Test 16: Receipt Created in Database
```
After checkout, query database:

SELECT * FROM receipts WHERE order_id = '{orderId}';

Check:
✅ Receipt record exists
✅ receipt_number is unique
✅ order_id matches
✅ All financial fields populated
✅ payment_method recorded
✅ created_at timestamp correct
```

#### Test 17: Receipt Items Created
```
SELECT * FROM receipt_items WHERE receipt_id = '{receiptId}';

Check:
✅ All order items exist in receipt_items
✅ item_name_en and item_name_ar populated
✅ quantity correct
✅ unit_price correct
✅ line_total correct (unit_price * quantity)
✅ Voided items NOT included
```

---

### Error Handling

#### Test 18: No Receipt Exists
```
Create order, try to get receipt without checkout

GET /api/v1/orders/{orderId}/receipt

Check:
✅ Returns 404 Not Found
✅ Error message: "Receipt not found for this order"
✅ Frontend handles error gracefully (no crash)
```

#### Test 19: Invalid Order ID
```
GET /api/v1/orders/invalid-id/receipt

Check:
✅ Returns 404 Not Found
✅ No security leak (same error as real missing receipt)
```

#### Test 20: Unauthorized Request
```
GET /api/v1/orders/{orderId}/receipt
(without Authorization header)

Check:
✅ Returns 401 Unauthorized
✅ Message prompts login
```

---

### Payment Methods

#### Test 21: Cash Payment
```
Payment Method: Cash
Amount: >= Order Total

Check:
✅ Receipt shows "CASH"
✅ Change calculation correct
✅ Receipt modal displays
```

#### Test 22: Card Payment
```
Payment Method: Card
Amount: >= Order Total

Check:
✅ Receipt shows "CARD"
✅ Payment successful
✅ Receipt modal displays
```

#### Test 23: Wallet Payment
```
Payment Method: Wallet
Amount: >= Order Total

Check:
✅ Receipt shows "WALLET"
✅ Payment successful
✅ Receipt modal displays
```

---

### Browser Compatibility

#### Test 24: Chrome/Chromium
```
Check:
✅ Receipt displays correctly
✅ Print dialog works
✅ PDF download works
✅ No console errors
✅ No layout issues
```

#### Test 25: Firefox
```
Check:
✅ Receipt displays correctly
✅ Print dialog works
✅ PDF download works
✅ No console errors
```

#### Test 26: Safari
```
Check:
✅ Receipt displays correctly
✅ Print dialog works
✅ PDF download works
```

---

### Performance

#### Test 27: Receipt Generation Speed
```
Measure time from clicking "Confirm Payment" to receipt modal appearing

Target: < 2 seconds (backend + frontend rendering)

Check:
✅ No noticeable delay
✅ User receives immediate feedback
✅ Loading/processing state shown
```

#### Test 28: Large Receipt Rendering
```
Create order with 50 items

Check:
✅ Modal renders without lag
✅ Scrolling is smooth
✅ No jank or stutter
```

---

## Test Result Recording Template

```markdown
### Test Execution: [DATE]

Tester: ________________
Backend Version: ________________
Frontend Version: ________________
Database: ________________

#### Results

| Test # | Name | Status | Notes |
|--------|------|--------|-------|
| 1 | Before Checkout Endpoint | ☐ PASS ☐ FAIL | |
| 2 | Checkout Response | ☐ PASS ☐ FAIL | |
| 3 | After Checkout Endpoint | ☐ PASS ☐ FAIL | |
| 4 | Modal Appears | ☐ PASS ☐ FAIL | |
| 5 | Data Accuracy | ☐ PASS ☐ FAIL | |
| 6 | With Discount | ☐ PASS ☐ FAIL | |
| 7 | Print Button | ☐ PASS ☐ FAIL | |
| 8 | PDF Export | ☐ PASS ☐ FAIL | |
| 9 | Done Button | ☐ PASS ☐ FAIL | |
| 10 | No Discount | ☐ PASS ☐ FAIL | |
| ... | ... | ... | |

#### Summary
- Total Tests: 28
- Passed: ___
- Failed: ___
- Pass Rate: ___%

#### Issues Found
1. [Issue description]
   - Severity: Critical/High/Medium/Low
   - Steps to reproduce: [...]
   - Expected: [...]
   - Actual: [...]

#### Sign-Off
- [ ] All critical issues resolved
- [ ] All tests passing
- [ ] Ready for production

Signed: ________________ Date: ________
```

---

## Quick Reference

### Most Important Tests
1. **Test 4:** Receipt Modal Appears - If this fails, feature is broken
2. **Test 2:** Checkout Response - Confirms backend integration
3. **Test 7:** Print Button - Confirms print functionality
4. **Test 8:** PDF Export - Confirms export functionality
5. **Test 16:** Database Receipt - Confirms data persistence

### Red Flags to Watch For
- ❌ Receipt modal doesn't appear after checkout
- ❌ Receipt data is incomplete or wrong
- ❌ Print dialog doesn't open or shows nothing
- ❌ PDF export downloads with wrong format
- ❌ Console errors during checkout
- ❌ Database records not created
- ❌ Receipt number duplicates

### Success Criteria
- ✅ Receipt modal appears within 2 seconds of checkout
- ✅ All order data displays correctly
- ✅ Print produces usable output
- ✅ PDF export works
- ✅ No console errors
- ✅ Database records created
- ✅ All financial calculations correct

---

