import keshtota from "@/assets/cat-keshtota.jpg";
import icecream from "@/assets/cat-icecream.jpg";
import cake from "@/assets/cat-cake.jpg";
import oriental from "@/assets/cat-oriental.jpg";
import mainDish from "@/assets/cat-main.jpg";
import drinks from "@/assets/cat-drinks.jpg";

export type CategoryId = "keshtota" | "icecream" | "cake" | "oriental" | "main" | "drinks";

export interface Category {
  id: CategoryId;
  name: string;
  image: string;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: CategoryId;
  image: string;
  badge?: string;
  popular?: boolean;
}

export const categories: Category[] = [
  { id: "keshtota", name: "قشطوطة", image: keshtota, count: 8 },
  { id: "icecream", name: "آيس كريم", image: icecream, count: 12 },
  { id: "cake", name: "كيك", image: cake, count: 10 },
  { id: "oriental", name: "حلويات شرقية", image: oriental, count: 14 },
  { id: "main", name: "أطباق رئيسية", image: mainDish, count: 9 },
  { id: "drinks", name: "مشروبات", image: drinks, count: 11 },
];

export const categoryName = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.name ?? "";

export const products: Product[] = [
  {
    id: "keshtota-special",
    name: "قشطوطة مميزة",
    description: "قشطة طازجة مع مكسرات وعسل النحل",
    price: 99,
    oldPrice: 129,
    rating: 4.8,
    reviews: 214,
    category: "keshtota",
    image: keshtota,
    badge: "عرض خاص",
    popular: true,
  },
  {
    id: "icecream-berries",
    name: "آيس كريم فواكه",
    description: "كرات آيس كريم متنوعة مع فواكه طازجة",
    price: 49,
    oldPrice: 65,
    rating: 4.7,
    reviews: 168,
    category: "icecream",
    image: icecream,
    badge: "خصم 25%",
    popular: true,
  },
  {
    id: "cake-chocolate",
    name: "كيك شوكولاتة",
    description: "طبقات كيك شوكولاتة غنية بالكريمة",
    price: 120,
    rating: 4.9,
    reviews: 302,
    category: "cake",
    image: cake,
    popular: true,
  },
  {
    id: "kunafa-pistachio",
    name: "كنافة بالفستق",
    description: "كنافة مقرمشة محشوة بالفستق الحلبي",
    price: 110,
    rating: 4.8,
    reviews: 187,
    category: "oriental",
    image: oriental,
    popular: true,
  },
  {
    id: "grilled-chicken",
    name: "دجاج مشوي",
    description: "دجاج مشوي مع أرز وخضار سوتيه",
    price: 120,
    rating: 4.6,
    reviews: 96,
    category: "main",
    image: mainDish,
    popular: true,
  },
  {
    id: "fresh-juice",
    name: "عصير برتقال طازج",
    description: "عصير برتقال طبيعي 100% بدون سكر",
    price: 35,
    rating: 4.5,
    reviews: 74,
    category: "drinks",
    image: drinks,
  },
  {
    id: "iced-coffee",
    name: "آيس كوفي",
    description: "قهوة مثلجة بالحليب ونكهة الكراميل",
    price: 45,
    rating: 4.6,
    reviews: 121,
    category: "drinks",
    image: drinks,
  },
  {
    id: "baklava-box",
    name: "علبة بقلاوة",
    description: "تشكيلة بقلاوة فاخرة بالمكسرات",
    price: 180,
    oldPrice: 210,
    rating: 4.9,
    reviews: 143,
    category: "oriental",
    image: oriental,
    badge: "الأكثر مبيعاً",
  },
  {
    id: "keshtota-classic",
    name: "قشطوطة كلاسيك",
    description: "الوصفة الأصلية بطعم البيت المصري",
    price: 79,
    rating: 4.7,
    reviews: 158,
    category: "keshtota",
    image: keshtota,
  },
  {
    id: "cake-slice",
    name: "شريحة كيك",
    description: "شريحة كيك طازجة تكفي شخصاً واحداً",
    price: 55,
    rating: 4.4,
    reviews: 63,
    category: "cake",
    image: cake,
  },
  {
    id: "icecream-scoop",
    name: "آيس كريم كوب",
    description: "كرتان آيس كريم باختيارك",
    price: 30,
    rating: 4.5,
    reviews: 88,
    category: "icecream",
    image: icecream,
  },
  {
    id: "mixed-grill",
    name: "وجبة كفتة",
    description: "كفتة مشوية مع أرز وسلطة",
    price: 150,
    rating: 4.7,
    reviews: 71,
    category: "main",
    image: mainDish,
  },
];

export const offers = products.filter((p) => p.oldPrice);
export const mostOrdered = products.filter((p) => p.popular);
