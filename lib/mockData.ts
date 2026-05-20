import { DashboardData } from '@/components/admin/DashboardProvider';

export const mockDashboardData: DashboardData = {
  stat_cards: {
    total_revenue: 15420.50,
    total_orders: 342,
    average_order_value: 45.06,
    items_sold: 1240,
    growth: {
      revenue_pct: 12.5,
      orders_pct: 8.3,
      avg_order_pct: 3.8,
      items_sold_pct: 15.2,
    },
  },
  revenue_chart: [
    { day_name: 'Monday', day_date: '2026-05-18', revenue: 2100.00 },
    { day_name: 'Tuesday', day_date: '2026-05-19', revenue: 2450.75 },
    { day_name: 'Wednesday', day_date: '2026-05-20', revenue: 2200.25 },
    { day_name: 'Thursday', day_date: '2026-05-21', revenue: 3150.00 },
    { day_name: 'Friday', day_date: '2026-05-22', revenue: 3800.50 },
    { day_name: 'Saturday', day_date: '2026-05-23', revenue: 1720.00 },
  ],
  category_breakdown: [
    {
      category_id: '1',
      name_en: 'Appetizers',
      name_ar: 'المقبلات',
      revenue: 3240.00,
      order_count: 85,
      percentage: 21.0,
    },
    {
      category_id: '2',
      name_en: 'Main Courses',
      name_ar: 'الأطباق الرئيسية',
      revenue: 6580.00,
      order_count: 156,
      percentage: 42.7,
    },
    {
      category_id: '3',
      name_en: 'Beverages',
      name_ar: 'المشروبات',
      revenue: 2890.50,
      order_count: 201,
      percentage: 18.8,
    },
    {
      category_id: '4',
      name_en: 'Desserts',
      name_ar: 'الحلويات',
      revenue: 2710.00,
      order_count: 98,
      percentage: 17.6,
    },
  ],
  most_ordered: [
    {
      menu_item_id: '1',
      name_en: 'Grilled Salmon',
      name_ar: 'السلمون المشوي',
      quantity: 125,
      revenue: 2500.00,
      percentage: 10.1,
    },
    {
      menu_item_id: '2',
      name_en: 'Caesar Salad',
      name_ar: 'سلطة قيصر',
      quantity: 98,
      revenue: 980.00,
      percentage: 7.9,
    },
    {
      menu_item_id: '3',
      name_en: 'Chicken Tikka Masala',
      name_ar: 'دجاج تيكا ماسالا',
      quantity: 112,
      revenue: 2240.00,
      percentage: 9.1,
    },
    {
      menu_item_id: '4',
      name_en: 'Espresso',
      name_ar: 'إسبريسو',
      quantity: 245,
      revenue: 735.00,
      percentage: 5.9,
    },
    {
      menu_item_id: '5',
      name_en: 'Chocolate Cake',
      name_ar: 'كيك الشوكولاتة',
      quantity: 87,
      revenue: 870.00,
      percentage: 7.0,
    },
  ],
  status_summary: {
    completed: 285,
    pending: 42,
    cancelled: 15,
  },
  generated_at: new Date().toISOString(),
};

export const mockMenuItems = [
  {
    id: '1',
    name_en: 'Grilled Salmon',
    name_ar: 'السلمون المشوي',
    description_en: 'Fresh salmon fillet with lemon butter sauce',
    description_ar: 'شريحة سلمون طازة مع صلصة زبدة الليمون',
    price: 280.00,
    category_id: '2',
    available: true,
  },
  {
    id: '2',
    name_en: 'Caesar Salad',
    name_ar: 'سلطة قيصر',
    description_en: 'Classic Caesar salad with parmesan',
    description_ar: 'سلطة قيصر كلاسيكية مع البارميزان',
    price: 95.00,
    category_id: '1',
    available: true,
  },
  {
    id: '3',
    name_en: 'Chicken Tikka Masala',
    name_ar: 'دجاج تيكا ماسالا',
    description_en: 'Tender chicken in creamy tomato sauce',
    description_ar: 'دجاج طري في صلصة طماطم كريمية',
    price: 200.00,
    category_id: '2',
    available: true,
  },
];

export const mockTables = [
  { id: '1', number: 1, capacity: 4, status: 'available' },
  { id: '2', number: 2, capacity: 4, status: 'occupied' },
  { id: '3', number: 3, capacity: 6, status: 'reserved' },
  { id: '4', number: 4, capacity: 2, status: 'available' },
  { id: '5', number: 5, capacity: 6, status: 'occupied' },
];

export const mockOrders = [
  {
    id: '1',
    table_number: 2,
    status: 'pending',
    total: 450.00,
    created_at: '2026-05-21T10:30:00Z',
    items_count: 3,
  },
  {
    id: '2',
    table_number: 5,
    status: 'completed',
    total: 320.50,
    created_at: '2026-05-21T09:45:00Z',
    items_count: 2,
  },
  {
    id: '3',
    table_number: 1,
    status: 'completed',
    total: 580.00,
    created_at: '2026-05-21T11:15:00Z',
    items_count: 4,
  },
];
