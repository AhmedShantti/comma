Read the file `lib/api.ts` carefully, then update ALL components in the `components/` folder to use the real API functions instead of any hardcoded/mock/static data. Every component must fetch, send, and display real data from the backend.

## IMPORTANT RULES
- Read each component file FULLY before editing — understand its current state, props, and UI structure.
- Keep the existing UI/design/styling exactly as-is — only change the data layer.
- Use proper loading states, error handling, and empty states in every component.
- Use `useEffect` for fetching data on mount, `useState` for local state, and `useCallback` for event handlers.
- If a component already uses React Query or SWR, keep using it. If not, use plain `useEffect` + `useState`.
- All API calls must use `import { api } from '@/lib/api'` (adjust the import path based on what the file currently uses).
- Handle token expiration gracefully — if any API returns 401, redirect to login.
- Add try/catch around every API call.
- DO NOT delete any existing functionality or UI elements.
- DO NOT leave any TODO comments — implement everything fully.

---

## COMPONENT-BY-COMPONENT INSTRUCTIONS

### 1. `components/AuthProvider.tsx`
- On mount: call `api.auth.me()` to check if user is authenticated
- Store user data in context (role, name, id)
- Provide `login`, `logout`, `refreshToken` functions via context
- `login`: call `api.auth.login(data)` → store tokens (localStorage or cookies) → set user state
- `logout`: call `api.auth.logout()` → clear tokens → redirect to login page
- `refreshToken`: call `api.auth.refresh()` → update stored access token
- Add an axios/fetch interceptor or wrapper that:
  - Attaches the access token as `Authorization: Bearer <token>` header on every request
  - On 401 response: try `refreshToken()`, if that fails → `logout()`

### 2. `components/LoginForm.tsx`
- On submit: call `api.auth.login({ username, password })` 
- Show loading spinner while waiting
- On success: store tokens → redirect to admin dashboard
- On error: show error message (wrong credentials, server error, etc.)
- Disable submit button while loading

### 3. `components/admin/AuthGate.tsx`
- Use AuthProvider context to check authentication
- If not authenticated → redirect to login page
- If authenticated → render children
- Show loading spinner while checking auth status

### 4. `components/admin/AdminShell.tsx`
- On mount: call `api.shifts.current()` to check if there's an open shift
- If no open shift → show a modal/prompt to open one (call `api.shifts.create({ opening_cash })`)
- Display current user info from AuthProvider context
- Handle logout via `api.auth.logout()`

### 5. `components/admin/Sidebar.tsx`
- Use AuthProvider context to get user role
- Show/hide menu items based on role:
  - Admin: everything
  - Manager: everything except user management
  - Cashier: orders, menu, current shift only
- Highlight active route

### 6. `components/admin/StatCards.tsx`
- On mount: call `api.reports.daily()` to get today's stats
- Display: total revenue, total orders, average order value, total items sold
- Show loading skeletons while fetching
- Auto-refresh every 30 seconds (use `setInterval` inside `useEffect`)
- Handle error state (show "Failed to load" with retry button)

### 7. `components/admin/RevenueChart.tsx`
- On mount: call `api.reports.weekly()` to get weekly data
- Use the `daily_comparison` array from the response to plot revenue per day
- Map data to chart format: `{ day: "Monday", revenue: 12500 }`
- Show loading state while fetching
- Handle empty data (show "No data for this week")

### 8. `components/admin/CategoryBars.tsx`
- On mount: call `api.reports.daily()` and use `category_performance` from the response
- Display each category with its revenue as a bar/progress indicator
- Sort by revenue descending
- Show loading state

### 9. `components/admin/MostOrdered.tsx`
- On mount: call `api.reports.daily()` and use `top_items_by_quantity` from the response
- Display top 5-10 items with their quantity and revenue
- Show loading state
- Handle empty state

### 10. `components/admin/StatusSummary.tsx`
- On mount: call `api.orders.getAll()` and count orders by status
- Display counts for: OPEN, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
- Auto-refresh every 15 seconds
- Show loading state

### 11. `components/admin/OrdersProvider.tsx`
- Create a context that provides orders data to child components
- On mount: call `api.orders.getAll()` to fetch all orders
- Provide functions: `createOrder`, `updateOrderStatus`, `deleteOrder`, `refreshOrders`
- `createOrder`: call `api.orders.create(data)` → refresh orders list
- `updateOrderStatus`: call `api.orders.updateStatus(id, status)` → refresh orders list
- `deleteOrder`: call `api.orders.delete(id)` → refresh orders list
- Auto-refresh orders every 10 seconds for real-time updates
- Store orders in state, provide loading and error states

### 12. `components/admin/OrdersTable.tsx`
- Consume OrdersProvider context to get orders data
- Display orders in a table with columns: order number, type, status, total, cashier, time
- Add status filter buttons (All, Open, Confirmed, Preparing, Ready, Completed, Cancelled)
- Each row should have action buttons:
  - "Advance Status" → call `api.orders.updateStatus(id, nextStatus)`
  - "View Details" → call `api.orders.getById(id)` and show in a modal/drawer
  - "Cancel" → call `api.orders.delete(id)` with confirmation
- Color-code status badges
- Show loading state with skeleton rows

### 13. `components/admin/OrdersManager.tsx`
- This is the main orders page component
- Use OrdersProvider to wrap OrdersTable and AddOrderModal
- Show summary counts at the top (from OrdersProvider)
- Handle the "New Order" button click → open AddOrderModal

### 14. `components/admin/AddOrderModal.tsx`
- On open: fetch menu data with `api.categories.getAll()` and `api.menuItems.getAll()`
- Display categories as tabs/filters
- Display menu items as selectable cards
- Allow selecting items, setting quantities, adding notes
- On submit: 
  1. Call `api.orders.create({ type, table_number?, customer_name?, notes? })`
  2. Then call the endpoint to add items to the order (if separate)
  3. Close modal and refresh orders list
- Show loading state on submit
- Validate: at least 1 item selected, order type required

### 15. `components/admin/SettingsForm.tsx`
- On mount: call `api.settings.get()` to load current settings
- Pre-fill form fields with current values (restaurant name, VAT rate, currency, etc.)
- On submit: call `api.settings.update(data)` with changed values
- Show success toast/message on save
- Show loading state while saving
- Only allow Admin role to edit (disable form for Manager/Cashier)

### 16. `components/menu/MenuClient.tsx`
- On mount: call `api.categories.getAll()` and `api.menuItems.getAll()`
- Group menu items by category
- Pass data to MenuCard components
- Show loading skeletons while fetching
- Handle empty state ("No menu items available")
- This is the PUBLIC customer-facing menu — no auth required

### 17. `components/menu/MenuCard.tsx`
- Receive menu item data as props (from MenuClient)
- Display: name (AR/EN based on language), price, description, image
- If item has variants, show variant options with prices
- If item has addons, show available addons
- No API calls in this component — it's purely presentational

### 18. `components/menu/Header.tsx`
- On mount: call `api.settings.get()` to get restaurant name and logo
- Display restaurant name and logo
- No auth required (public page)
- Cache the settings (only fetch once)

### 19. `components/menu/Hero.tsx`
- Use settings data from Header or fetch `api.settings.get()` if not available via props/context
- Display restaurant name/tagline
- No auth required

### 20. `components/menu/Footer.tsx`
- Use settings data to show restaurant address, phone, social media
- Fetch from `api.settings.get()` if not passed as props
- No auth required

### 21. `components/LangProvider.tsx`
- This handles Arabic/English switching
- No API changes needed — keep as-is
- Just make sure all components that display item names use `name_ar` or `name_en` based on current language

### 22. `components/LangToggle.tsx`
- No API changes needed — keep as-is
- Toggle between AR/EN using LangProvider context

---

## GENERAL PATTERNS TO FOLLOW

### Loading State Pattern
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.someEndpoint();
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <LoadingSkeleton />;
if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
if (!data) return <EmptyState />;
```

### Auto-Refresh Pattern
```tsx
useEffect(() => {
  const fetchData = async () => { /* ... */ };
  fetchData(); // initial fetch
  const interval = setInterval(fetchData, 15000); // refresh every 15s
  return () => clearInterval(interval); // cleanup
}, []);
```

### API Call with Error Handling Pattern
```tsx
const handleSubmit = async (formData) => {
  try {
    setSubmitting(true);
    await api.orders.create(formData);
    toast.success('Order created successfully');
    onClose(); // close modal
    refreshOrders(); // refresh list
  } catch (err) {
    if (err.response?.status === 401) {
      // Token expired, AuthProvider will handle redirect
      return;
    }
    toast.error(err.response?.data?.error?.message || 'Something went wrong');
  } finally {
    setSubmitting(false);
  }
};
```

---

## AFTER ALL CHANGES

1. Run `npm run build` to check for TypeScript errors
2. Fix any type errors
3. Run `npm run dev` and test:
   - Login flow works
   - Dashboard shows real data from API
   - Orders CRUD works (create, view, update status, cancel)
   - Menu page shows real categories and items
   - Settings can be viewed and updated
   - Reports show real daily/weekly data
4. Make sure there are no console errors
5. Make sure all loading and error states work properly
