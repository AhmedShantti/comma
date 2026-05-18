import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { MenuItem } from '../../modules/menu-items/entities/menu-item.entity';
import { Variant } from '../../modules/menu-items/entities/menu-item.entity';
import { Addon } from '../../modules/addons/entities/addon.entity';
import { Setting } from '../../modules/settings/entities/setting.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create Default Admin User
    console.log('📝 Creating default admin user...');
    const userRepository = dataSource.getRepository(User);

    const adminExists = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const admin = new User();
      admin.username = 'admin';
      admin.email = 'admin@restaurant.com';
      admin.password = await bcrypt.hash('admin123', 12);
      admin.full_name = 'Administrator';
      admin.role = UserRole.ADMIN;
      admin.is_active = true;

      await userRepository.save(admin);
      console.log('✅ Admin user created (admin/admin123)\n');
    } else {
      console.log('✅ Admin user already exists\n');
    }

    // 2. Create Manager User
    console.log('📝 Creating manager user...');
    const managerExists = await userRepository.findOne({
      where: { username: 'manager1' },
    });

    if (!managerExists) {
      const manager = new User();
      manager.username = 'manager1';
      manager.email = 'manager@restaurant.com';
      manager.password = await bcrypt.hash('manager123', 12);
      manager.full_name = 'Manager User';
      manager.role = UserRole.MANAGER;
      manager.is_active = true;

      await userRepository.save(manager);
      console.log('✅ Manager user created (manager1/manager123)\n');
    } else {
      console.log('✅ Manager user already exists\n');
    }

    // 3. Create Cashier Users
    console.log('📝 Creating cashier users...');
    for (let i = 1; i <= 2; i++) {
      const cashierExists = await userRepository.findOne({
        where: { username: `cashier${i}` },
      });

      if (!cashierExists) {
        const cashier = new User();
        cashier.username = `cashier${i}`;
        cashier.email = `cashier${i}@restaurant.com`;
        cashier.password = await bcrypt.hash('cashier123', 12);
        cashier.pin = await bcrypt.hash('1234', 12);
        cashier.full_name = `Cashier ${i}`;
        cashier.role = UserRole.CASHIER;
        cashier.is_active = true;

        await userRepository.save(cashier);
        console.log(`✅ Cashier ${i} created (cashier${i}/cashier123, PIN: 1234)`);
      }
    }
    console.log('');

    // 4. Create Categories
    console.log('📝 Creating menu categories...');
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
      { name_ar: 'المشروبات الساخنة', name_en: 'Hot Beverages' },
      { name_ar: 'المشروبات الباردة', name_en: 'Cold Beverages' },
      { name_ar: 'الوجبات الخفيفة', name_en: 'Snacks' },
      { name_ar: 'الحلويات', name_en: 'Desserts' },
      { name_ar: 'الوجبات الرئيسية', name_en: 'Main Courses' },
    ];

    const createdCategories = [];
    for (let i = 0; i < categories.length; i++) {
      const exists = await categoryRepository.findOne({
        where: { name_en: categories[i].name_en },
      });

      if (!exists) {
        const category = categoryRepository.create({
          ...categories[i],
          sort_order: i + 1,
          is_active: true,
        });
        const saved = await categoryRepository.save(category);
        createdCategories.push(saved);
        console.log(`✅ Category: ${categories[i].name_en}`);
      } else {
        createdCategories.push(exists);
      }
    }
    console.log('');

    // 5. Create Add-ons
    console.log('📝 Creating add-ons...');
    const addonRepository = dataSource.getRepository(Addon);

    const addons = [
      { name_ar: 'حليب إضافي', name_en: 'Extra Milk', price: 2 },
      { name_ar: 'سكر إضافي', name_en: 'Extra Sugar', price: 0.5 },
      { name_ar: 'شوكولاتة', name_en: 'Chocolate', price: 3 },
      { name_ar: 'كريمة مخفوقة', name_en: 'Whipped Cream', price: 3 },
      { name_ar: 'بسكويت', name_en: 'Cookies', price: 2 },
    ];

    const createdAddons = [];
    for (const addon of addons) {
      const exists = await addonRepository.findOne({
        where: { name_en: addon.name_en },
      });

      if (!exists) {
        const saved = await addonRepository.save(
          addonRepository.create(addon),
        );
        createdAddons.push(saved);
        console.log(`✅ Add-on: ${addon.name_en}`);
      } else {
        createdAddons.push(exists);
      }
    }
    console.log('');

    // 6. Create Menu Items
    console.log('📝 Creating menu items...');
    const menuItemRepository = dataSource.getRepository(MenuItem);
    const variantRepository = dataSource.getRepository(Variant);

    const menuItems = [
      {
        category: createdCategories[0],
        name_ar: 'قهوة أمريكية',
        name_en: 'Americano',
        base_price: 12,
        variants: [
          { name: 'Small', price_adjustment: -2 },
          { name: 'Medium', price_adjustment: 0 },
          { name: 'Large', price_adjustment: 3 },
        ],
      },
      {
        category: createdCategories[0],
        name_ar: 'كابتشينو',
        name_en: 'Cappuccino',
        base_price: 15,
        variants: [
          { name: 'Small', price_adjustment: -2 },
          { name: 'Medium', price_adjustment: 0 },
          { name: 'Large', price_adjustment: 3 },
        ],
      },
      {
        category: createdCategories[1],
        name_ar: 'قهوة باردة',
        name_en: 'Iced Coffee',
        base_price: 14,
        variants: [
          { name: 'Small', price_adjustment: -2 },
          { name: 'Medium', price_adjustment: 0 },
          { name: 'Large', price_adjustment: 3 },
        ],
      },
      {
        category: createdCategories[2],
        name_ar: 'ساندويتش',
        name_en: 'Sandwich',
        base_price: 20,
        variants: [
          { name: 'Chicken', price_adjustment: 0 },
          { name: 'Beef', price_adjustment: 5 },
        ],
      },
      {
        category: createdCategories[3],
        name_ar: 'كيكة الشوكولاتة',
        name_en: 'Chocolate Cake',
        base_price: 25,
        variants: [{ name: 'Slice', price_adjustment: 0 }],
      },
    ];

    for (const itemData of menuItems) {
      const exists = await menuItemRepository.findOne({
        where: { name_en: itemData.name_en },
      });

      if (!exists) {
        const menuItem = menuItemRepository.create({
          category_id: itemData.category.id,
          name_ar: itemData.name_ar,
          name_en: itemData.name_en,
          base_price: itemData.base_price,
          is_active: true,
        });

        const saved = await menuItemRepository.save(menuItem);

        // Create variants
        for (const variantData of itemData.variants) {
          await variantRepository.save(
            variantRepository.create({
              menu_item_id: saved.id,
              name: variantData.name,
              price_adjustment: variantData.price_adjustment,
              is_active: true,
            }),
          );
        }

        console.log(
          `✅ Menu Item: ${itemData.name_en} (${itemData.category.name_en})`,
        );
      }
    }
    console.log('');

    // 7. Create Default Settings
    console.log('📝 Creating default settings...');
    const settingRepository = dataSource.getRepository(Setting);

    const defaultSettings = [
      { key: 'restaurant_name', value: 'My Restaurant' },
      { key: 'restaurant_name_ar', value: 'مطعمي' },
      { key: 'address', value: '123 Main Street' },
      { key: 'phone', value: '+966123456789' },
      { key: 'vat_rate', value: '15' },
      { key: 'service_charge_rate', value: '0' },
      { key: 'currency_code', value: 'SAR' },
      { key: 'currency_symbol', value: 'ر.س' },
      { key: 'timezone', value: 'Asia/Riyadh' },
      { key: 'business_day_start', value: '06:00' },
      { key: 'business_day_end', value: '02:00' },
      { key: 'receipt_footer', value: 'Thank you for your visit!' },
    ];

    for (const setting of defaultSettings) {
      const exists = await settingRepository.findOne({
        where: { key: setting.key },
      });

      if (!exists) {
        await settingRepository.save(
          settingRepository.create(setting),
        );
        console.log(`✅ Setting: ${setting.key}`);
      }
    }
    console.log('');

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   Users created: 4 (1 Admin, 1 Manager, 2 Cashiers)');
    console.log(`   Categories created: ${createdCategories.length}`);
    console.log(`   Menu items created: ${menuItems.length}`);
    console.log(`   Add-ons created: ${createdAddons.length}`);
    console.log(`   Settings created: ${defaultSettings.length}\n`);
    console.log('🎉 Ready to use!\n');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}
