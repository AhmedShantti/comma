# Shifts Dashboard Components

Complete refactored shifts management dashboard with clean architecture, proper TypeScript typing, and production-safe API integration.

## 📁 Structure

```
components/dashboard/shifts/
├── hooks/
│   └── useShifts.ts                  # Data fetching hook
├── OpenShiftDialog.tsx               # Modal: Open new shift
├── CloseShiftDialog.tsx              # Modal: Close active shift
├── ShiftDetailsDialog.tsx            # Modal: View shift details
├── ShiftHeader.tsx                   # Header: Title + action buttons
├── ShiftStats.tsx                    # Banner: Active shift info
├── ShiftTabs.tsx                     # Tabs: Filter by status
├── ShiftCard.tsx                     # Card: Active shift grid view
├── ShiftTable.tsx                    # Table: All shifts with pagination
├── StatusBadge.tsx                   # Badge: Status indicator
├── Modal.tsx                         # Base: Modal wrapper
├── Input.tsx                         # Inputs: Input & Textarea
├── EmptyState.tsx                    # Placeholder: Empty state
├── constants.ts                      # Design tokens
├── types.ts                          # TypeScript interfaces
└── utils.ts                          # Utilities: Formatters

lib/api/
└── shifts.ts                         # API client

app/dashboard/shifts/
└── page.tsx                          # Main page (87 LOC)
```

## 🎯 Component Reference

### Dialogs (Modals)

#### **OpenShiftDialog**
Opens a modal to create a new shift.
```tsx
<OpenShiftDialog
  onClose={() => setModal(null)}
  onSuccess={handleSuccess}
/>
```
- Input: Cash amount
- Validation: Required, positive number
- States: Loading, error
- API: `shiftsApi.create(amount)`

#### **CloseShiftDialog**
Closes the current active shift with optional notes.
```tsx
<CloseShiftDialog
  shift={currentShift}
  onClose={() => setModal(null)}
  onSuccess={handleSuccess}
/>
```
- Inputs: Closing cash, notes
- Display: Duration, opening cash, difference
- States: Loading, error
- API: `shiftsApi.close(closingCash, notes)`

#### **ShiftDetailsDialog**
Shows detailed information about a shift.
```tsx
<ShiftDetailsDialog
  shift={selectedShift}
  onClose={() => setModal(null)}
/>
```
- Display: User, stats, details
- Calculated: Difference, duration
- Read-only view

---

### Views

#### **ShiftHeader**
Sticky top bar with title and action buttons.
```tsx
<ShiftHeader
  currentShift={currentShift}
  onOpenShift={() => setModal('open')}
  onCloseShift={() => setModal('close')}
/>
```
- Features: Date display, quick actions
- Shows: "Close My Shift" when shift active

#### **ShiftStats**
Banner showing active shift information.
```tsx
<ShiftStats shift={currentShift} />
```
- Shows: Duration, opening cash
- Indicator: Pulsing status dot
- Returns: null if no active shift

#### **ShiftTabs**
Filter tabs for switching views.
```tsx
<ShiftTabs
  tab={tab}
  statusFilter={statusFilter}
  onTabChange={(newFilter, newTab) => {
    setStatusFilter(newFilter);
    setTab(newTab);
    setPage(1);
  }}
/>
```
- Filters: All, Open, Closed
- State: Highlighted active tab

#### **ShiftCard**
Card component for active shifts grid.
```tsx
<ShiftCard
  shift={shift}
  onClick={() => handleDetailsClick(shift)}
/>
```
- Display: User, opening cash, duration
- Grid layout: Auto-fill minmax(240px)
- Hover: Border color change

#### **ShiftTable**
Paginated table of all shifts.
```tsx
<ShiftTable
  shifts={shifts}
  loading={loading}
  onRowClick={handleDetailsClick}
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```
- Columns: ID, Cashier, Status, Cash, Difference, Time, Actions
- Features: Pagination, row hover, loading state
- Responsive: Handles empty state

---

### UI Components

#### **StatusBadge**
Colored status indicator.
```tsx
<StatusBadge status="open" /> // or "closed"
```
- Open: Green with glow
- Closed: Muted gray

#### **Modal**
Base modal wrapper.
```tsx
<Modal
  title="Shift Details"
  onClose={handleClose}
>
  {children}
</Modal>
```
- Features: Click-outside to close, close button
- Styling: Dark theme, centered

#### **Input & Textarea**
Form inputs with labels.
```tsx
<Input
  label="Opening Cash (SAR)"
  type="number"
  min="0"
  step="0.01"
  value={cash}
  onChange={e => setCash(e.target.value)}
/>

<Textarea
  label="Notes (optional)"
  rows={2}
  value={notes}
  onChange={e => setNotes(e.target.value)}
/>
```

#### **EmptyState**
Placeholder when no data.
```tsx
<EmptyState /> // "No active shifts right now"
```

---

## 🎣 Hook Reference

### **useShifts()**
Main data fetching hook.
```tsx
const {
  shifts,          // Array<Shift> - all shifts for current page
  activeShifts,    // Array<Shift> - shifts currently open
  currentShift,    // Shift | null - user's active shift
  loading,         // boolean
  totalPages,      // number
  error,           // string | null
  refresh,         // () => void
} = useShifts({ page: 1, statusFilter: '' });
```

**Features:**
- Auto-fetches on mount and when filters change
- Handles pagination
- Catches errors gracefully
- Provides refresh function for manual refetch

---

## 🛠️ Type Definitions

```typescript
// Core types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Shift {
  id: string;
  user_id: string;
  user: User;
  opening_cash: number;
  closing_cash?: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
  notes?: string;
}

interface ListResponse<T> {
  data: T[];
  meta: {
    totalPages: number;
    currentPage?: number;
    total?: number;
  };
}

type ModalType = 'open' | 'close' | 'details' | null;
type TabType = 'all' | 'active';
```

---

## 🎨 Design Constants

### Colors
```typescript
COLORS = {
  dark: '#0f0e0d',
  darkCard: '#161410',
  darkInput: '#111',
  text: '#e8e0d0',
  gold: '#c9a84c',
  greenSuccess: '#4ade80',
  redError: '#f87171',
  // ... and more
}
```

### Spacing Scale
```typescript
SPACING = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 12,   // 12px
  lg: 16,   // 16px
  xl: 20,   // 20px
  xxl: 28,  // 28px
}
```

### Font Sizes
```typescript
FONT_SIZES = {
  xs: 9,
  sm: 10,
  base: 11,
  md: 12,
  lg: 13,
  xl: 14,
  '2xl': 15,
  '3xl': 16,
  '4xl': 18,
  '5xl': 22,
}
```

---

## 📡 API Reference

All API calls in `lib/api/shifts.ts`:

```typescript
shiftsApi.getAll(page, limit, status?)     // GET /api/v1/shifts
shiftsApi.current()                        // GET /api/v1/shifts/current
shiftsApi.getActive()                      // GET /api/v1/shifts/active
shiftsApi.getById(id)                      // GET /api/v1/shifts/{id}
shiftsApi.create(openingCash)              // POST /api/v1/shifts/open
shiftsApi.close(closingCash, notes?)       // POST /api/v1/shifts/close
```

---

## 🔧 Utility Functions

```typescript
// Formatting
formatCurrency(amount)      // "123.45 SAR"
formatDate(dateStr)         // "24 May 2026, 10:30"
timeAgo(dateStr)           // "2h ago"
duration(start, end?)      // "2h 30m"

// Helpers
getShiftInitial(name)      // "A" from "Ahmed"
formatShiftId(id)          // "#ABC123" from "abc123..."
```

---

## 🎯 Usage Example

```tsx
'use client';
import { useState } from 'react';
import { ShiftHeader } from '@/components/dashboard/shifts/ShiftHeader';
import { useShifts } from '@/components/dashboard/shifts/hooks/useShifts';

export default function ShiftsPage() {
  const { shifts, currentShift, loading } = useShifts({ page: 1 });
  const [modal, setModal] = useState(null);

  return (
    <div>
      <ShiftHeader
        currentShift={currentShift}
        onOpenShift={() => setModal('open')}
        onCloseShift={() => setModal('close')}
      />
      {/* Rest of page */}
    </div>
  );
}
```

---

## ✨ Best Practices

1. **Always use `useShifts()` hook** for data - never call API directly
2. **Use constants** for colors/spacing - import from `constants.ts`
3. **Leverage types** - TypeScript catches errors early
4. **Use utilities** for formatting - consistency across app
5. **Keep components focused** - single responsibility principle
6. **Pass callbacks** - not inline functions (for performance)

---

## 📚 Related Files

- `lib/api/shifts.ts` - API client implementation
- `app/dashboard/shifts/page.tsx` - Main page component
- `REFACTOR_SUMMARY.md` - Detailed refactoring notes

---

Built with Next.js 15, TypeScript, React hooks, and Tailwind philosophy.
