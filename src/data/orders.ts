export type OrderStatus = "received" | "preparing" | "ready" | "on_way" | "delivered" | "cancelled";
export type OrderType = "delivery" | "pickup";

export interface OrderLine {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  branch: string;
  type: OrderType;
  status: OrderStatus;
  payment: string;
  createdAt: string;
  driverId?: string;
  lines: OrderLine[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  branch: string;
  active: boolean;
  deliveries: number;
  rating: number;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  branch: string;
}

export const statusLabel: Record<OrderStatus, string> = {
  received: "تم استلام الطلب",
  preparing: "جاري التجهيز",
  ready: "جاهز",
  on_way: "خرج للتوصيل",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export const statusFlow: OrderStatus[] = ["received", "preparing", "ready", "on_way", "delivered"];
export const pickupFlow: OrderStatus[] = ["received", "preparing", "ready"];

export const DELIVERY_FEE = 25;

export const orderTotal = (o: Order) =>
  o.lines.reduce((n, l) => n + l.qty * l.price, 0) + (o.type === "delivery" ? DELIVERY_FEE : 0);

export const drivers: Driver[] = [
  { id: "d1", name: "محمود سيد", phone: "+20 100 111 2233", branch: "الخصوص", active: true, deliveries: 412, rating: 4.9 },
  { id: "d2", name: "كريم فتحي", phone: "+20 100 444 5566", branch: "شبرا", active: true, deliveries: 287, rating: 4.7 },
  { id: "d3", name: "أحمد رجب", phone: "+20 100 777 8899", branch: "المرج", active: false, deliveries: 158, rating: 4.5 },
];

export const staff: StaffMember[] = [
  { id: "s1", name: "هشام وزير", phone: "+20 122 228 1651", role: "مدير عام", branch: "الخصوص" },
  { id: "s2", name: "سارة عادل", phone: "+20 111 220 3344", role: "كاشير", branch: "شبرا" },
  { id: "s3", name: "مصطفى نبيل", phone: "+20 111 990 1122", role: "شيف حلويات", branch: "الخصوص" },
  { id: "s4", name: "ندى سمير", phone: "+20 115 330 7788", role: "خدمة عملاء", branch: "المرج" },
];

export const orders: Order[] = [
  {
    id: "WZ-10248",
    customer: "أحمد محمد",
    phone: "+20 100 123 4567",
    address: "١٢ شارع الجمهورية، الخصوص",
    branch: "الخصوص",
    type: "delivery",
    status: "on_way",
    payment: "الدفع عند الاستلام",
    createdAt: "اليوم 14:20",
    driverId: "d1",
    lines: [
      { name: "قشطوطة مميزة", qty: 2, price: 99 },
      { name: "آيس كوفي", qty: 1, price: 45 },
    ],
  },
  {
    id: "WZ-10247",
    customer: "منة الله حسن",
    phone: "+20 106 555 9911",
    address: "٤ شارع النيل، شبرا",
    branch: "شبرا",
    type: "delivery",
    status: "preparing",
    payment: "محفظة إلكترونية",
    createdAt: "اليوم 13:55",
    lines: [
      { name: "كيك شوكولاتة", qty: 1, price: 120 },
      { name: "عصير برتقال طازج", qty: 2, price: 35 },
    ],
  },
  {
    id: "WZ-10246",
    customer: "خالد عبد الله",
    phone: "+20 122 333 4455",
    address: "استلام من الفرع",
    branch: "المرج",
    type: "pickup",
    status: "ready",
    payment: "بطاقة",
    createdAt: "اليوم 13:10",
    lines: [{ name: "علبة بقلاوة", qty: 1, price: 180 }],
  },
  {
    id: "WZ-10245",
    customer: "سلمى إبراهيم",
    phone: "+20 109 876 5432",
    address: "٧ شارع بورسعيد، الخصوص",
    branch: "الخصوص",
    type: "delivery",
    status: "delivered",
    payment: "الدفع عند الاستلام",
    createdAt: "اليوم 11:40",
    driverId: "d2",
    lines: [
      { name: "كنافة بالفستق", qty: 2, price: 110 },
      { name: "شريحة كيك", qty: 1, price: 55 },
    ],
  },
  {
    id: "WZ-10244",
    customer: "يوسف طارق",
    phone: "+20 101 222 3344",
    address: "٩ شارع المحطة، شبرا",
    branch: "شبرا",
    type: "delivery",
    status: "received",
    payment: "الدفع عند الاستلام",
    createdAt: "اليوم 11:05",
    lines: [{ name: "وجبة كفتة", qty: 2, price: 150 }],
  },
  {
    id: "WZ-10243",
    customer: "مريم صلاح",
    phone: "+20 120 456 7788",
    address: "١ شارع الورش، المرج",
    branch: "المرج",
    type: "delivery",
    status: "cancelled",
    payment: "بطاقة",
    createdAt: "أمس 20:30",
    lines: [{ name: "آيس كريم فواكه", qty: 3, price: 49 }],
  },
];

export const salesByDay = [
  { day: "السبت", total: 28400 },
  { day: "الأحد", total: 31200 },
  { day: "الإثنين", total: 26900 },
  { day: "الثلاثاء", total: 35800 },
  { day: "الأربعاء", total: 39100 },
  { day: "الخميس", total: 46700 },
  { day: "الجمعة", total: 52300 },
];

export const topProducts = [
  { name: "قشطوطة مميزة", sold: 312, revenue: 30888 },
  { name: "كيك شوكولاتة", sold: 244, revenue: 29280 },
  { name: "كنافة بالفستق", sold: 198, revenue: 21780 },
  { name: "علبة بقلاوة", sold: 121, revenue: 21780 },
  { name: "آيس كوفي", sold: 289, revenue: 13005 },
];
