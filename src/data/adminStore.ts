import keshtota from "@/assets/cat-keshtota.jpg";
import icecream from "@/assets/cat-icecream.jpg";
import cake from "@/assets/cat-cake.jpg";
import oriental from "@/assets/cat-oriental.jpg";
import mainDish from "@/assets/cat-main.jpg";
import drinks from "@/assets/cat-drinks.jpg";
import heroCake from "@/assets/hero-cake.jpg";
import aboutStore from "@/assets/about-store.jpg";

// ==================== CATEGORIES ====================
export interface CategoryItem {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  image: string;
  productsCount: number;
  order: number;
  isActive: boolean;
}

export const initialCategories: CategoryItem[] = [
  { id: "cat-1", name: "قشطوطة", nameEn: "Keshtota", slug: "keshtota", image: keshtota, productsCount: 8, order: 1, isActive: true },
  { id: "cat-2", name: "آيس كريم", nameEn: "Ice Cream", slug: "icecream", image: icecream, productsCount: 12, order: 2, isActive: true },
  { id: "cat-3", name: "كيك وتورت", nameEn: "Cakes", slug: "cake", image: cake, productsCount: 10, order: 3, isActive: true },
  { id: "cat-4", name: "حلويات شرقية", nameEn: "Oriental Sweets", slug: "oriental", image: oriental, productsCount: 14, order: 4, isActive: true },
  { id: "cat-5", name: "أطباق رئيسية", nameEn: "Main Dishes", slug: "main", image: mainDish, productsCount: 9, order: 5, isActive: true },
  { id: "cat-6", name: "مشروبات طازجة", nameEn: "Beverages", slug: "drinks", image: drinks, productsCount: 11, order: 6, isActive: true },
];

// ==================== BRANDS ====================
export interface BrandItem {
  id: string;
  name: string;
  origin: string;
  description: string;
  productsCount: number;
  isActive: boolean;
}

export const initialBrands: BrandItem[] = [
  { id: "brand-1", name: "وزير الحلو الخاص", origin: "مصر", description: "خلطات ومنتجات حصرية من مطابخ وزير الحلو", productsCount: 28, isActive: true },
  { id: "brand-2", name: "نوتيلا (Nutella)", origin: "إيطاليا", description: "شوكولاتة البندق الإيطالية الأصلية", productsCount: 14, isActive: true },
  { id: "brand-3", name: "لوتس بيسكوف (Lotus)", origin: "بلجيكا", description: "بسكويت وزبدة اللوتس الأصلية", productsCount: 9, isActive: true },
  { id: "brand-4", name: "كادبوري (Cadbury)", origin: "المملكة المتحدة", description: "شوكولاتة الحليب الفاخرة", productsCount: 8, isActive: true },
  { id: "brand-5", name: "لورباك (Lurpak)", origin: "الدنمارك", description: "زبدة طبيعية نقية للحلويات الشرقية", productsCount: 12, isActive: true },
  { id: "brand-6", name: "المراعي (Almarai)", origin: "السعودية", description: "حليب وقشطة طبيعية طازجة", productsCount: 16, isActive: true },
];

// ==================== OFFERS ====================
export interface OfferItem {
  id: string;
  title: string;
  badge: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  targetCategory: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImage: string;
}

export const initialOffers: OfferItem[] = [
  {
    id: "off-1",
    title: "عرض القشطوطة الملكية",
    badge: "خصم 25%",
    discountType: "percentage",
    discountValue: 25,
    targetCategory: "قشطوطة",
    startDate: "2026-09-20",
    endDate: "2026-09-30",
    isActive: true,
    bannerImage: keshtota,
  },
  {
    id: "off-2",
    title: "بوكس التوفير العائلي كيك وحلويات",
    badge: "وفر 60 ج.م",
    discountType: "fixed",
    discountValue: 60,
    targetCategory: "كيك وتورت",
    startDate: "2026-09-15",
    endDate: "2026-10-05",
    isActive: true,
    bannerImage: heroCake,
  },
  {
    id: "off-3",
    title: "انتعاش الصيف: آيس كريم ومشروبات",
    badge: "1+1 مجاناً",
    discountType: "percentage",
    discountValue: 50,
    targetCategory: "آيس كريم",
    startDate: "2026-09-01",
    endDate: "2026-09-28",
    isActive: false,
    bannerImage: icecream,
  },
];

// ==================== LOCATIONS ====================
export interface LocationItem {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  manager: string;
  radiusKm: number;
  minOrder: number;
  deliveryFee: number;
  workingHours: string;
  isActive: boolean;
}

export const initialLocations: LocationItem[] = [
  {
    id: "loc-1",
    name: "فرع موقف الخصوص (الرئيسي)",
    address: "ميدان موقف الخصوص، بجوار محطة النقل، الخصوص",
    city: "القليوبية / القاهرة الكبرى",
    phone: "+20 122 228 1651",
    manager: "أحمد الفخراني",
    radiusKm: 15,
    minOrder: 80,
    deliveryFee: 15,
    workingHours: "10:00 ص - 02:00 ص",
    isActive: true,
  },
  {
    id: "loc-2",
    name: "فرع مدينة العبور",
    address: "الحي الأول، سنتر العبور التجاري",
    city: "القليوبية",
    phone: "+20 122 228 1652",
    manager: "كريم شريف",
    radiusKm: 12,
    minOrder: 100,
    deliveryFee: 20,
    workingHours: "11:00 ص - 01:00 ص",
    isActive: true,
  },
  {
    id: "loc-3",
    name: "فرع مصر الجديدة",
    address: "شارع الأهرام، روكسي، مصر الجديدة",
    city: "القاهرة",
    phone: "+20 122 228 1653",
    manager: "محمد عبد الهادي",
    radiusKm: 10,
    minOrder: 120,
    deliveryFee: 25,
    workingHours: "10:00 ص - 02:00 ص",
    isActive: false,
  },
];

// ==================== SLIDERS ====================
export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  link: string;
  image: string;
  order: number;
  isActive: boolean;
}

export const initialSliders: SliderItem[] = [
  {
    id: "sld-1",
    title: "الحلو دايمًا بمزاجك",
    subtitle: "أشهى الحلويات الشرقية والغربية والمأكولات الطازجة محضرة بأجود المكونات",
    badge: "الأكثر طلباً",
    buttonText: "اطلب الآن",
    link: "/menu",
    image: heroCake,
    order: 1,
    isActive: true,
  },
  {
    id: "sld-2",
    title: "قشطوطة وزير الحلو الأصلية",
    subtitle: "طبقات الحليب والكراميل والمكسرات الفاخرة بطعم لا يقاوم",
    badge: "عرض خاص",
    buttonText: "تصفح القشطوطة",
    link: "/menu?category=keshtota",
    image: keshtota,
    order: 2,
    isActive: true,
  },
  {
    id: "sld-3",
    title: "نظام نقاط البيع السريع",
    subtitle: "خدمة فورية لرواد الفروع وطلبات التيك أواي مع أسرع كاشير",
    badge: "خدمة الفروع",
    buttonText: "اكتشف نقاط البيع",
    link: "/pos",
    image: aboutStore,
    order: 3,
    isActive: false,
  },
];

// ==================== COUPONS ====================
export interface CouponItem {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSpend: number;
  usageLimit: number;
  usageCount: number;
  expiryDate: string;
  isActive: boolean;
}

export const initialCoupons: CouponItem[] = [
  { id: "cpn-1", code: "WAZEER15", discountType: "percentage", discountValue: 15, minSpend: 150, usageLimit: 500, usageCount: 142, expiryDate: "2026-10-31", isActive: true },
  { id: "cpn-2", code: "SWEET50", discountType: "fixed", discountValue: 50, minSpend: 300, usageLimit: 200, usageCount: 189, expiryDate: "2026-10-15", isActive: true },
  { id: "cpn-3", code: "WELCOME", discountType: "percentage", discountValue: 20, minSpend: 100, usageLimit: 1000, usageCount: 630, expiryDate: "2026-12-31", isActive: true },
  { id: "cpn-4", code: "FRIDAY", discountType: "fixed", discountValue: 30, minSpend: 200, usageLimit: 100, usageCount: 100, expiryDate: "2026-09-25", isActive: false },
];

// ==================== DELIVERY BOYS ====================
export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  vehicle: "سكوتر" | "دراجة نارية" | "سيارة";
  branch: string;
  status: "متاح" | "في الطريق" | "غير متاح";
  activeOrders: number;
  completedOrders: number;
  rating: number;
  joinedDate: string;
}

export const initialDeliveryBoys: DeliveryBoy[] = [
  { id: "dr-1", name: "محمود حسن", phone: "+20 100 456 7891", nationalId: "29801011234567", vehicle: "سكوتر", branch: "موقف الخصوص", status: "متاح", activeOrders: 0, completedOrders: 428, rating: 4.9, joinedDate: "2025-03-10" },
  { id: "dr-2", name: "إسلام صبحي", phone: "+20 111 890 1234", nationalId: "29905051234568", vehicle: "دراجة نارية", branch: "موقف الخصوص", status: "في الطريق", activeOrders: 2, completedOrders: 315, rating: 4.8, joinedDate: "2025-06-15" },
  { id: "dr-3", name: "أحمد رجب", phone: "+20 122 345 6789", nationalId: "29512121234569", vehicle: "سكوتر", branch: "مدينة العبور", status: "متاح", activeOrders: 0, completedOrders: 512, rating: 4.95, joinedDate: "2024-11-01" },
  { id: "dr-4", name: "طارق سليم", phone: "+20 109 234 5678", nationalId: "30008081234570", vehicle: "سيارة", branch: "موقف الخصوص", status: "غير متاح", activeOrders: 0, completedOrders: 184, rating: 4.7, joinedDate: "2026-01-20" },
];

// ==================== SUPPORT TICKETS ====================
export interface SupportTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  subject: string;
  category: "طلب متأخر" | "استفسار قائمة" | "جودة المنتج" | "اقتراح أو شكوى";
  priority: "عالية" | "متوسطة" | "منخفضة";
  status: "جديد" | "قيد المتابعة" | "تم الحل";
  createdAt: string;
  message: string;
}

export const initialSupportTickets: SupportTicket[] = [
  { id: "TCK-1082", customerName: "سارة علي", customerPhone: "+20 102 334 4556", subject: "استفسار عن مكونات تورتة الفواكه لوجود حساسية", category: "استفسار قائمة", priority: "متوسطة", status: "جديد", createdAt: "منذ 15 دقيقة", message: "هل تورتة الفواكه تحتوي على مكسرات في الكريمة أو الحشو؟ أريد التأكد قبل الطلب." },
  { id: "TCK-1081", customerName: "عمر فاروق", customerPhone: "+20 114 998 8776", subject: "تأخر وصول الطلب رقم #ORD-2041", category: "طلب متأخر", priority: "عالية", status: "قيد المتابعة", createdAt: "منذ ساعة", message: "الطلب مكتوب في الطريق منذ 45 دقيقة ولم يصل المندوب بعد، برجاء الإفادة." },
  { id: "TCK-1080", customerName: "ياسمين كمال", customerPhone: "+20 120 776 5544", subject: "شكر على جودة القشطوطة والتغليف الرائع", category: "اقتراح أو شكوى", priority: "منخفضة", status: "تم الحل", createdAt: "منذ 3 ساعات", message: "أشكركم جداً على الخدمة الممتازة وتغليف الحلويات وصل بارداً وممتازاً." },
];

// ==================== BLOGS ====================
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  isPublished: boolean;
}

export const initialBlogs: BlogPost[] = [
  {
    id: "blg-1",
    title: "أسرار القشطوطة الأصلية: من أين بدأت ولماذا يعشقها الجميع؟",
    slug: "secrets-of-keshtota",
    author: "شيف الحلويات / وزير الحلو",
    category: "حلويات شرقية",
    readTime: "4 دقائق",
    date: "2026-09-18",
    image: keshtota,
    excerpt: "تعرف على تاريخ حلوى القشطوطة الشهيرة، وسر الحليب المكثف والقشطة البلدية التي تصنع الفارق في كل ملعقة.",
    isPublished: true,
  },
  {
    id: "blg-2",
    title: "دليل اختيار تورتة المناسبات وأعياد الميلاد المثالية",
    slug: "cake-selection-guide",
    author: "فريق التحرير",
    category: "كيك وتورت",
    readTime: "5 دقائق",
    date: "2026-09-10",
    image: heroCake,
    excerpt: "كيف تختار الحجم والنكهات المناسبة لحفلتك أو مناسبتك الخاصة مع نصائح لحفظ الكيك بأعلى طزاجة.",
    isPublished: true,
  },
  {
    id: "blg-3",
    title: "طريقة عمل الأرز باللبن والمستكة على أصوله في المنزل",
    slug: "rice-pudding-recipe",
    author: "شيف وزير الحلو",
    category: "وصفات",
    readTime: "6 دقائق",
    date: "2026-08-28",
    image: oriental,
    excerpt: "خطوات بسيطة للحصول على قوام كريمي وغني للأرز باللبن مع لمسة المستكة ومكسرات البندق المحمصة.",
    isPublished: false,
  },
];

// ==================== LEGAL PAGES ====================
export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  lastUpdated: string;
  content: string;
}

export const initialLegalPages: LegalPage[] = [
  {
    id: "terms",
    title: "الشروط والأحكام",
    slug: "terms-and-conditions",
    lastUpdated: "2026-09-01",
    content: "مرحباً بكم في وزير الحلو. باستخدامكم لموقعنا وتطبيقاتنا وطلب منتجاتنا، فإنكم توافقون على الالتزام بكافة الشروط والأحكام المنصوص عليها هنا. نحتفظ بالحق في تعديل الأسعار والعروض في أي وقت وفقاً لتوفر المواد الخام وظروف التشغيل.",
  },
  {
    id: "privacy",
    title: "سياسة الخصوصية",
    slug: "privacy-policy",
    lastUpdated: "2026-09-01",
    content: "نحن في وزير الحلو نلتزم بحماية خصوصية بيانات عملائنا. لا يتم جمع سوى المعلومات الضرورية لتوصيل الطلبات وتأكيد هويتكم (الاسم، رقم الهاتف، العنوان). نضمن عدم بيع أو مشاركة بياناتكم مع أي طرف ثالث لأغراض تسويقية غير مصرح بها.",
  },
  {
    id: "delivery",
    title: "سياسة التوصيل والاسترجاع",
    slug: "delivery-and-refund",
    lastUpdated: "2026-09-15",
    content: "نظراً لطبيعة المنتجات الغذائية والحلويات الطازجة سريعة التلف، يُرجى فحص الطلب عند الاستلام من المندوب فوراً. في حال وجود أي خطأ في الصنف أو عيب في جودة المنتج، يتم استبداله فوراً أو استرداد المبلغ كاملاً.",
  },
  {
    id: "faq",
    title: "الأسئلة الشائعة",
    slug: "faq",
    lastUpdated: "2026-09-10",
    content: "س: ما هي ساعات العمل والتوصيل؟\nج: نعمل يومياً من الساعة 10 صباحاً وحتى 2 بعد منتصف الليل.\n\nس: هل تتوفر خدمة تجهيز بوفيهات المناسبات؟\nج: نعم، يرجى التواصل مسبقاً قبل 48 ساعة على الأقل لتجهيز طلبيات الحفلات الكبيرة.",
  },
];

// ==================== SEO CONFIG ====================
export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  canonicalUrl: string;
  allowRobotsIndexing: boolean;
}

export const initialSeoConfig: SeoConfig = {
  metaTitle: "وزير الحلو | أشهى الحلويات الشرقية والغربية في مصر",
  metaDescription: "اطلب أونلاين أشهى قشطوطة، كيك، آيس كريم، وحلويات شرقية وغربية طازجة من وزير الحلو. توصيل سريع لجميع مناطق الخصوص والقاهرة.",
  keywords: "وزير الحلو, قشطوطة, حلويات شرقية, كيك, آيس كريم, حلويات الخصوص, حلويات مصر",
  ogImage: "/wazeer-emblem.png",
  googleAnalyticsId: "G-WZELHELW2026",
  facebookPixelId: "PIX-98234123",
  canonicalUrl: "https://wazeerelhelw.com",
  allowRobotsIndexing: true,
};

// ==================== SECURITY ====================
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "سوبر أدمن" | "مدير فرع" | "محاسب / كاشير";
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface LoginAuditLog {
  id: string;
  user: string;
  ip: string;
  device: string;
  location: string;
  timestamp: string;
  status: "ناجح" | "محاولة فاشلة";
}

export const initialAdminUsers: AdminUser[] = [
  { id: "adm-1", name: "المدير العام", email: "admin@wazeerelhelw.com", role: "سوبر أدمن", lastLogin: "الآن (نشط)", twoFactorEnabled: true },
  { id: "adm-2", name: "مدير فرع الخصوص", email: "khosos@wazeerelhelw.com", role: "مدير فرع", lastLogin: "منذ ساعتين", twoFactorEnabled: false },
  { id: "adm-3", name: "كاشير الصباح", email: "cashier1@wazeerelhelw.com", role: "محاسب / كاشير", lastLogin: "منذ 6 ساعات", twoFactorEnabled: false },
];

export const initialAuditLogs: LoginAuditLog[] = [
  { id: "log-1", user: "المدير العام", ip: "156.204.12.89", device: "Chrome / Windows 11", location: "القاهرة، مصر", timestamp: "اليوم 10:14 م", status: "ناجح" },
  { id: "log-2", user: "مدير فرع الخصوص", ip: "197.35.88.14", device: "Safari / iPhone 15", location: "القليوبية، مصر", timestamp: "اليوم 08:30 م", status: "ناجح" },
  { id: "log-3", user: "غير معروف", ip: "185.220.101.5", device: "Firefox / Linux", location: "أمستردام، هولندا", timestamp: "أمس 03:15 ص", status: "محاولة فاشلة" },
];

// ==================== DELIVERY ZONES ====================
export interface DeliveryZoneItem {
  id: string;
  city: string;
  district: string;
  cost: number;
  qty: number;
  unit: "طلب" | "كجم" | "قطعة" | "وجبة" | "بوكس";
  estimatedTime: string;
  isActive: boolean;
}

export const initialDeliveryZones: DeliveryZoneItem[] = [
  { id: "zn-1", city: "الخصوص", district: "موقف الخصوص والميدان", cost: 15, qty: 1, unit: "طلب", estimatedTime: "25-35 دقيقة", isActive: true },
  { id: "zn-2", city: "الخصوص", district: "شارع الترعة ومحطة الرشاح", cost: 15, qty: 1, unit: "طلب", estimatedTime: "30-40 دقيقة", isActive: true },
  { id: "zn-3", city: "القاهرة", district: "المطرية وعين شمس", cost: 25, qty: 1, unit: "طلب", estimatedTime: "40-50 دقيقة", isActive: true },
  { id: "zn-4", city: "القاهرة", district: "مصر الجديدة وروكسي", cost: 35, qty: 1, unit: "طلب", estimatedTime: "45-60 دقيقة", isActive: true },
  { id: "zn-5", city: "القليوبية", district: "مدينة العبور - الحي الأول والتجاري", cost: 30, qty: 1, unit: "طلب", estimatedTime: "35-45 دقيقة", isActive: true },
  { id: "zn-6", city: "القليوبية", district: "شبرا الخيمة وبهتيم", cost: 25, qty: 1, unit: "طلب", estimatedTime: "35-50 دقيقة", isActive: false },
];

// ==================== SETTINGS (CORE, SMTP, SMS, ROLES, PERMISSIONS) ====================
export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  senderName: string;
  senderEmail: string;
  encryption: "TLS" | "SSL" | "None";
}

export interface SmsSettings {
  provider: "Vodafone SMS" | "SMS Misr" | "Orange Business" | "Twilio";
  apiKey: string;
  senderId: string;
  sendOnNewOrder: boolean;
  sendOnDispatch: boolean;
  sendOnDelivered: boolean;
}

export interface AdminPagePermission {
  id: string;
  label: string;
  path: string;
  category: string;
}

export const availableAdminPages: AdminPagePermission[] = [
  { id: "dashboard", label: "لوحة التحكم الرئيسية", path: "/admin", category: "الرئيسية" },
  { id: "orders", label: "الطلبات والمبيعات", path: "/admin/orders", category: "الرئيسية" },
  { id: "reports", label: "التقارير المالية", path: "/admin/reports", category: "الرئيسية" },
  { id: "products", label: "المنتجات والأصناف", path: "/admin/products", category: "الكتالوج" },
  { id: "categories", label: "الأقسام والتصنيفات", path: "/admin/categories", category: "الكتالوج" },
  { id: "brands", label: "العلامات التجارية", path: "/admin/brands", category: "الكتالوج" },
  { id: "sliders", label: "السلايدر والبانرات", path: "/admin/sliders", category: "الكتالوج" },
  { id: "offers", label: "العروض والخصومات", path: "/admin/offers", category: "التسويق" },
  { id: "coupons", label: "كوبونات الخصم", path: "/admin/coupons", category: "التسويق" },
  { id: "locations", label: "الفروع ومناطق التوصيل", path: "/admin/locations", category: "العمليات" },
  { id: "delivery", label: "مناديب التوصيل والأسطول", path: "/admin/delivery", category: "العمليات" },
  { id: "support", label: "الدعم الفني وخدمة العملاء", path: "/admin/support", category: "العمليات" },
  { id: "blogs", label: "المدونة والوصفات", path: "/admin/blogs", category: "المحتوى" },
  { id: "legal", label: "الصفحات القانونية والسياسات", path: "/admin/legal", category: "المحتوى" },
  { id: "seo", label: "تحسين محركات البحث", path: "/admin/seo", category: "النظام" },
  { id: "security", label: "الأمان وسجل الدخول", path: "/admin/security", category: "النظام" },
  { id: "settings", label: "إعدادات المتجر العامة", path: "/admin/settings", category: "النظام" },
];

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  allowedPages: string[];
}

export const initialRoles: RolePermission[] = [
  {
    id: "role-super",
    name: "سوبر أدمن (Super Admin)",
    description: "كامل الصلاحيات لإدارة كافة أقسام النظام والبيانات المالية والإعدادات",
    usersCount: 2,
    canRead: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    allowedPages: availableAdminPages.map((p) => p.id),
  },
  {
    id: "role-manager",
    name: "مدير فرع (Branch Manager)",
    description: "إدارة الطلبات، متابعة المنتجات والمخزون، ومناديب التوصيل",
    usersCount: 3,
    canRead: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canExport: true,
    allowedPages: ["dashboard", "orders", "reports", "products", "categories", "locations", "delivery", "support"],
  },
  {
    id: "role-cashier",
    name: "كاشير ومحاسب (Cashier / POS)",
    description: "تسجيل الطلبات السريعة وإصدار الفواتير ومتابعة حالة الدفع",
    usersCount: 5,
    canRead: true,
    canCreate: true,
    canEdit: false,
    canDelete: false,
    canExport: false,
    allowedPages: ["orders", "products"],
  },
  {
    id: "role-dispatcher",
    name: "مشرف توصيل (Delivery Dispatcher)",
    description: "توزيع الطلبات على المناديب ومتابعة خطوط السير وسرعة التوصيل",
    usersCount: 2,
    canRead: true,
    canCreate: false,
    canEdit: true,
    canDelete: false,
    canExport: false,
    allowedPages: ["orders", "locations", "delivery"],
  },
];

export const initialSmtpSettings: SmtpSettings = {
  host: "smtp.mailgun.org",
  port: 587,
  username: "postmaster@wazeerelhelw.com",
  password: "••••••••••••••••",
  senderName: "وزير الحلو - تأكيد الطلبات",
  senderEmail: "orders@wazeerelhelw.com",
  encryption: "TLS",
};

export const initialSmsSettings: SmsSettings = {
  provider: "SMS Misr",
  apiKey: "sms_live_98a72b144fae890c",
  senderId: "WAZEER",
  sendOnNewOrder: true,
  sendOnDispatch: true,
  sendOnDelivered: true,
};

export interface StoreSettings {
  storeName: string;
  storeSlogan: string;
  primaryPhone: string;
  hotline: string;
  email: string;
  address: string;
  vatRate: number;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  isOpen: boolean;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  whatsappNumber: string;
  currency: string;
}

export const initialStoreSettings: StoreSettings = {
  storeName: "وزير الحلو",
  storeSlogan: "الحلو دايمًا بمزاجك",
  primaryPhone: "+20 122 228 1651",
  hotline: "1651",
  email: "info@wazeerelhelw.com",
  address: "موقف الخصوص، محافظة القليوبية، مصر",
  vatRate: 14,
  defaultDeliveryFee: 15,
  freeDeliveryThreshold: 250,
  isOpen: true,
  facebookUrl: "https://facebook.com/wazeerelhelw",
  instagramUrl: "https://instagram.com/wazeerelhelw",
  tiktokUrl: "https://tiktok.com/@wazeerelhelw",
  youtubeUrl: "https://youtube.com/@wazeerelhelw",
  twitterUrl: "https://x.com/wazeerelhelw",
  whatsappNumber: "+20 122 228 1651",
  currency: "ج.م",
};

