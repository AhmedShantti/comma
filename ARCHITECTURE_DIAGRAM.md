# Architecture Diagram - Shifts Dashboard

## 🏗️ Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                   page.tsx (Main Page)                      │
│                     - State Management                       │
│                     - Modal Control                          │
└────────────┬──────────────────────────────────┬─────────────┘
             │                                  │
   ┌─────────▼──────────────┐        ┌─────────▼──────────────┐
   │   ShiftHeader          │        │  ShiftStats (Banner)   │
   │  ┌─────────────────┐   │        │ ┌─────────────────┐    │
   │  │ Title & Date    │   │        │ │ Active Shift    │    │
   │  │ Open/Close Btns │   │        │ │ Info            │    │
   │  └─────────────────┘   │        │ └─────────────────┘    │
   └────────────────────────┘        └────────────────────────┘
             │
   ┌─────────▼─────────────────────────────────────────────┐
   │              Main Card Container                       │
   │  ┌───────────────────────────────────────────────────┐ │
   │  │ Card Header                                       │ │
   │  │ ┌─────────────────────┐    ┌─────────────────┐   │ │
   │  │ │ Title & Subtitle    │    │ ShiftTabs       │   │ │
   │  │ │ (All/Active Shifts) │    │ - All           │   │ │
   │  │ │                     │    │ - Open          │   │ │
   │  │ │                     │    │ - Closed        │   │ │
   │  │ └─────────────────────┘    └─────────────────┘   │ │
   │  └───────────────────────────────────────────────────┘ │
   │  ┌───────────────────────────────────────────────────┐ │
   │  │ Content Area (Dynamic based on tab)               │ │
   │  │                                                   │ │
   │  │  ┌─────────────────────────────────────────────┐ │ │
   │  │  │ Tab: 'active'                              │ │ │
   │  │  │ ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │ │
   │  │  │ │ShiftCard │  │ShiftCard │  │ShiftCard │  │ │ │
   │  │  │ │ ├─ User  │  │ ├─ User  │  │ ├─ User  │  │ │ │
   │  │  │ │ ├─ Cash  │  │ ├─ Cash  │  │ ├─ Cash  │  │ │ │
   │  │  │ │ └─ Time  │  │ └─ Time  │  │ └─ Time  │  │ │ │
   │  │  │ └──────────┘  └──────────┘  └──────────┘  │ │ │
   │  │  └─────────────────────────────────────────────┘ │ │
   │  │                                                   │ │
   │  │  ┌─────────────────────────────────────────────┐ │ │
   │  │  │ Tab: 'all'                                  │ │ │
   │  │  │                                             │ │ │
   │  │  │ ┌───────────────────────────────────────┐  │ │ │
   │  │  │ │         ShiftTable                    │  │ │ │
   │  │  │ │  ┌─────┬────────┬─────┬─────┬─────┐  │  │ │ │
   │  │  │ │  │ ID  │Cashier │Stat │Cash │Time │  │  │ │ │
   │  │  │ │  ├─────┼────────┼─────┼─────┼─────┤  │  │ │ │
   │  │  │ │  │#A1  │Ahmed   │Open │1200 │2h   │  │  │ │ │
   │  │  │ │  │#A2  │Fatima  │Clsd │950  │1h   │  │  │ │ │
   │  │  │ │  │...  │...     │...  │...  │...  │  │  │ │ │
   │  │  │ │  └─────┴────────┴─────┴─────┴─────┘  │  │ │ │
   │  │  │ │  [Prev] [Page 1/5] [Next]            │  │ │ │
   │  │  │ └───────────────────────────────────────┘  │ │ │
   │  │  └─────────────────────────────────────────────┘ │ │
   │  │                                                   │ │
   │  │  Or: EmptyState (No active shifts)              │ │
   │  └───────────────────────────────────────────────────┘ │
   │                                                        │
   │  └─ StatusBadge (open/closed indicator)              │
   │  └─ Created on demand by components                  │
   └────────────────────────────────────────────────────────┘

             ▼ When modal === 'open'
   ┌─────────────────────────────────┐
   │  OpenShiftDialog                │
   │  ┌───────────────────────────┐  │
   │  │ Modal Wrapper             │  │
   │  │ ┌─────────────────────┐   │  │
   │  │ │ Input: Cash Amount  │   │  │
   │  │ │ [Cancel] [Open ▶]   │   │  │
   │  │ └─────────────────────┘   │  │
   │  └───────────────────────────┘  │
   └─────────────────────────────────┘

             ▼ When modal === 'close'
   ┌─────────────────────────────────┐
   │  CloseShiftDialog               │
   │  ┌───────────────────────────┐  │
   │  │ Modal Wrapper             │  │
   │  │ ┌─────────────────────┐   │  │
   │  │ │ Shift Info Summary  │   │  │
   │  │ │ Input: Closing Cash │   │  │
   │  │ │ Input: Notes        │   │  │
   │  │ │ Difference Display  │   │  │
   │  │ │ [Cancel] [Close ▶]  │   │  │
   │  │ └─────────────────────┘   │  │
   │  └───────────────────────────┘  │
   └─────────────────────────────────┘

             ▼ When modal === 'details'
   ┌─────────────────────────────────┐
   │  ShiftDetailsDialog             │
   │  ┌───────────────────────────┐  │
   │  │ Modal Wrapper             │  │
   │  │ ┌─────────────────────┐   │  │
   │  │ │ User Avatar & Name  │   │  │
   │  │ │ Status Badge        │   │  │
   │  │ │                     │   │  │
   │  │ │ Stats Grid:         │   │  │
   │  │ │ ┌─────┐ ┌─────┐    │   │  │
   │  │ │ │Open │ │Clse │    │   │  │
   │  │ │ │Csh  │ │Csh  │    │   │  │
   │  │ │ └─────┘ └─────┘    │   │  │
   │  │ │                     │   │  │
   │  │ │ Detail Rows:        │   │  │
   │  │ │ Opened At:  ...     │   │  │
   │  │ │ Closed At:  ...     │   │  │
   │  │ │ Notes:      ...     │   │  │
   │  │ │ ID:         ...     │   │  │
   │  │ │                     │   │  │
   │  │ │ [Close]             │   │  │
   │  │ └─────────────────────┘   │  │
   │  └───────────────────────────┘  │
   └─────────────────────────────────┘
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│              React Component Tree                        │
│                   page.tsx                              │
└────────────┬──────────────────────────────┬─────────────┘
             │ useState                     │
             │ modal, page, filters         │ useShifts()
             │                              │ hook
             ▼                              ▼
   ┌────────────────────┐      ┌────────────────────────┐
   │  State Variables   │      │  Data Hook              │
   ├────────────────────┤      ├────────────────────────┤
   │ modal: ModalType   │      │ shifts: Shift[]         │
   │ page: number       │      │ activeShifts: Shift[]   │
   │ statusFilter: str  │      │ currentShift: Shift|null│
   │ tab: TabType       │      │ loading: boolean        │
   │ selectedShift: ... │      │ totalPages: number      │
   └────────────────────┘      └──────────┬─────────────┘
             │                             │
             │ Pass as props               │ Uses
             ▼                             ▼
   ┌─────────────────────────────────────────────────────┐
   │            Components (Presentational)               │
   │                                                     │
   │  - ShiftHeader                                      │
   │  - ShiftStats                                       │
   │  - ShiftTabs                                        │
   │  - ShiftTable or ShiftCard[]                        │
   │  - Modals (Open/Close/Details)                      │
   │                                                     │
   │  Props → State → UI                                 │
   └─────────────────────────────────────────────────────┘

             ▼ User Interaction
   ┌─────────────────────────────────────────────────────┐
   │            Event Handlers                            │
   │                                                     │
   │  onClick → setModal('open')                         │
   │  onClick → setModal('close')                        │
   │  onClick → setModal('details')                      │
   │  onChange → setStatusFilter()                       │
   │  onChange → setPage()                               │
   │                                                     │
   │  onSuccess → refresh() → re-fetch data              │
   └─────────────────────────────────────────────────────┘

             ▼ Async Data Flow
   ┌────────────────────────────────────┐
   │      useShifts() Hook               │
   │  ┌──────────────────────────────┐  │
   │  │ useEffect (mounted)          │  │
   │  │ [page, statusFilter]         │  │
   │  └──────────────┬───────────────┘  │
   │                 │                   │
   │                 ▼                   │
   │  ┌──────────────────────────────┐  │
   │  │ API Calls (parallel)         │  │
   │  │                              │  │
   │  │ shiftsApi.getAll()    ──┐    │  │
   │  │ shiftsApi.getActive() ──┼──▶ │  │
   │  │ shiftsApi.current()   ──┘    │  │
   │  │                              │  │
   │  └──────────────┬───────────────┘  │
   │                 │                   │
   │                 ▼                   │
   │  ┌──────────────────────────────┐  │
   │  │ setState()                   │  │
   │  │ - shifts                     │  │
   │  │ - activeShifts               │  │
   │  │ - currentShift               │  │
   │  │ - totalPages                 │  │
   │  │ - loading (false)            │  │
   │  └──────────────┬───────────────┘  │
   │                 │                   │
   └─────────────────┼───────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Components Re-render       │
        │   with new data             │
        └────────────────────────────┘
```

---

## 📦 API Layer

```
┌──────────────────────────────────────────────────────┐
│             lib/api/shifts.ts                        │
│                                                      │
│  const BASE_URL = ...                               │
│                                                      │
│  async function apiFetch<T>(path, options?) {       │
│    - Get token from localStorage                    │
│    - Set headers                                    │
│    - Fetch BASE_URL + path                          │
│    - Handle errors                                  │
│    - Return JSON                                    │
│  }                                                   │
│                                                      │
│  export const shiftsApi = {                         │
│                                                      │
│    getAll(page, limit, status?) ─────┐             │
│      GET /api/v1/shifts?page=...     │             │
│                                      │             │
│    current() ──────────────────────┐ │             │
│      GET /api/v1/shifts/current    │ │             │
│                                    │ │             │
│    getActive() ──────────────────┐ │ │             │
│      GET /api/v1/shifts/active   │ │ │             │
│                                  │ │ │             │
│    getById(id) ───────────────┐  │ │ │             │
│      GET /api/v1/shifts/{id}  │  │ │ │             │
│                               │  │ │ │             │
│    create(openingCash) ──────┐│  │ │ │             │
│      POST /api/v1/shifts/open ││  │ │ │             │
│                               ││  │ │ │             │
│    close(closingCash, notes)─┐││  │ │ │             │
│      POST /api/v1/shifts/close│││  │ │ │             │
│                               │││  │ │ │             │
│  }                            │││  │ │ │             │
│                               │││  │ │ │             │
│  All responses: ListResponse<Shift> or Shift       │
│                               │││  │ │ │             │
└───────────────────────────────┼┼┼──┼─┼─┘             │
                                ││││││                 
                ┌───────────────┘│││││                 
                │   ┌───────────┘││││                 
                │   │   ┌────────┘│││                 
                │   │   │   ┌─────┘││                 
                │   │   │   │   ┌──┘│                 
                │   │   │   │   │   │                 
                ▼   ▼   ▼   ▼   ▼   ▼                 
        ┌─────────────────────────────────┐
        │   Backend API                    │
        │   (api/v1/...)                   │
        │                                  │
        │   ✅ Production-Safe URLs        │
        │   ✅ Proper Auth Header          │
        │   ✅ Error Handling              │
        │   ✅ Token Management           │
        └─────────────────────────────────┘
```

---

## 🎯 State Management

```
┌─────────────────────────────────────────────┐
│         page.tsx State                       │
│                                              │
│  const [modal, setModal] = useState<ModalType>(null)
│                            ↓
│                ┌───────────────────────────┐
│                │ 'open'  → OpenShiftDialog │
│                │ 'close' → CloseShiftDialog│
│                │ 'details' → DetailsDialog │
│                │ null    → Nothing         │
│                └───────────────────────────┘
│
│  const [page, setPage] = useState(1)
│                            ↓
│              Used by useShifts()
│              Passed to ShiftTable
│
│  const [statusFilter, setStatusFilter] = useState('')
│                            ↓
│              Used by useShifts()
│              Passed to ShiftTabs
│
│  const [tab, setTab] = useState<TabType>('all')
│                            ↓
│          Controls which view to show
│          'active' → ShiftCard grid
│          'all'    → ShiftTable
│
│  const [selectedShift, setSelectedShift] = useState(null)
│                            ↓
│          Used for details modal
│          Reset after modal closes
│
└─────────────────────────────────────────────┘
```

---

## 🔌 Component Connections

```
Input Components:
└─ Input.tsx ─┬─ OpenShiftDialog (cash)
              └─ CloseShiftDialog (cash)

              ├─ Textarea.tsx ─ CloseShiftDialog (notes)
              └─ Modal.tsx ────┬─ OpenShiftDialog
                               ├─ CloseShiftDialog
                               └─ ShiftDetailsDialog

Base Components:
└─ StatusBadge.tsx ─┬─ ShiftDetailsDialog
                    └─ ShiftTable

View Components:
├─ ShiftHeader.tsx ─── page.tsx
├─ ShiftStats.tsx ───── page.tsx
├─ ShiftTabs.tsx ─────── page.tsx
├─ ShiftCard.tsx ──────── page.tsx (via grid)
├─ ShiftTable.tsx ─────── page.tsx
├─ EmptyState.tsx ─────── ShiftCard grid

Dialogs:
├─ OpenShiftDialog.tsx ── page.tsx (modal='open')
├─ CloseShiftDialog.tsx ─ page.tsx (modal='close')
└─ ShiftDetailsDialog.tsx ─ page.tsx (modal='details')

Data Layer:
├─ useShifts.ts ──────────┬─ page.tsx
│                         └─ shiftsApi
│
└─ shiftsApi (lib/api/shifts.ts) ─ Backend

Constants & Utils:
├─ types.ts ───── All components (imports)
├─ constants.ts ─ All components (styling)
└─ utils.ts ──── All components (formatting)
```

---

## 🚀 Lifecycle Flow

```
Component Mount
    ↓
useShifts() executes useEffect
    ↓
API calls (getAll, getActive, current)
    ↓
State updates (shifts, activeShifts, currentShift)
    ↓
Components re-render with data
    ↓
User interaction (click button)
    ↓
Handler called (setModal, setPage, etc.)
    ↓
State updates
    ↓
Components re-render
    ↓
Modal appears or data changes
    ↓
User submits form
    ↓
API call (create or close)
    ↓
on success callback
    ↓
refresh() called in useShifts
    ↓
Data re-fetched
    ↓
Components re-render with new data
    ↓
Modal closes
```

---

## 📊 Performance Optimizations

```
useShifts() Hook:
├─ Memoized with useCallback
├─ Dependencies: [page, statusFilter]
└─ Prevents unnecessary API calls

ShiftTable:
├─ useMemo for diff calculation
├─ useState for hover state
└─ Prevents full table re-render

CloseShiftDialog:
├─ useMemo for diff calculation
└─ Prevents calculation on every render

ShiftDetailsDialog:
├─ useMemo for stats array
├─ useMemo for details array
└─ Prevents expensive calculations

Future Optimizations:
├─ React.memo() for components
├─ useTransition() for long lists
└─ Suspense for data loading
```

---

## 🎨 Styling Strategy

```
COLORS constant
├─ Dark theme colors
├─ Semantic names
└─ Used by all components

SPACING constant
├─ Scale: xs → xxl
├─ Base: 4px increments
└─ Used for padding/margin

FONT_SIZES constant
├─ Scale: xs → 5xl
├─ Consistent typography
└─ Used for text sizes

BORDER_RADIUS constant
├─ Scale: sm → full
├─ Used for corners
└─ Consistent roundness

Components:
├─ Use constants for all styling
├─ No inline color values
├─ No magic numbers
└─ Easy to theme
```

---

This diagram shows the complete architecture, data flow, and component relationships for the refactored shifts dashboard.
