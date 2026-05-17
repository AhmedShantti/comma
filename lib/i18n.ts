export type Lang = 'en' | 'ar';

export type Localized = { en: string; ar: string };

export const UI = {
  // Header / nav
  menu: { en: 'Menu', ar: 'القائمة' },
  navigation: { en: 'Navigation', ar: 'التنقل' },
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  orders: { en: 'Orders', ar: 'الطلبات' },
  analytics: { en: 'Analytics', ar: 'التحليلات' },
  settings: { en: 'Settings', ar: 'الإعدادات' },

  // Hero
  hero_eyebrow: { en: 'Premium Café & Lounge — Cairo', ar: 'مقهى وصالة فاخرة — القاهرة' },
  hero_title: { en: 'Our Menu', ar: 'قائمتنا' },
  hero_sub: { en: 'Crafted with intention. Every item a moment to savour.', ar: 'صُنعت بعناية. كل صنف لحظة للاستمتاع.' },

  // Filters
  search_placeholder: { en: 'Search drinks, desserts, shisha…', ar: 'ابحث عن المشروبات، الحلويات، الشيشة…' },
  clear_filters: { en: 'Clear filters', ar: 'مسح الفلاتر' },

  // Empty state
  empty_title: { en: 'Nothing found', ar: 'لا توجد نتائج' },
  empty_sub: { en: 'Try a different category or search term', ar: 'جرّب فئة أخرى أو كلمة بحث مختلفة' },

  // Footer
  footer_copy: { en: '© 2025 COMMA Café & Lounge — Cairo, Egypt', ar: '© 2025 كوما كافيه ولاونج — القاهرة، مصر' },

  // Card
  popular: { en: 'Popular', ar: 'الأكثر طلباً' },
  egp: { en: 'EGP', ar: 'ج.م' },

  // Admin chrome
  admin_role: { en: 'admin@comma.cafe', ar: 'admin@comma.cafe' },
  admin_name: { en: 'Admin', ar: 'المدير' },
  view_menu: { en: 'View Menu', ar: 'عرض القائمة' },
  live: { en: 'Live', ar: 'مباشر' },

  // Stat labels
  total_orders: { en: 'Total Orders', ar: 'إجمالي الطلبات' },
  revenue_egp: { en: 'Revenue (EGP)', ar: 'الإيرادات (ج.م)' },
  total_customers: { en: 'Total Customers', ar: 'إجمالي العملاء' },
  active_orders: { en: 'Active Orders', ar: 'الطلبات النشطة' },

  // Revenue chart
  revenue_this_week: { en: 'Revenue This Week', ar: 'الإيرادات هذا الأسبوع' },
  daily_revenue: { en: 'Daily revenue in EGP', ar: 'الإيرادات اليومية بالجنيه المصري' },
  vs_last_week: { en: '+8% vs last week', ar: '+8٪ مقارنة بالأسبوع الماضي' },

  // Cat bars
  orders_by_category: { en: 'Orders by Category', ar: 'الطلبات حسب الفئة' },
  total_this_week: { en: 'Total this week', ar: 'الإجمالي هذا الأسبوع' },

  // Most ordered
  most_ordered: { en: 'Most Ordered Items', ar: 'الأصناف الأكثر طلباً' },
  by_volume: { en: 'By volume this week', ar: 'حسب الكمية هذا الأسبوع' },
  orders_unit: { en: 'orders', ar: 'طلب' },

  // Status
  order_status: { en: 'Order Status', ar: 'حالة الطلب' },
  distribution: { en: 'Distribution', ar: 'التوزيع' },
  completed: { en: 'Completed', ar: 'مكتمل' },
  preparing: { en: 'Preparing', ar: 'قيد التحضير' },
  pending: { en: 'Pending', ar: 'قيد الانتظار' },
  cancelled: { en: 'Cancelled', ar: 'ملغي' },

  // Orders table
  recent_orders: { en: 'Recent Orders', ar: 'الطلبات الأخيرة' },
  latest_activity: { en: 'Latest activity', ar: 'النشاط الأخير' },
  export_csv: { en: 'Export CSV', ar: 'تصدير CSV' },
  order_id: { en: 'Order ID', ar: 'رقم الطلب' },
  customer: { en: 'Customer', ar: 'العميل' },
  table_label: { en: 'Table', ar: 'الطاولة' },
  items_label: { en: 'Items', ar: 'الأصناف' },
  total_label: { en: 'Total', ar: 'الإجمالي' },
  status_label: { en: 'Status', ar: 'الحالة' },
  time_label: { en: 'Time', ar: 'الوقت' },

  // Settings
  settings_sub: { en: 'Manage your café profile and preferences', ar: 'إدارة بيانات المقهى والتفضيلات' },
  cafe_name: { en: 'Café Name', ar: 'اسم المقهى' },
  cafe_name_value: { en: 'COMMA Café & Lounge', ar: 'كوما كافيه ولاونج' },
  location: { en: 'Location', ar: 'الموقع' },
  location_value: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
  currency: { en: 'Currency', ar: 'العملة' },
  save_changes: { en: 'Save changes', ar: 'حفظ التغييرات' },

  // Categories
  cat_all: { en: 'All', ar: 'الكل' },
  cat_coffees: { en: 'Coffees', ar: 'القهوة' },
  cat_hot_drinks: { en: 'Hot Drinks', ar: 'المشروبات الساخنة' },
  cat_cold_drinks: { en: 'Cold Drinks', ar: 'المشروبات الباردة' },
  cat_fresh_juices: { en: 'Fresh Juices', ar: 'العصائر الطازجة' },
  cat_smoothies: { en: 'Smoothies', ar: 'السموذي' },
  cat_desserts: { en: 'Desserts', ar: 'الحلويات' },
  cat_shisha: { en: 'Shisha', ar: 'الشيشة' },
  cat_snacks: { en: 'Snacks', ar: 'الوجبات الخفيفة' },

  // Auth / Login
  login_title: { en: 'Sign in', ar: 'تسجيل الدخول' },
  login_sub: { en: 'Welcome back to the admin console', ar: 'مرحباً بعودتك إلى لوحة الإدارة' },
  username: { en: 'Username', ar: 'اسم المستخدم' },
  password: { en: 'Password', ar: 'كلمة المرور' },
  sign_in: { en: 'Sign in', ar: 'دخول' },
  signing_in: { en: 'Signing in…', ar: 'جارٍ تسجيل الدخول…' },
  login_error: { en: 'Invalid username or password', ar: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
  demo_accounts: { en: 'Demo accounts — click to fill', ar: 'حسابات تجريبية — اضغط لملء البيانات' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },

  // Add Order modal
  add_order: { en: 'Add Order', ar: 'إضافة طلب' },
  new_order: { en: 'New Order', ar: 'طلب جديد' },
  customer_name: { en: 'Customer name', ar: 'اسم العميل' },
  table_number: { en: 'Table number', ar: 'رقم الطاولة' },
  add_item: { en: 'Add item', ar: 'إضافة صنف' },
  remove_item: { en: 'Remove', ar: 'حذف' },
  select_item: { en: 'Select an item…', ar: 'اختر صنفاً…' },
  qty: { en: 'Qty', ar: 'الكمية' },
  no_items_yet: { en: 'No items yet. Add one to start the order.', ar: 'لا توجد أصناف بعد. أضف صنفاً لبدء الطلب.' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save_order: { en: 'Save order', ar: 'حفظ الطلب' },
  just_now: { en: 'just now', ar: 'الآن' },
  validation_required: { en: 'Please fill in all fields and add at least one item.', ar: 'يرجى ملء جميع الحقول وإضافة صنف واحد على الأقل.' },

  // Role names
  role_manager: { en: 'Manager', ar: 'مدير' },
  role_accounting: { en: 'Accounting', ar: 'محاسبة' },
  role_garson: { en: 'Waiter', ar: 'جرسون' },

  // Days (short)
  day_mon: { en: 'Mon', ar: 'إثنين' },
  day_tue: { en: 'Tue', ar: 'ثلاثاء' },
  day_wed: { en: 'Wed', ar: 'أربعاء' },
  day_thu: { en: 'Thu', ar: 'خميس' },
  day_fri: { en: 'Fri', ar: 'جمعة' },
  day_sat: { en: 'Sat', ar: 'سبت' },
  day_sun: { en: 'Sun', ar: 'أحد' },
} satisfies Record<string, Localized>;

export type UIKey = keyof typeof UI;

export function pluralizeItems(n: number, lang: Lang): string {
  if (lang === 'ar') return `${n} ${n === 1 ? 'صنف' : n === 2 ? 'صنفان' : 'أصناف'}`;
  return `${n} item${n !== 1 ? 's' : ''}`;
}

export function timeAgoTranslate(en: string, lang: Lang): string {
  if (lang === 'en') return en;
  // "X min ago" → "منذ X دقيقة"
  const m = en.match(/^(\d+)\s+min ago$/);
  if (m) return `منذ ${m[1]} دقيقة`;
  return en;
}
