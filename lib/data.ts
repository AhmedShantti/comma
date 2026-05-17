import type {
  CategoryDef,
  MenuItem,
  Stat,
  RevenuePoint,
  CatDatum,
  MostOrderedItem,
  StatusDatum,
  Order,
} from './types';

export const MENU: MenuItem[] = [
  // COFFEES
  {
    id: 'c1', cat: 'coffees', price: 45, popular: false,
    img: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Espresso', ar: 'إسبريسو' },
    desc: {
      en: 'Rich, concentrated shot of premium single-origin arabica, served in a warmed ceramic cup.',
      ar: 'جرعة مركّزة من حبوب العربيكا الفاخرة، تُقدَّم في فنجان سيراميك دافئ.',
    },
    tags: [{ en: 'strong', ar: 'قوي' }, { en: 'classic', ar: 'كلاسيكي' }],
  },
  {
    id: 'c2', cat: 'coffees', price: 55, popular: false,
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Americano', ar: 'أمريكانو' },
    desc: {
      en: 'Double espresso extended with hot water — bold, clean, and deeply satisfying.',
      ar: 'إسبريسو مزدوج ممزوج بالماء الساخن — قوي ونقي ومُرضٍ.',
    },
    tags: [{ en: 'bold', ar: 'جريء' }, { en: 'black', ar: 'سادة' }],
  },
  {
    id: 'c3', cat: 'coffees', price: 65, popular: true,
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Cappuccino', ar: 'كابتشينو' },
    desc: {
      en: 'Perfectly balanced: one-third espresso, one-third steamed milk, one-third velvet foam.',
      ar: 'توازن مثالي: ثلث إسبريسو، ثلث حليب مبخّر، وثلث رغوة ناعمة.',
    },
    tags: [{ en: 'classic', ar: 'كلاسيكي' }, { en: 'creamy', ar: 'كريمي' }],
  },
  {
    id: 'c4', cat: 'coffees', price: 70, popular: false,
    img: 'https://images.unsplash.com/photo-1556742526-795a8eac090e?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Flat White', ar: 'فلات وايت' },
    desc: {
      en: "Double ristretto crowned with velvety microfoam — the coffee lover's choice.",
      ar: 'ريستريتو مزدوج مع رغوة دقيقة ناعمة — اختيار عشّاق القهوة.',
    },
    tags: [{ en: 'strong', ar: 'قوي' }, { en: 'silky', ar: 'حريري' }],
  },
  {
    id: 'c5', cat: 'coffees', price: 50, popular: false,
    img: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Turkish Coffee', ar: 'قهوة تركية' },
    desc: {
      en: 'Slow-brewed with cardamom in a traditional copper cezve — an Eastern ritual in a cup.',
      ar: 'تُحضَّر ببطء مع الهيل في كنكة نحاسية تقليدية — طقس شرقي في فنجان.',
    },
    tags: [{ en: 'traditional', ar: 'تقليدي' }, { en: 'aromatic', ar: 'عطري' }],
  },
  {
    id: 'c6', cat: 'coffees', price: 75, popular: true,
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Signature Latte', ar: 'لاتيه المميّز' },
    desc: {
      en: 'Our house-blend espresso with steamed whole milk and artisan latte art.',
      ar: 'إسبريسو من خلطة المحل مع حليب كامل الدسم مبخّر ورسومات فنية.',
    },
    tags: [{ en: 'smooth', ar: 'ناعم' }, { en: 'creamy', ar: 'كريمي' }],
  },

  // HOT DRINKS
  {
    id: 'h1', cat: 'hot-drinks', price: 85, popular: true,
    img: 'https://images.unsplash.com/photo-1536013455471-9b0a7f8e1bd6?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Matcha Latte', ar: 'ماتشا لاتيه' },
    desc: {
      en: 'Ceremonial-grade Japanese matcha whisked to perfection with silky steamed oat milk.',
      ar: 'ماتشا يابانية فاخرة تُخفق بإتقان مع حليب الشوفان المبخّر الحريري.',
    },
    tags: [{ en: 'earthy', ar: 'ترابي' }, { en: 'energizing', ar: 'منشّط' }],
  },
  {
    id: 'h2', cat: 'hot-drinks', price: 70, popular: false,
    img: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Masala Chai', ar: 'شاي ماسالا' },
    desc: {
      en: 'Spiced Indian black tea with cinnamon, cardamom and clove, topped with frothy milk.',
      ar: 'شاي أسود هندي بالقرفة والهيل والقرنفل، مع طبقة من الحليب المرغّى.',
    },
    tags: [{ en: 'spiced', ar: 'متبّل' }, { en: 'warming', ar: 'دافئ' }],
  },
  {
    id: 'h3', cat: 'hot-drinks', price: 85, popular: false,
    img: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Luxury Hot Chocolate', ar: 'هوت شوكولاتة فاخرة' },
    desc: {
      en: 'Belgian 70% dark chocolate melted with steamed milk and a hint of vanilla truffle.',
      ar: 'شوكولاتة بلجيكية داكنة ٧٠٪ مذابة مع الحليب المبخّر ولمسة فانيليا.',
    },
    tags: [{ en: 'indulgent', ar: 'فاخر' }, { en: 'rich', ar: 'غني' }],
  },
  {
    id: 'h4', cat: 'hot-drinks', price: 80, popular: false,
    img: 'https://images.unsplash.com/photo-1543674892-7d64d45df18b?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Golden Turmeric Latte', ar: 'لاتيه الكركم الذهبي' },
    desc: {
      en: 'Anti-inflammatory spice blend with turmeric, ginger, black pepper and raw honey.',
      ar: 'خلطة توابل صحية بالكركم والزنجبيل والفلفل الأسود والعسل الطبيعي.',
    },
    tags: [{ en: 'wellness', ar: 'صحي' }, { en: 'warming', ar: 'دافئ' }],
  },

  // COLD DRINKS
  {
    id: 'cl1', cat: 'cold-drinks', price: 75, popular: true,
    img: 'https://images.unsplash.com/photo-1556740767-414a9c4860c1?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Iced Signature Latte', ar: 'لاتيه مميّز مثلّج' },
    desc: {
      en: 'Double espresso poured over ice with cold whole milk — the perfect daily ritual.',
      ar: 'إسبريسو مزدوج فوق الثلج مع حليب بارد كامل الدسم — طقس يومي مثالي.',
    },
    tags: [{ en: 'refreshing', ar: 'منعش' }, { en: 'coffee', ar: 'قهوة' }],
  },
  {
    id: 'cl2', cat: 'cold-drinks', price: 80, popular: false,
    img: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Cold Brew', ar: 'كولد برو' },
    desc: {
      en: 'Steeped for 24 hours in cold water — incredibly smooth with naturally low acidity.',
      ar: 'منقوع لمدة ٢٤ ساعة في الماء البارد — ناعم جداً وحموضته طبيعية منخفضة.',
    },
    tags: [{ en: 'strong', ar: 'قوي' }, { en: 'smooth', ar: 'ناعم' }],
  },
  {
    id: 'cl3', cat: 'cold-drinks', price: 85, popular: false,
    img: 'https://images.unsplash.com/photo-1592318951566-da9fe1b86db1?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Iced Matcha', ar: 'ماتشا مثلّجة' },
    desc: {
      en: 'Premium matcha over crushed ice and cold oat milk with a touch of vanilla syrup.',
      ar: 'ماتشا فاخرة فوق الثلج المجروش مع حليب الشوفان البارد ولمسة فانيليا.',
    },
    tags: [{ en: 'earthy', ar: 'ترابي' }, { en: 'refreshing', ar: 'منعش' }],
  },
  {
    id: 'cl4', cat: 'cold-drinks', price: 90, popular: false,
    img: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Rose Frappé', ar: 'فرابيه الورد' },
    desc: {
      en: 'Blended espresso with rose water, vanilla cream and crushed ice — utterly luxurious.',
      ar: 'إسبريسو مخفوق مع ماء الورد وكريمة الفانيليا والثلج المجروش — رفاهية مطلقة.',
    },
    tags: [{ en: 'floral', ar: 'زهري' }, { en: 'blended', ar: 'مخفوق' }],
  },

  // FRESH JUICES
  {
    id: 'j1', cat: 'fresh-juices', price: 60, popular: false,
    img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Freshly Pressed Orange', ar: 'عصير برتقال طازج' },
    desc: {
      en: 'Hand-pressed Valencia oranges — pure, bright and intensely fresh.',
      ar: 'عصير برتقال فالنسيا مضغوط يدوياً — نقي ومنعش ومركّز.',
    },
    tags: [{ en: 'vitamin c', ar: 'فيتامين سي' }, { en: 'classic', ar: 'كلاسيكي' }],
  },
  {
    id: 'j2', cat: 'fresh-juices', price: 70, popular: true,
    img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Mango Sunrise', ar: 'شروق المانجو' },
    desc: {
      en: 'Alphonso mango blended with a hint of ginger and fresh lime — vibrant and tropical.',
      ar: 'مانجو الفونسو مخفوقة مع لمسة زنجبيل وليمون طازج — حيوي واستوائي.',
    },
    tags: [{ en: 'tropical', ar: 'استوائي' }, { en: 'sweet', ar: 'حلو' }],
  },
  {
    id: 'j3', cat: 'fresh-juices', price: 60, popular: false,
    img: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Watermelon Mint', ar: 'بطيخ بالنعناع' },
    desc: {
      en: 'Cold-pressed watermelon with fresh garden mint — the ultimate summer refreshment.',
      ar: 'بطيخ مضغوط بارد مع نعناع طازج — انتعاش الصيف بامتياز.',
    },
    tags: [{ en: 'cooling', ar: 'منعش' }, { en: 'hydrating', ar: 'مرطّب' }],
  },
  {
    id: 'j4', cat: 'fresh-juices', price: 75, popular: false,
    img: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Citrus Berry Fusion', ar: 'حمضيات بالتوت' },
    desc: {
      en: 'Orange, strawberry, and raspberry blended — antioxidant-rich and deeply vibrant.',
      ar: 'برتقال وفراولة وتوت العليق مخفوقة — غني بمضادات الأكسدة ومفعم بالحيوية.',
    },
    tags: [{ en: 'antioxidant', ar: 'مضاد أكسدة' }, { en: 'vibrant', ar: 'حيوي' }],
  },

  // SMOOTHIES
  {
    id: 's1', cat: 'smoothies', price: 85, popular: true,
    img: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Tropical Mango', ar: 'مانجو استوائية' },
    desc: {
      en: 'Mango, banana and pineapple blended with coconut milk and a drizzle of honey.',
      ar: 'مانجو وموز وأناناس مخفوقة مع حليب جوز الهند ورشة من العسل.',
    },
    tags: [{ en: 'tropical', ar: 'استوائي' }, { en: 'creamy', ar: 'كريمي' }],
  },
  {
    id: 's2', cat: 'smoothies', price: 80, popular: false,
    img: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Strawberry Bliss', ar: 'نعيم الفراولة' },
    desc: {
      en: 'Strawberries and Greek yogurt with Madagascar vanilla — thick, rich and dreamy.',
      ar: 'فراولة وزبادي يوناني مع فانيليا مدغشقر — كثيف وغني وحالم.',
    },
    tags: [{ en: 'berry', ar: 'توت' }, { en: 'creamy', ar: 'كريمي' }],
  },
  {
    id: 's3', cat: 'smoothies', price: 90, popular: false,
    img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Green Detox', ar: 'ديتوكس أخضر' },
    desc: {
      en: 'Spinach, apple, cucumber and fresh ginger — clean energy in a glass.',
      ar: 'سبانخ وتفاح وخيار وزنجبيل طازج — طاقة نقية في كوب.',
    },
    tags: [{ en: 'healthy', ar: 'صحي' }, { en: 'clean', ar: 'نقي' }],
  },
  {
    id: 's4', cat: 'smoothies', price: 95, popular: false,
    img: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Avocado Dream', ar: 'حلم الأفوكادو' },
    desc: {
      en: 'Avocado and banana with almond milk and Medjool dates — velvety nourishment.',
      ar: 'أفوكادو وموز مع حليب اللوز وتمر المجدول — تغذية ناعمة كالحرير.',
    },
    tags: [{ en: 'healthy', ar: 'صحي' }, { en: 'filling', ar: 'مشبع' }],
  },

  // DESSERTS
  {
    id: 'd1', cat: 'desserts', price: 95, popular: true,
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Classic Tiramisu', ar: 'تيراميسو كلاسيكي' },
    desc: {
      en: 'Espresso-soaked ladyfingers layered with Mascarpone cream and Valrhona cocoa.',
      ar: 'بسكويت مغموس بالإسبريسو مع طبقات كريمة الماسكاربوني وكاكاو فالرونا.',
    },
    tags: [{ en: 'italian', ar: 'إيطالي' }, { en: 'coffee', ar: 'قهوة' }],
  },
  {
    id: 'd2', cat: 'desserts', price: 90, popular: true,
    img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Chocolate Lava Cake', ar: 'كيك الشوكولاتة بقلب سائل' },
    desc: {
      en: 'Warm Valrhona dark chocolate cake with a molten center, served with vanilla ice cream.',
      ar: 'كيك شوكولاتة فالرونا دافئ بقلب سائل، يُقدَّم مع آيس كريم فانيليا.',
    },
    tags: [{ en: 'chocolate', ar: 'شوكولاتة' }, { en: 'warm', ar: 'دافئ' }],
  },
  {
    id: 'd3', cat: 'desserts', price: 100, popular: false,
    img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Crème Brûlée', ar: 'كريم بروليه' },
    desc: {
      en: 'Classic French vanilla custard with a perfectly torched caramelized sugar crust.',
      ar: 'كاسترد فانيليا فرنسي كلاسيكي بقشرة سكر مكرملة محروقة بإتقان.',
    },
    tags: [{ en: 'french', ar: 'فرنسي' }, { en: 'elegant', ar: 'أنيق' }],
  },
  {
    id: 'd4', cat: 'desserts', price: 85, popular: false,
    img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'New York Cheesecake', ar: 'تشيز كيك نيويورك' },
    desc: {
      en: 'Dense, creamy cheesecake on graham cracker crust, topped with seasonal berry compote.',
      ar: 'تشيز كيك كريمي كثيف على قاعدة بسكويت، يعلوه كومبوت توت موسمي.',
    },
    tags: [{ en: 'creamy', ar: 'كريمي' }, { en: 'sweet', ar: 'حلو' }],
  },

  // SHISHA
  {
    id: 'sh1', cat: 'shisha', price: 150, popular: true,
    img: 'https://images.unsplash.com/photo-1574484066826-7b67617fbb27?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Double Apple', ar: 'تفاحتين' },
    desc: {
      en: 'The timeless classic — sweet, smooth double apple with cooling notes. A lounge staple.',
      ar: 'الكلاسيكي الخالد — تفاحتين حلو وناعم مع لمسات منعشة. أساس اللاونج.',
    },
    tags: [{ en: 'classic', ar: 'كلاسيكي' }, { en: 'sweet', ar: 'حلو' }],
  },
  {
    id: 'sh2', cat: 'shisha', price: 150, popular: false,
    img: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2b?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Fresh Mint', ar: 'نعناع طازج' },
    desc: {
      en: 'Crisp, cooling mint for a clean, refreshing session — pure and invigorating.',
      ar: 'نعناع منعش وبارد لجلسة نقية ومنشّطة.',
    },
    tags: [{ en: 'cooling', ar: 'منعش' }, { en: 'clean', ar: 'نقي' }],
  },
  {
    id: 'sh3', cat: 'shisha', price: 160, popular: false,
    img: 'https://images.unsplash.com/photo-1530092285049-1c42085fd395?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Grape & Mint', ar: 'عنب ونعناع' },
    desc: {
      en: 'Rich Concord grape layered with refreshing mint — a sophisticated combination.',
      ar: 'عنب كونكورد غني مع طبقات نعناع منعش — مزيج راقٍ.',
    },
    tags: [{ en: 'fruity', ar: 'فاكهي' }, { en: 'cooling', ar: 'منعش' }],
  },
  {
    id: 'sh4', cat: 'shisha', price: 160, popular: true,
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Lemon Mint', ar: 'ليمون بالنعناع' },
    desc: {
      en: 'Zesty citrus and cool mint — a bright, tangy and perfectly refreshing session.',
      ar: 'ليمون حامض ونعناع بارد — جلسة منعشة وحادة ومثالية.',
    },
    tags: [{ en: 'citrus', ar: 'حمضيات' }, { en: 'refreshing', ar: 'منعش' }],
  },
  {
    id: 'sh5', cat: 'shisha', price: 170, popular: false,
    img: 'https://images.unsplash.com/photo-1602008108960-5c4f8df8c5bb?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Watermelon Chill', ar: 'بطيخ منعش' },
    desc: {
      en: 'Sweet summer watermelon with a hint of cooling mint — light and indulgent.',
      ar: 'بطيخ صيفي حلو مع لمسة نعناع منعش — خفيف وفاخر.',
    },
    tags: [{ en: 'fruity', ar: 'فاكهي' }, { en: 'sweet', ar: 'حلو' }],
  },

  // SNACKS
  {
    id: 'sn1', cat: 'snacks', price: 110, popular: true,
    img: 'https://images.unsplash.com/photo-1539252554935-80c4e09e5e7b?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Club Sandwich', ar: 'كلوب ساندويتش' },
    desc: {
      en: 'Grilled chicken, crispy turkey bacon, fresh lettuce, tomato and aioli on sourdough.',
      ar: 'دجاج مشوي، بيكون تركي مقرمش، خس وطماطم وصلصة أيولي على خبز الساوردو.',
    },
    tags: [{ en: 'hearty', ar: 'مشبع' }, { en: 'chicken', ar: 'دجاج' }],
  },
  {
    id: 'sn2', cat: 'snacks', price: 85, popular: false,
    img: 'https://images.unsplash.com/photo-1572441710013-deedb1f4cf36?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Bruschetta Trio', ar: 'ثلاثية البروشيتا' },
    desc: {
      en: 'Three house-baked sourdough toasts — tomato basil, wild mushroom and mozzarella.',
      ar: 'ثلاث قطع توست ساوردو من المخبز — طماطم بالريحان، فطر بري، وموتزاريلا.',
    },
    tags: [{ en: 'light', ar: 'خفيف' }, { en: 'italian', ar: 'إيطالي' }],
  },
  {
    id: 'sn3', cat: 'snacks', price: 120, popular: false,
    img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Crispy Chicken Strips', ar: 'شرائح دجاج مقرمشة' },
    desc: {
      en: 'Buttermilk-marinated chicken in a golden crust, served with honey mustard and ranch.',
      ar: 'دجاج منقوع باللبن الزبادي بقشرة ذهبية، يُقدَّم مع صوص الخردل بالعسل والرانش.',
    },
    tags: [{ en: 'crispy', ar: 'مقرمش' }, { en: 'chicken', ar: 'دجاج' }],
  },
  {
    id: 'sn4', cat: 'snacks', price: 135, popular: false,
    img: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&h=450&q=85',
    name: { en: 'Artisan Cheese Platter', ar: 'طبق أجبان فاخر' },
    desc: {
      en: 'A curated selection of aged cheeses, honeycomb, fig jam and artisan crackers.',
      ar: 'تشكيلة منتقاة من الأجبان المعتّقة وخلية العسل ومربى التين والمقرمشات.',
    },
    tags: [{ en: 'sharing', ar: 'للمشاركة' }, { en: 'elegant', ar: 'أنيق' }],
  },
];

export const CATEGORIES: CategoryDef[] = [
  { slug: 'all', labelKey: 'cat_all' },
  { slug: 'coffees', labelKey: 'cat_coffees' },
  { slug: 'hot-drinks', labelKey: 'cat_hot_drinks' },
  { slug: 'cold-drinks', labelKey: 'cat_cold_drinks' },
  { slug: 'fresh-juices', labelKey: 'cat_fresh_juices' },
  { slug: 'smoothies', labelKey: 'cat_smoothies' },
  { slug: 'desserts', labelKey: 'cat_desserts' },
  { slug: 'shisha', labelKey: 'cat_shisha' },
  { slug: 'snacks', labelKey: 'cat_snacks' },
];

export const STATS: Stat[] = [
  {
    labelKey: 'total_orders', value: '1,247', change: '+12%', up: true,
    icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  },
  {
    labelKey: 'revenue_egp', value: '89,450', change: '+8%', up: true,
    icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  },
  {
    labelKey: 'total_customers', value: '843', change: '+15%', up: true,
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    labelKey: 'active_orders', value: '23', change: '-3', up: false,
    icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
];

export const REVENUE_DATA: RevenuePoint[] = [
  { dayKey: 'day_mon', v: 12400 },
  { dayKey: 'day_tue', v: 18500 },
  { dayKey: 'day_wed', v: 14200 },
  { dayKey: 'day_thu', v: 22800 },
  { dayKey: 'day_fri', v: 31600 },
  { dayKey: 'day_sat', v: 38900 },
  { dayKey: 'day_sun', v: 28450 },
];

export const CAT_DATA: CatDatum[] = [
  { catSlug: 'coffees', val: 342, pct: 100 },
  { catSlug: 'shisha', val: 287, pct: 84 },
  { catSlug: 'cold-drinks', val: 198, pct: 58 },
  { catSlug: 'desserts', val: 156, pct: 46 },
  { catSlug: 'hot-drinks', val: 143, pct: 42 },
  { catSlug: 'snacks', val: 121, pct: 35 },
];

export const MOST_ORDERED: MostOrderedItem[] = [
  { name: { en: 'Lemon Mint Shisha', ar: 'شيشة ليمون بالنعناع' }, orders: 187, revenue: 29920, pct: 100 },
  { name: { en: 'Signature Latte', ar: 'لاتيه المميّز' }, orders: 163, revenue: 12225, pct: 87 },
  { name: { en: 'Cappuccino', ar: 'كابتشينو' }, orders: 149, revenue: 9685, pct: 80 },
  { name: { en: 'Double Apple Shisha', ar: 'شيشة تفاحتين' }, orders: 134, revenue: 20100, pct: 72 },
  { name: { en: 'Chocolate Lava Cake', ar: 'كيك الشوكولاتة بقلب سائل' }, orders: 112, revenue: 10080, pct: 60 },
  { name: { en: 'Cold Brew', ar: 'كولد برو' }, orders: 98, revenue: 7840, pct: 52 },
];

export const STATUS_DATA: StatusDatum[] = [
  { status: 'Completed', statusKey: 'completed', count: 834, color: '#4caf7d', cls: 'badge-completed' },
  { status: 'Preparing', statusKey: 'preparing', count: 203, color: '#5b8db8', cls: 'badge-preparing' },
  { status: 'Pending', statusKey: 'pending', count: 156, color: '#e8a838', cls: 'badge-pending' },
  { status: 'Cancelled', statusKey: 'cancelled', count: 54, color: '#d45454', cls: 'badge-cancelled' },
];

export const ORDERS: Order[] = [
  {
    id: '#ORD-1024', table: 'T-04', total: 310, status: 'Preparing', statusKey: 'preparing', time: '2 min ago',
    cust: { en: 'Ahmed K.', ar: 'أحمد ك.' },
    items: { en: 'Lemon Mint Shisha, Cold Brew x2', ar: 'شيشة ليمون بالنعناع، كولد برو ×٢' },
  },
  {
    id: '#ORD-1023', table: 'T-11', total: 225, status: 'Completed', statusKey: 'completed', time: '8 min ago',
    cust: { en: 'Sara M.', ar: 'سارة م.' },
    items: { en: 'Cappuccino x2, Tiramisu', ar: 'كابتشينو ×٢، تيراميسو' },
  },
  {
    id: '#ORD-1022', table: 'T-07', total: 260, status: 'Pending', statusKey: 'pending', time: '12 min ago',
    cust: { en: 'Omar F.', ar: 'عمر ف.' },
    items: { en: 'Double Apple Shisha, Club Sandwich', ar: 'شيشة تفاحتين، كلوب ساندويتش' },
  },
  {
    id: '#ORD-1021', table: 'T-02', total: 185, status: 'Completed', statusKey: 'completed', time: '19 min ago',
    cust: { en: 'Nour A.', ar: 'نور أ.' },
    items: { en: 'Matcha Latte, Crème Brûlée', ar: 'ماتشا لاتيه، كريم بروليه' },
  },
  {
    id: '#ORD-1020', table: 'T-09', total: 255, status: 'Completed', statusKey: 'completed', time: '25 min ago',
    cust: { en: 'Karim H.', ar: 'كريم ه.' },
    items: { en: 'Tropical Mango x3', ar: 'مانجو استوائية ×٣' },
  },
  {
    id: '#ORD-1019', table: 'T-15', total: 350, status: 'Cancelled', statusKey: 'cancelled', time: '31 min ago',
    cust: { en: 'Lina Z.', ar: 'لينا ز.' },
    items: { en: 'Rose Frappé x2, Cheesecake x2', ar: 'فرابيه الورد ×٢، تشيز كيك ×٢' },
  },
  {
    id: '#ORD-1018', table: 'T-06', total: 425, status: 'Preparing', statusKey: 'preparing', time: '37 min ago',
    cust: { en: 'Hassan R.', ar: 'حسن ر.' },
    items: { en: 'Watermelon Shisha x2, Bruschetta', ar: 'شيشة بطيخ ×٢، بروشيتا' },
  },
  {
    id: '#ORD-1017', table: 'T-03', total: 165, status: 'Completed', statusKey: 'completed', time: '45 min ago',
    cust: { en: 'Dina S.', ar: 'دينا س.' },
    items: { en: 'Signature Latte, Lava Cake', ar: 'لاتيه المميّز، كيك بقلب سائل' },
  },
];
