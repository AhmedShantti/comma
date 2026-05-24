# Quick Reference - Shifts Components

## 🎯 Main Page Usage
```tsx
// app/dashboard/shifts/page.tsx
import { useShifts } from '@/components/dashboard/shifts/hooks/useShifts';
import { ShiftHeader } from '@/components/dashboard/shifts/ShiftHeader';

export default function ShiftsPage() {
  const { shifts, activeShifts, currentShift, loading, totalPages, refresh } = useShifts({
    page: 1,
    statusFilter: '',
  });

  return (
    <div>
      <ShiftHeader
        currentShift={currentShift}
        onOpenShift={() => setModal('open')}
        onCloseShift={() => setModal('close')}
      />
    </div>
  );
}
```

## 📦 Import Paths
```typescript
// Types
import { Shift, User, ListResponse, ModalType, TabType } from '@/components/dashboard/shifts/types';

// Hooks
import { useShifts } from '@/components/dashboard/shifts/hooks/useShifts';

// Components
import { ShiftHeader } from '@/components/dashboard/shifts/ShiftHeader';
import { ShiftStats } from '@/components/dashboard/shifts/ShiftStats';
import { ShiftTabs } from '@/components/dashboard/shifts/ShiftTabs';
import { ShiftCard } from '@/components/dashboard/shifts/ShiftCard';
import { ShiftTable } from '@/components/dashboard/shifts/ShiftTable';
import { OpenShiftDialog } from '@/components/dashboard/shifts/OpenShiftDialog';
import { CloseShiftDialog } from '@/components/dashboard/shifts/CloseShiftDialog';
import { ShiftDetailsDialog } from '@/components/dashboard/shifts/ShiftDetailsDialog';
import { StatusBadge } from '@/components/dashboard/shifts/StatusBadge';
import { Modal } from '@/components/dashboard/shifts/Modal';
import { Input, Textarea } from '@/components/dashboard/shifts/Input';
import { EmptyState } from '@/components/dashboard/shifts/EmptyState';

// Utilities
import { formatCurrency, formatDate, timeAgo, duration, getShiftInitial, formatShiftId } from '@/components/dashboard/shifts/utils';

// Constants
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FILTER_MAP, FILTER_BUTTONS } from '@/components/dashboard/shifts/constants';

// API
import { shiftsApi } from '@/lib/api/shifts';
```

## 🔌 API Endpoints
```typescript
// All endpoints already include /api/v1 prefix
await shiftsApi.getAll(page: 1, limit: 10, status?: 'open' | 'closed')
await shiftsApi.current()                          // Get user's active shift
await shiftsApi.getActive()                        // Get all open shifts
await shiftsApi.getById(id: string)                // Get shift details
await shiftsApi.create(openingCash: number)        // Open new shift
await shiftsApi.close(closingCash: number, notes?: string) // Close shift
```

## 🎨 Common Patterns

### Styling with Constants
```typescript
// Always use COLORS constant
<div style={{ color: COLORS.text, background: COLORS.darkCard }}>
  Content
</div>

// Spacing scale
<div style={{ padding: `${SPACING.lg}px ${SPACING.xl}px` }}>
  Padded
</div>

// Font sizes
<p style={{ fontSize: FONT_SIZES.lg }}>Large text</p>
```

### Formatting
```typescript
// Currency
formatCurrency(1234.56)  // "1,234.56 SAR"

// Dates
formatDate('2026-05-24T10:30:00Z')  // "24 May 2026, 10:30"

// Time ago
timeAgo('2026-05-24T10:30:00Z')  // "2h ago"

// Duration
duration('2026-05-24T08:00:00Z', '2026-05-24T10:30:00Z')  // "2h 30m"
```

### Modal State Management
```typescript
const [modal, setModal] = useState<ModalType>(null);

// Opening modals
<button onClick={() => setModal('open')}>Open Shift</button>
<button onClick={() => setModal('close')}>Close Shift</button>
<button onClick={() => { setSelectedShift(s); setModal('details'); }}>Details</button>

// Rendering
{modal === 'open' && <OpenShiftDialog onClose={() => setModal(null)} onSuccess={() => setModal(null)} />}
{modal === 'close' && <CloseShiftDialog shift={currentShift} onClose={() => setModal(null)} />}
{modal === 'details' && <ShiftDetailsDialog shift={selectedShift} onClose={() => setModal(null)} />}
```

## 📋 Component Props Cheat Sheet

### ShiftHeader
```typescript
<ShiftHeader
  currentShift={Shift | null}
  onOpenShift={() => void}
  onCloseShift={() => void}
/>
```

### ShiftStats
```typescript
<ShiftStats shift={Shift | null} />
```

### ShiftTabs
```typescript
<ShiftTabs
  tab={'all' | 'active'}
  statusFilter={string}
  onTabChange={(newFilter: string, newTab: TabType) => void}
/>
```

### ShiftCard
```typescript
<ShiftCard
  shift={Shift}
  onClick={() => void}
/>
```

### ShiftTable
```typescript
<ShiftTable
  shifts={Shift[]}
  loading={boolean}
  onRowClick={(shift: Shift) => void}
  currentPage={number}
  totalPages={number}
  onPageChange={(page: number) => void}
/>
```

### Dialogs
```typescript
<OpenShiftDialog
  onClose={() => void}
  onSuccess={() => void}
/>

<CloseShiftDialog
  shift={Shift}
  onClose={() => void}
  onSuccess={() => void}
/>

<ShiftDetailsDialog
  shift={Shift}
  onClose={() => void}
/>
```

## 🚀 Performance Tips

1. **Use useCallback** for event handlers to prevent unnecessary renders
```typescript
const handleTabChange = useCallback((newFilter, newTab) => {
  setStatusFilter(newFilter);
  setTab(newTab);
}, []);
```

2. **Use useMemo** for derived calculations
```typescript
const diff = useMemo(() => 
  shift.closing_cash ? shift.closing_cash - shift.opening_cash : null,
  [shift.closing_cash, shift.opening_cash]
);
```

3. **Refresh data after success**
```typescript
const { refresh } = useShifts();
const handleSuccess = () => {
  refresh();  // Refetch data
};
```

## 🐛 Common Issues & Fixes

### Issue: API returning 404
**Cause:** Endpoint prefix mismatch
**Solution:** All endpoints already fixed in `lib/api/shifts.ts`

### Issue: Modal not closing
**Cause:** Not clearing selected shift state
**Solution:** 
```typescript
const handleClose = () => {
  setModal(null);
  setSelectedShift(null);
};
```

### Issue: Data not updating after action
**Cause:** Not calling refresh()
**Solution:**
```typescript
const handleSuccess = () => {
  setModal(null);
  refresh();  // Refetch data
};
```

### Issue: Types not imported
**Cause:** Wrong import path
**Solution:** Import from `@/components/dashboard/shifts/types`

## 📝 Testing Example

```typescript
describe('useShifts', () => {
  it('should fetch shifts on mount', async () => {
    const { result } = renderHook(() => useShifts({ page: 1 }));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.shifts).toBeDefined();
    });
  });
});
```

## 🔗 File Dependencies

```
page.tsx
├── ShiftHeader
├── ShiftStats
├── ShiftTabs
├── ShiftCard (via ShiftTable)
├── ShiftTable
├── OpenShiftDialog
│   ├── Modal
│   ├── Input
│   └── shiftsApi
├── CloseShiftDialog
│   ├── Modal
│   ├── Input
│   ├── Textarea
│   └── shiftsApi
├── ShiftDetailsDialog
│   ├── Modal
│   ├── StatusBadge
│   └── utils
└── useShifts
    └── shiftsApi
```

## 🔐 Security Notes

- ✅ Token stored in localStorage (assumed secure)
- ✅ API URLs properly constructed with `/api/v1` prefix
- ✅ No sensitive data in logs
- ✅ Error messages don't leak backend details

## 📊 State Flow

```
useShifts (data fetching)
    ↓
page.tsx (state management)
    ├── ShiftHeader → onOpenShift/onCloseShift
    ├── ShiftStats → displays currentShift
    ├── ShiftTabs → filters shifts
    ├── ShiftCard/ShiftTable → displays shifts
    └── Dialogs → modals for actions
```

---

**Last Updated:** May 2026
**Component System:** React 19 + Next.js 15 + TypeScript
