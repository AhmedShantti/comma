const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

// Mock data
const mockUsers = {
  'manager': { id: '1', username: 'manager', name: 'Manager User', role: 'manager' },
  'accounting': { id: '2', username: 'accounting', name: 'Accounting User', role: 'accounting' },
  'garson': { id: '3', username: 'garson', name: 'Garson User', role: 'garson' },
};

const mockCategories = [
  { id: '1', slug: 'coffees', name: { en: 'Coffees', ar: 'القهوة' } },
  { id: '2', slug: 'hot-drinks', name: { en: 'Hot Drinks', ar: 'المشروبات الساخنة' } },
  { id: '3', slug: 'cold-drinks', name: { en: 'Cold Drinks', ar: 'المشروبات الباردة' } },
];

const mockMenuItems = [
  { id: '1', name: { en: 'Cappuccino', ar: 'كابتشينو' }, price: 45, cat: 'coffees', img: 'https://via.placeholder.com/300' },
  { id: '2', name: { en: 'Espresso', ar: 'إسبريسو' }, price: 35, cat: 'coffees', img: 'https://via.placeholder.com/300' },
  { id: '3', name: { en: 'Tea', ar: 'شاي' }, price: 25, cat: 'hot-drinks', img: 'https://via.placeholder.com/300' },
  { id: '4', name: { en: 'Iced Coffee', ar: 'قهوة مثلجة' }, price: 50, cat: 'cold-drinks', img: 'https://via.placeholder.com/300' },
];

let mockOrders = [
  { id: '#ORD-1001', status: 'OPEN', cust: { en: 'Ahmed', ar: 'أحمد' }, table: 'T-01', total: 150, items: { en: 'Cappuccino x2', ar: 'كابتشينو x2' }, statusKey: 'open', time: '2 hours ago' },
];

const mockSettings = {
  cafe_name: 'COMMA Coffee House',
  location: 'Cairo, Egypt',
  currency: 'ILS',
  phone: '+20 1000 000 000',
  email: 'info@comma.com',
  vat_rate: 14,
};

// Helper function to return responses
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ status: 'success', data });
};

const sendError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ status: 'error', message });
};

// ============ HEALTH ============
app.get('/api/health', (req, res) => {
  sendSuccess(res, { status: 'UP', timestamp: new Date().toISOString() });
});

// ============ AUTH ============
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const validCredentials = {
    'manager': 'manager123',
    'accounting': 'accounting123',
    'garson': 'garson123',
  };

  if (validCredentials[username] === password) {
    const user = mockUsers[username];
    sendSuccess(res, {
      token: 'mock-jwt-token-' + Date.now(),
      username: user.username,
      id: user.id,
      name: user.name,
      role: user.role,
    });
  } else {
    sendError(res, 'Invalid credentials', 401);
  }
});

app.post('/api/auth/refresh', (req, res) => {
  sendSuccess(res, { token: 'mock-jwt-token-refreshed-' + Date.now() });
});

app.post('/api/auth/logout', (req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req, res) => {
  const user = mockUsers.manager;
  sendSuccess(res, {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  });
});

// ============ USERS ============
app.get('/api/users', (req, res) => {
  sendSuccess(res, Object.values(mockUsers));
});

app.get('/api/users/:id', (req, res) => {
  const user = mockUsers[req.params.id];
  if (user) {
    sendSuccess(res, user);
  } else {
    sendError(res, 'User not found', 404);
  }
});

app.post('/api/users', (req, res) => {
  const { username, name, role } = req.body;
  const id = Object.keys(mockUsers).length + 1;
  mockUsers[username] = { id, username, name, role };
  sendSuccess(res, mockUsers[username], 201);
});

app.patch('/api/users/:id', (req, res) => {
  const user = mockUsers[req.params.id];
  if (user) {
    Object.assign(user, req.body);
    sendSuccess(res, user);
  } else {
    sendError(res, 'User not found', 404);
  }
});

app.delete('/api/users/:id', (req, res) => {
  if (mockUsers[req.params.id]) {
    delete mockUsers[req.params.id];
    sendSuccess(res, { message: 'User deleted' });
  } else {
    sendError(res, 'User not found', 404);
  }
});

// ============ SHIFTS ============
let currentShift = { id: 'shift-1', opening_cash: 1000, status: 'OPEN', opened_at: new Date() };

app.get('/api/shifts', (req, res) => {
  sendSuccess(res, [currentShift]);
});

app.get('/api/shifts/current', (req, res) => {
  if (currentShift && currentShift.status === 'OPEN') {
    sendSuccess(res, currentShift);
  } else {
    sendError(res, 'No open shift', 404);
  }
});

app.post('/api/shifts/open', (req, res) => {
  const { opening_cash } = req.body;
  currentShift = {
    id: 'shift-' + Date.now(),
    opening_cash,
    status: 'OPEN',
    opened_at: new Date(),
  };
  sendSuccess(res, currentShift, 201);
});

app.post('/api/shifts/close', (req, res) => {
  if (currentShift) {
    currentShift.status = 'CLOSED';
    currentShift.closed_at = new Date();
    sendSuccess(res, currentShift);
  } else {
    sendError(res, 'No open shift', 404);
  }
});

// ============ CATEGORIES ============
app.get('/api/categories', (req, res) => {
  sendSuccess(res, mockCategories);
});

app.get('/api/categories/:id', (req, res) => {
  const cat = mockCategories.find(c => c.id === req.params.id);
  if (cat) {
    sendSuccess(res, cat);
  } else {
    sendError(res, 'Category not found', 404);
  }
});

app.post('/api/categories', (req, res) => {
  const cat = { id: mockCategories.length + 1, ...req.body };
  mockCategories.push(cat);
  sendSuccess(res, cat, 201);
});

app.patch('/api/categories/:id', (req, res) => {
  const cat = mockCategories.find(c => c.id === req.params.id);
  if (cat) {
    Object.assign(cat, req.body);
    sendSuccess(res, cat);
  } else {
    sendError(res, 'Category not found', 404);
  }
});

app.delete('/api/categories/:id', (req, res) => {
  const idx = mockCategories.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    mockCategories.splice(idx, 1);
    sendSuccess(res, { message: 'Category deleted' });
  } else {
    sendError(res, 'Category not found', 404);
  }
});

// ============ MENU ITEMS ============
app.get('/api/menu-items', (req, res) => {
  sendSuccess(res, mockMenuItems);
});

app.get('/api/menu-items/:id', (req, res) => {
  const item = mockMenuItems.find(i => i.id === req.params.id);
  if (item) {
    sendSuccess(res, item);
  } else {
    sendError(res, 'Menu item not found', 404);
  }
});

app.post('/api/menu-items', (req, res) => {
  const item = { id: mockMenuItems.length + 1, ...req.body };
  mockMenuItems.push(item);
  sendSuccess(res, item, 201);
});

app.patch('/api/menu-items/:id', (req, res) => {
  const item = mockMenuItems.find(i => i.id === req.params.id);
  if (item) {
    Object.assign(item, req.body);
    sendSuccess(res, item);
  } else {
    sendError(res, 'Menu item not found', 404);
  }
});

app.delete('/api/menu-items/:id', (req, res) => {
  const idx = mockMenuItems.findIndex(i => i.id === req.params.id);
  if (idx !== -1) {
    mockMenuItems.splice(idx, 1);
    sendSuccess(res, { message: 'Menu item deleted' });
  } else {
    sendError(res, 'Menu item not found', 404);
  }
});

app.get('/api/menu-items/availability', (req, res) => {
  sendSuccess(res, mockMenuItems.map(i => ({ id: i.id, available: true })));
});

// ============ ADDONS ============
const mockAddons = [];

app.get('/api/addons', (req, res) => {
  sendSuccess(res, mockAddons);
});

app.post('/api/addons', (req, res) => {
  const addon = { id: mockAddons.length + 1, ...req.body };
  mockAddons.push(addon);
  sendSuccess(res, addon, 201);
});

app.patch('/api/addons/:id', (req, res) => {
  const addon = mockAddons.find(a => a.id === req.params.id);
  if (addon) {
    Object.assign(addon, req.body);
    sendSuccess(res, addon);
  } else {
    sendError(res, 'Addon not found', 404);
  }
});

app.delete('/api/addons/:id', (req, res) => {
  const idx = mockAddons.findIndex(a => a.id === req.params.id);
  if (idx !== -1) {
    mockAddons.splice(idx, 1);
    sendSuccess(res, { message: 'Addon deleted' });
  } else {
    sendError(res, 'Addon not found', 404);
  }
});

// ============ ORDERS ============
app.get('/api/orders', (req, res) => {
  sendSuccess(res, mockOrders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (order) {
    sendSuccess(res, order);
  } else {
    sendError(res, 'Order not found', 404);
  }
});

app.post('/api/orders', (req, res) => {
  const { type, table_number, customer_name, status, items } = req.body;
  const order = {
    id: '#ORD-' + (mockOrders.length + 1000),
    type: type || 'dine-in',
    table: table_number || 'N/A',
    cust: { en: customer_name || 'Customer', ar: customer_name || 'زبون' },
    status: status || 'Pending',
    statusKey: (status || 'Pending').toLowerCase(),
    total: Math.floor(Math.random() * 500) + 100,
    items: { en: 'Order items', ar: 'عناصر الطلب' },
    time: new Date().toISOString(),
  };
  mockOrders.unshift(order);
  sendSuccess(res, order, 201);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = mockOrders.find(o => o.id === req.params.id);
  if (order) {
    order.status = status;
    order.statusKey = status.toLowerCase();
    sendSuccess(res, order);
  } else {
    sendError(res, 'Order not found', 404);
  }
});

app.delete('/api/orders/:id', (req, res) => {
  const idx = mockOrders.findIndex(o => o.id === req.params.id);
  if (idx !== -1) {
    mockOrders.splice(idx, 1);
    sendSuccess(res, { message: 'Order deleted' });
  } else {
    sendError(res, 'Order not found', 404);
  }
});

// ============ INVOICES ============
app.get('/api/invoices', (req, res) => {
  sendSuccess(res, mockOrders.slice(0, 3).map(o => ({ id: o.id, total: o.total, date: o.time })));
});

app.get('/api/invoices/:id', (req, res) => {
  const invoice = mockOrders.find(o => o.id === req.params.id);
  if (invoice) {
    sendSuccess(res, invoice);
  } else {
    sendError(res, 'Invoice not found', 404);
  }
});

app.get('/api/invoices/:id/export', (req, res) => {
  sendSuccess(res, { pdf_url: 'https://example.com/invoice.pdf' });
});

// ============ CASH DRAWER ============
let cashDrawer = { opening_cash: 1000, current_cash: 1500, status: 'OPEN' };

app.get('/api/cash-drawer', (req, res) => {
  sendSuccess(res, cashDrawer);
});

app.post('/api/cash-drawer/start', (req, res) => {
  const { opening_cash } = req.body;
  cashDrawer = { opening_cash, current_cash: opening_cash, status: 'OPEN' };
  sendSuccess(res, cashDrawer, 201);
});

app.post('/api/cash-drawer/end', (req, res) => {
  const { closing_cash } = req.body;
  cashDrawer.closing_cash = closing_cash;
  cashDrawer.status = 'CLOSED';
  sendSuccess(res, cashDrawer);
});

// ============ REPORTS ============
app.get('/api/reports/daily', (req, res) => {
  sendSuccess(res, {
    total_revenue: 2500,
    total_orders: 45,
    average_order_value: 56,
    total_items_sold: 125,
    category_performance: [
      { category: 'coffees', revenue: 1200, percentage: 48 },
      { category: 'hot-drinks', revenue: 900, percentage: 36 },
      { category: 'cold-drinks', revenue: 400, percentage: 16 },
    ],
    top_items_by_quantity: [
      { name: 'Cappuccino', quantity: 45, revenue: 2025 },
      { name: 'Espresso', quantity: 38, revenue: 1330 },
      { name: 'Tea', quantity: 25, revenue: 625 },
      { name: 'Iced Coffee', quantity: 17, revenue: 850 },
    ],
  });
});

app.get('/api/reports/weekly', (req, res) => {
  sendSuccess(res, {
    total_revenue: 18500,
    daily_comparison: [
      { day: 'Monday', dayKey: 'monday', revenue: 2500 },
      { day: 'Tuesday', dayKey: 'tuesday', revenue: 2800 },
      { day: 'Wednesday', dayKey: 'wednesday', revenue: 2200 },
      { day: 'Thursday', dayKey: 'thursday', revenue: 3000 },
      { day: 'Friday', dayKey: 'friday', revenue: 3800 },
      { day: 'Saturday', dayKey: 'saturday', revenue: 2400 },
      { day: 'Sunday', dayKey: 'sunday', revenue: 1800 },
    ],
  });
});

// ============ SETTINGS ============
app.get('/api/settings', (req, res) => {
  sendSuccess(res, mockSettings);
});

app.patch('/api/settings', (req, res) => {
  Object.assign(mockSettings, req.body);
  sendSuccess(res, mockSettings);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 COMMA POS Mock API Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api/*`);
});
