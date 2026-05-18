/**
 * seed-menu.js  —  run once from E:\POS
 *   node seed-menu.js
 *
 * Inserts categories + menu items from the Comma frontend data.ts
 * Skips rows that already exist (idempotent).
 */
require('dotenv').config();
const { Client } = require('pg');

// ─── Source data (from comma/lib/data.ts) ───────────────────────────────────

const CATEGORIES = [
  { slug: 'coffees',      name_en: 'Coffees',      name_ar: 'القهوة',              sort_order: 1 },
  { slug: 'hot-drinks',   name_en: 'Hot Drinks',   name_ar: 'المشروبات الساخنة',  sort_order: 2 },
  { slug: 'cold-drinks',  name_en: 'Cold Drinks',  name_ar: 'المشروبات الباردة',  sort_order: 3 },
  { slug: 'fresh-juices', name_en: 'Fresh Juices', name_ar: 'العصائر الطازجة',    sort_order: 4 },
  { slug: 'smoothies',    name_en: 'Smoothies',    name_ar: 'السموذي',            sort_order: 5 },
  { slug: 'desserts',     name_en: 'Desserts',     name_ar: 'الحلويات',           sort_order: 6 },
  { slug: 'shisha',       name_en: 'Shisha',       name_ar: 'الشيشة',             sort_order: 7 },
  { slug: 'snacks',       name_en: 'Snacks',       name_ar: 'الوجبات الخفيفة',   sort_order: 8 },
];

const MENU = [
  // COFFEES
  { id: 'c1',  cat: 'coffees',      price: 45,  popular: false, name_en: 'Espresso',              name_ar: 'إسبريسو',                    desc_en: 'Rich, concentrated shot of premium single-origin arabica, served in a warmed ceramic cup.',                                          desc_ar: 'جرعة مركّزة من حبوب العربيكا الفاخرة، تُقدَّم في فنجان سيراميك دافئ.',                               img: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'c2',  cat: 'coffees',      price: 55,  popular: false, name_en: 'Americano',             name_ar: 'أمريكانو',                   desc_en: 'Double espresso extended with hot water — bold, clean, and deeply satisfying.',                                                        desc_ar: 'إسبريسو مزدوج ممزوج بالماء الساخن — قوي ونقي ومُرضٍ.',                                               img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'c3',  cat: 'coffees',      price: 65,  popular: true,  name_en: 'Cappuccino',            name_ar: 'كابتشينو',                   desc_en: 'Perfectly balanced: one-third espresso, one-third steamed milk, one-third velvet foam.',                                               desc_ar: 'توازن مثالي: ثلث إسبريسو، ثلث حليب مبخّر، وثلث رغوة ناعمة.',                                         img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'c4',  cat: 'coffees',      price: 70,  popular: false, name_en: 'Flat White',            name_ar: 'فلات وايت',                  desc_en: "Double ristretto crowned with velvety microfoam — the coffee lover's choice.",                                                          desc_ar: 'ريستريتو مزدوج مع رغوة دقيقة ناعمة — اختيار عشّاق القهوة.',                                          img: 'https://images.unsplash.com/photo-1556742526-795a8eac090e?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'c5',  cat: 'coffees',      price: 50,  popular: false, name_en: 'Turkish Coffee',        name_ar: 'قهوة تركية',                 desc_en: 'Slow-brewed with cardamom in a traditional copper cezve — an Eastern ritual in a cup.',                                                 desc_ar: 'تُحضَّر ببطء مع الهيل في كنكة نحاسية تقليدية — طقس شرقي في فنجان.',                                   img: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'c6',  cat: 'coffees',      price: 75,  popular: true,  name_en: 'Signature Latte',       name_ar: 'لاتيه المميّز',              desc_en: 'Our house-blend espresso with steamed whole milk and artisan latte art.',                                                               desc_ar: 'إسبريسو من خلطة المحل مع حليب كامل الدسم مبخّر ورسومات فنية.',                                        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&h=450&q=85' },
  // HOT DRINKS
  { id: 'h1',  cat: 'hot-drinks',   price: 85,  popular: true,  name_en: 'Matcha Latte',          name_ar: 'ماتشا لاتيه',                desc_en: 'Ceremonial-grade Japanese matcha whisked to perfection with silky steamed oat milk.',                                                  desc_ar: 'ماتشا يابانية فاخرة تُخفق بإتقان مع حليب الشوفان المبخّر الحريري.',                                   img: 'https://images.unsplash.com/photo-1536013455471-9b0a7f8e1bd6?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'h2',  cat: 'hot-drinks',   price: 70,  popular: false, name_en: 'Masala Chai',           name_ar: 'شاي ماسالا',                 desc_en: 'Spiced Indian black tea with cinnamon, cardamom and clove, topped with frothy milk.',                                                  desc_ar: 'شاي أسود هندي بالقرفة والهيل والقرنفل، مع طبقة من الحليب المرغّى.',                                   img: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'h3',  cat: 'hot-drinks',   price: 85,  popular: false, name_en: 'Luxury Hot Chocolate',  name_ar: 'هوت شوكولاتة فاخرة',        desc_en: 'Belgian 70% dark chocolate melted with steamed milk and a hint of vanilla truffle.',                                                    desc_ar: 'شوكولاتة بلجيكية داكنة ٧٠٪ مذابة مع الحليب المبخّر ولمسة فانيليا.',                                   img: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'h4',  cat: 'hot-drinks',   price: 80,  popular: false, name_en: 'Golden Turmeric Latte', name_ar: 'لاتيه الكركم الذهبي',       desc_en: 'Anti-inflammatory spice blend with turmeric, ginger, black pepper and raw honey.',                                                      desc_ar: 'خلطة توابل صحية بالكركم والزنجبيل والفلفل الأسود والعسل الطبيعي.',                                    img: 'https://images.unsplash.com/photo-1543674892-7d64d45df18b?auto=format&fit=crop&w=600&h=450&q=85' },
  // COLD DRINKS
  { id: 'cl1', cat: 'cold-drinks',  price: 75,  popular: true,  name_en: 'Iced Signature Latte',  name_ar: 'لاتيه مميّز مثلّج',         desc_en: 'Double espresso poured over ice with cold whole milk — the perfect daily ritual.',                                                       desc_ar: 'إسبريسو مزدوج فوق الثلج مع حليب بارد كامل الدسم — طقس يومي مثالي.',                                  img: 'https://images.unsplash.com/photo-1556740767-414a9c4860c1?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'cl2', cat: 'cold-drinks',  price: 80,  popular: false, name_en: 'Cold Brew',             name_ar: 'كولد برو',                   desc_en: 'Steeped for 24 hours in cold water — incredibly smooth with naturally low acidity.',                                                     desc_ar: 'منقوع لمدة ٢٤ ساعة في الماء البارد — ناعم جداً وحموضته طبيعية منخفضة.',                               img: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'cl3', cat: 'cold-drinks',  price: 85,  popular: false, name_en: 'Iced Matcha',           name_ar: 'ماتشا مثلّجة',               desc_en: 'Premium matcha over crushed ice and cold oat milk with a touch of vanilla syrup.',                                                       desc_ar: 'ماتشا فاخرة فوق الثلج المجروش مع حليب الشوفان البارد ولمسة فانيليا.',                                 img: 'https://images.unsplash.com/photo-1592318951566-da9fe1b86db1?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'cl4', cat: 'cold-drinks',  price: 90,  popular: false, name_en: 'Rose Frappé',           name_ar: 'فرابيه الورد',               desc_en: 'Blended espresso with rose water, vanilla cream and crushed ice — utterly luxurious.',                                                   desc_ar: 'إسبريسو مخفوق مع ماء الورد وكريمة الفانيليا والثلج المجروش — رفاهية مطلقة.',                          img: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?auto=format&fit=crop&w=600&h=450&q=85' },
  // FRESH JUICES
  { id: 'j1',  cat: 'fresh-juices', price: 60,  popular: false, name_en: 'Freshly Pressed Orange',name_ar: 'عصير برتقال طازج',           desc_en: 'Hand-pressed Valencia oranges — pure, bright and intensely fresh.',                                                                     desc_ar: 'عصير برتقال فالنسيا مضغوط يدوياً — نقي ومنعش ومركّز.',                                               img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'j2',  cat: 'fresh-juices', price: 70,  popular: true,  name_en: 'Mango Sunrise',         name_ar: 'شروق المانجو',               desc_en: 'Alphonso mango blended with a hint of ginger and fresh lime — vibrant and tropical.',                                                    desc_ar: 'مانجو الفونسو مخفوقة مع لمسة زنجبيل وليمون طازج — حيوي واستوائي.',                                    img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'j3',  cat: 'fresh-juices', price: 60,  popular: false, name_en: 'Watermelon Mint',       name_ar: 'بطيخ بالنعناع',              desc_en: 'Cold-pressed watermelon with fresh garden mint — the ultimate summer refreshment.',                                                      desc_ar: 'بطيخ مضغوط بارد مع نعناع طازج — انتعاش الصيف بامتياز.',                                              img: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'j4',  cat: 'fresh-juices', price: 75,  popular: false, name_en: 'Citrus Berry Fusion',   name_ar: 'حمضيات بالتوت',              desc_en: 'Orange, strawberry, and raspberry blended — antioxidant-rich and deeply vibrant.',                                                       desc_ar: 'برتقال وفراولة وتوت العليق مخفوقة — غني بمضادات الأكسدة ومفعم بالحيوية.',                            img: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&h=450&q=85' },
  // SMOOTHIES
  { id: 's1',  cat: 'smoothies',    price: 85,  popular: true,  name_en: 'Tropical Mango',        name_ar: 'مانجو استوائية',             desc_en: 'Mango, banana and pineapple blended with coconut milk and a drizzle of honey.',                                                          desc_ar: 'مانجو وموز وأناناس مخفوقة مع حليب جوز الهند ورشة من العسل.',                                          img: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 's2',  cat: 'smoothies',    price: 80,  popular: false, name_en: 'Strawberry Bliss',      name_ar: 'نعيم الفراولة',              desc_en: 'Strawberries and Greek yogurt with Madagascar vanilla — thick, rich and dreamy.',                                                          desc_ar: 'فراولة وزبادي يوناني مع فانيليا مدغشقر — كثيف وغني وحالم.',                                          img: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 's3',  cat: 'smoothies',    price: 90,  popular: false, name_en: 'Green Detox',           name_ar: 'ديتوكس أخضر',               desc_en: 'Spinach, apple, cucumber and fresh ginger — clean energy in a glass.',                                                                   desc_ar: 'سبانخ وتفاح وخيار وزنجبيل طازج — طاقة نقية في كوب.',                                                 img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 's4',  cat: 'smoothies',    price: 95,  popular: false, name_en: 'Avocado Dream',         name_ar: 'حلم الأفوكادو',              desc_en: 'Avocado and banana with almond milk and Medjool dates — velvety nourishment.',                                                           desc_ar: 'أفوكادو وموز مع حليب اللوز وتمر المجدول — تغذية ناعمة كالحرير.',                                      img: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=600&h=450&q=85' },
  // DESSERTS
  { id: 'd1',  cat: 'desserts',     price: 95,  popular: true,  name_en: 'Classic Tiramisu',      name_ar: 'تيراميسو كلاسيكي',           desc_en: 'Espresso-soaked ladyfingers layered with Mascarpone cream and Valrhona cocoa.',                                                           desc_ar: 'بسكويت مغموس بالإسبريسو مع طبقات كريمة الماسكاربوني وكاكاو فالرونا.',                                 img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'd2',  cat: 'desserts',     price: 90,  popular: true,  name_en: 'Chocolate Lava Cake',   name_ar: 'كيك الشوكولاتة بقلب سائل',  desc_en: 'Warm Valrhona dark chocolate cake with a molten center, served with vanilla ice cream.',                                                  desc_ar: 'كيك شوكولاتة فالرونا دافئ بقلب سائل، يُقدَّم مع آيس كريم فانيليا.',                                   img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'd3',  cat: 'desserts',     price: 100, popular: false, name_en: 'Crème Brûlée',          name_ar: 'كريم بروليه',                desc_en: 'Classic French vanilla custard with a perfectly torched caramelized sugar crust.',                                                        desc_ar: 'كاسترد فانيليا فرنسي كلاسيكي بقشرة سكر مكرملة محروقة بإتقان.',                                        img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'd4',  cat: 'desserts',     price: 85,  popular: false, name_en: 'New York Cheesecake',   name_ar: 'تشيز كيك نيويورك',           desc_en: 'Dense, creamy cheesecake on graham cracker crust, topped with seasonal berry compote.',                                                   desc_ar: 'تشيز كيك كريمي كثيف على قاعدة بسكويت، يعلوه كومبوت توت موسمي.',                                      img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&h=450&q=85' },
  // SHISHA
  { id: 'sh1', cat: 'shisha',       price: 150, popular: true,  name_en: 'Double Apple',          name_ar: 'تفاحتين',                    desc_en: 'The timeless classic — sweet, smooth double apple with cooling notes. A lounge staple.',                                                  desc_ar: 'الكلاسيكي الخالد — تفاحتين حلو وناعم مع لمسات منعشة. أساس اللاونج.',                                 img: 'https://images.unsplash.com/photo-1574484066826-7b67617fbb27?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'sh2', cat: 'shisha',       price: 150, popular: false, name_en: 'Fresh Mint',            name_ar: 'نعناع طازج',                 desc_en: 'Crisp, cooling mint for a clean, refreshing session — pure and invigorating.',                                                            desc_ar: 'نعناع منعش وبارد لجلسة نقية ومنشّطة.',                                                               img: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2b?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'sh3', cat: 'shisha',       price: 160, popular: false, name_en: 'Grape & Mint',          name_ar: 'عنب ونعناع',                 desc_en: 'Rich Concord grape layered with refreshing mint — a sophisticated combination.',                                                          desc_ar: 'عنب كونكورد غني مع طبقات نعناع منعش — مزيج راقٍ.',                                                   img: 'https://images.unsplash.com/photo-1530092285049-1c42085fd395?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'sh4', cat: 'shisha',       price: 160, popular: true,  name_en: 'Lemon Mint',            name_ar: 'ليمون بالنعناع',             desc_en: 'Zesty citrus and cool mint — a bright, tangy and perfectly refreshing session.',                                                          desc_ar: 'ليمون حامض ونعناع بارد — جلسة منعشة وحادة ومثالية.',                                                  img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'sh5', cat: 'shisha',       price: 170, popular: false, name_en: 'Watermelon Chill',      name_ar: 'بطيخ منعش',                  desc_en: 'Sweet summer watermelon with a hint of cooling mint — light and indulgent.',                                                             desc_ar: 'بطيخ صيفي حلو مع لمسة نعناع منعش — خفيف وفاخر.',                                                     img: 'https://images.unsplash.com/photo-1602008108960-5c4f8df8c5bb?auto=format&fit=crop&w=600&h=450&q=85' },
  // SNACKS
  { id: 'sn1', cat: 'snacks',       price: 110, popular: true,  name_en: 'Club Sandwich',         name_ar: 'كلوب ساندويتش',              desc_en: 'Grilled chicken, crispy turkey bacon, fresh lettuce, tomato and aioli on sourdough.',                                                    desc_ar: 'دجاج مشوي، بيكون تركي مقرمش، خس وطماطم وصلصة أيولي على خبز الساوردو.',                               img: 'https://images.unsplash.com/photo-1539252554935-80c4e09e5e7b?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'sn2', cat: 'snacks',       price: 85,  popular: false, name_en: 'Bruschetta Trio',       name_ar: 'ثلاثية البروشيتا',           desc_en: 'Three house-baked sourdough toasts — tomato basil, wild mushroom and mozzarella.',                                                        desc_ar: 'ثلاث قطع توست ساوردو من المخبز — طماطم بالريحان، فطر بري، وموتزاريلا.',                               img: 'https://images.unsplash.com/photo-1572441710013-deedb1f4cf36?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'sn3', cat: 'snacks',       price: 120, popular: false, name_en: 'Crispy Chicken Strips', name_ar: 'شرائح دجاج مقرمشة',          desc_en: 'Buttermilk-marinated chicken in a golden crust, served with honey mustard and ranch.',                                                    desc_ar: 'دجاج منقوع باللبن الزبادي بقشرة ذهبية، يُقدَّم مع صوص الخردل بالعسل والرانش.',                        img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&h=450&q=85' },
  { id: 'sn4', cat: 'snacks',       price: 135, popular: false, name_en: 'Artisan Cheese Platter',name_ar: 'طبق أجبان فاخر',             desc_en: 'A curated selection of aged cheeses, honeycomb, fig jam and artisan crackers.',                                                           desc_ar: 'تشكيلة منتقاة من الأجبان المعتّقة وخلية العسل ومربى التين والمقرمشات.',                               img: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&h=450&q=85' },
];

// ─── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  const client = new Client({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    user:     process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'pos_db',
  });

  await client.connect();
  console.log('✅ Connected to', process.env.DB_DATABASE || 'pos_db', '\n');

  // ── 1. Upsert categories ──────────────────────────────────────────────────
  console.log('📂 Seeding categories…');
  const catIdMap = {}; // slug → uuid

  for (const cat of CATEGORIES) {
    const existing = await client.query(
      `SELECT id FROM categories WHERE name_en = $1 AND deleted_at IS NULL`,
      [cat.name_en]
    );

    if (existing.rows.length > 0) {
      catIdMap[cat.slug] = existing.rows[0].id;
      console.log(`   ⏭  "${cat.name_en}" already exists (${existing.rows[0].id})`);
    } else {
      const res = await client.query(
        `INSERT INTO categories (name_en, name_ar, sort_order, is_active)
         VALUES ($1, $2, $3, true)
         RETURNING id`,
        [cat.name_en, cat.name_ar, cat.sort_order]
      );
      catIdMap[cat.slug] = res.rows[0].id;
      console.log(`   ✅ Created "${cat.name_en}" (${res.rows[0].id})`);
    }
  }

  // ── 2. Upsert menu items ──────────────────────────────────────────────────
  console.log('\n🍽  Seeding menu items…');
  let created = 0, skipped = 0;

  for (const [i, item] of MENU.entries()) {
    const catId = catIdMap[item.cat];
    if (!catId) {
      console.warn(`   ⚠️  No category found for slug "${item.cat}" — skipping ${item.name_en}`);
      continue;
    }

    const existing = await client.query(
      `SELECT id FROM menu_items WHERE name_en = $1 AND deleted_at IS NULL`,
      [item.name_en]
    );

    if (existing.rows.length > 0) {
      skipped++;
      console.log(`   ⏭  "${item.name_en}" already exists`);
    } else {
      await client.query(
        `INSERT INTO menu_items
           (category_id, name_en, name_ar, description_en, description_ar,
            base_price, image_url, is_active, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8)`,
        [
          catId,
          item.name_en,
          item.name_ar,
          item.desc_en,
          item.desc_ar,
          item.price,
          item.img,
          i + 1,
        ]
      );
      created++;
      console.log(`   ✅ Created "${item.name_en}" — ILS ${item.price}`);
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n📊 Summary:`);
  console.log(`   Categories : ${Object.keys(catIdMap).length} mapped`);
  console.log(`   Menu items : ${created} created, ${skipped} already existed`);

  const { rows: totals } = await client.query(
    `SELECT
       (SELECT count(*) FROM categories WHERE deleted_at IS NULL) AS cats,
       (SELECT count(*) FROM menu_items  WHERE deleted_at IS NULL) AS items`
  );
  console.log(`   DB totals  : ${totals[0].cats} categories, ${totals[0].items} menu items`);

  await client.end();
  console.log('\n✅ Done! Refresh the frontend — categories and menu items are live.\n');
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
