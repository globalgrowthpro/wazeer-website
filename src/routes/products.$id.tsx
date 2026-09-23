import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Quote,
  ShoppingCart,
  Star,
  Tag,
  ThumbsUp,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { products, categoryName } from "@/data/menu";
import type { SizePricing } from "@/data/menu";

export const Route = createFileRoute("/products/$id")({
  head: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    return {
      meta: [
        { title: product ? `${product.name} | وزير الحلو` : "منتج | وزير الحلو" },
        { name: "description", content: product?.description ?? "تفاصيل المنتج من وزير الحلو" },
      ],
    };
  },
  component: ProductDetail,
});

// ─── Fallback size options when product has none ─────────────────────────────
const FALLBACK_SIZES: SizePricing[] = [
  { label: "صغير",  suffix: "S",  priceOffset: -20 },
  { label: "وسط",   suffix: "M",  priceOffset: 0   },
  { label: "كبير",  suffix: "L",  priceOffset: 30  },
  { label: "عائلي", suffix: "XL", priceOffset: 60  },
];

// ─── Static mock reviews keyed by product id ────────────────────────────────
const REVIEWS_MAP: Record<string, { name: string; rating: number; date: string; text: string; helpful: number }[]> = {
  default: [
    { name: "سارة أحمد",    rating: 5, date: "منذ 3 أيام",    text: "طعم رائع جداً! التغليف أنيق والتوصيل كان سريع. أنصح به بشدة لكل محبي الحلويات.", helpful: 24 },
    { name: "محمود علي",    rating: 4, date: "منذ أسبوع",     text: "جودة ممتازة والكمية مناسبة للسعر. الطعم أصيل ولاحظت الفرق عن غيره في السوق.", helpful: 15 },
    { name: "نورهان حسن",   rating: 5, date: "منذ أسبوعين",   text: "من أفضل ما جربته! طلبته لحفلة عيد ميلاد وكان الجميع معجب به. سأعود للطلب مرة أخرى.", helpful: 31 },
    { name: "أحمد الشريف",  rating: 3, date: "منذ شهر",       text: "المذاق جيد لكن أتمنى أن تكون الحصة أكبر قليلاً. بشكل عام تجربة مقبولة.", helpful: 8  },
    { name: "ياسمين كمال",  rating: 5, date: "منذ شهر",       text: "مدهش! كل مرة أطلبه يكون نفس المستوى العالي. الاتساق في الجودة أفضل ما فيه.", helpful: 19 },
  ],
};

const getReviews = (id: string) => REVIEWS_MAP[id] ?? REVIEWS_MAP["default"]!;

// ─── Tab labels ─────────────────────────────────────────────────────────────
const TABS = ["الوصف التفصيلي", "المكونات والمواصفات", "التقييمات"] as const;
type Tab = (typeof TABS)[number];

// ─── Rating distribution ─────────────────────────────────────────────────────
function ratingDist(reviews: { rating: number }[]) {
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return dist;
}

// ─── StarRow ─────────────────────────────────────────────────────────────────
function StarRow({ n, filled }: { n: number; filled?: boolean }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            filled
              ? i < n
                ? "fill-gold text-gold"
                : "fill-muted text-muted-foreground"
              : i < n
              ? "fill-gold text-gold"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function ProductDetail() {
  const { id } = Route.useParams();
  const product = products.find((p) => p.id === id);

  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const [qty, setQty]             = useState(1);
  const [sizeIdx, setSizeIdx]     = useState(1);           // default "وسط"
  const [activeTab, setActiveTab] = useState<Tab>("الوصف التفصيلي");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [helpfulSet, setHelpfulSet] = useState<Set<number>>(new Set());

  if (!product) throw notFound();

  const isFav      = has(product.id);
  const sizeOptions = product.sizePricing && product.sizePricing.length > 0
    ? product.sizePricing
    : FALLBACK_SIZES;
  const selectedSize = sizeOptions[sizeIdx]!;
  const finalPrice   = product.price + selectedSize.priceOffset;

  const reviews    = getReviews(product.id);
  const avgRating  = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist       = ratingDist(reviews);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-page section-y space-y-14">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">الرئيسية</Link>
        <ArrowRight className="size-3 rotate-180" />
        <Link to="/menu" className="hover:text-primary">القائمة</Link>
        <ArrowRight className="size-3 rotate-180" />
        <Link to="/menu" search={{ cat: product.category }} className="hover:text-primary">
          {categoryName(product.category)}
        </Link>
        <ArrowRight className="size-3 rotate-180" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">

        {/* Left — image */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border bg-muted shadow-[var(--shadow-float)]">
            <img
              src={product.image}
              alt={product.name}
              width={900}
              height={900}
              className="aspect-square h-full w-full object-cover"
            />
          </div>
          {product.badge && (
            <span className="absolute start-4 top-4 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-lg">
              {product.badge}
            </span>
          )}
          {/* Wishlist btn */}
          <button
            type="button"
            aria-label={isFav ? "إزالة من الأمنيات" : "أضف للأمنيات"}
            onClick={() => {
              toggle(product);
              toast.success(
                isFav
                  ? `تمت إزالة ${product.name} من الأمنيات`
                  : `تمت إضافة ${product.name} إلى الأمنيات ❤️`,
              );
            }}
            className="absolute end-4 top-4 grid size-11 place-items-center rounded-full bg-background/90 text-muted-foreground shadow-lg transition-all hover:scale-110 hover:text-primary"
          >
            <Heart className={`size-5 transition-all ${isFav ? "fill-primary text-primary" : ""}`} />
          </button>

          {/* Delivery badge */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
            <Truck className="size-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">
              توصيل سريع خلال <span className="font-bold text-foreground">30–50 دقيقة</span> لمنطقتك
            </span>
          </div>
        </div>

        {/* Right — info */}
        <div className="flex flex-col gap-5">

          {/* Category */}
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Tag className="size-3" /> {categoryName(product.category)}
          </span>

          <h1 className="text-3xl font-black text-brand md:text-4xl">{product.name}</h1>

          {/* Rating summary */}
          <div className="flex items-center gap-3">
            <StarRow n={Math.round(product.rating)} filled />
            <span className="font-bold text-foreground">{product.rating}</span>
            <button
              className="text-sm text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => setActiveTab("التقييمات")}
            >
              ({product.reviews} تقييم)
            </button>
          </div>

          {/* Short description */}
          <p className="text-base leading-8 text-muted-foreground">{product.description}</p>

          {/* Quick specs */}
          <div className="flex flex-wrap gap-2">
            {product.servesCount && (
              <span className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-semibold">
                <Users className="size-3.5 text-primary" /> {product.servesCount}
              </span>
            )}
            {product.preparationInfo && (
              <span className="rounded-xl bg-muted px-3 py-2 text-xs font-semibold">
                ⏱️ {product.preparationInfo}
              </span>
            )}
            <span className="rounded-xl bg-muted px-3 py-2 text-xs font-semibold">
              🥇 جودة مضمونة
            </span>
            <span className="rounded-xl bg-muted px-3 py-2 text-xs font-semibold">
              🌿 طازج يومياً
            </span>
          </div>

          {/* ── SIZE SELECTOR ──────────────────────────────────────────── */}
          <div>
            <p className="mb-2 text-sm font-bold text-brand">
              الحجم:{" "}
              <span className="text-muted-foreground font-normal">
                {selectedSize.label} ({selectedSize.suffix})
              </span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {sizeOptions.map((s, i) => (
                <button
                  key={s.suffix}
                  type="button"
                  onClick={() => setSizeIdx(i)}
                  className={`rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition-all ${
                    sizeIdx === i
                      ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                      : "border-border bg-muted text-foreground hover:border-primary/50"
                  }`}
                >
                  {s.label}
                  <span className="ms-1.5 text-[11px] font-normal opacity-70">
                    {s.priceOffset > 0 ? `+${s.priceOffset}` : s.priceOffset < 0 ? `${s.priceOffset}` : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── PRICE ──────────────────────────────────────────────────── */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-primary">{finalPrice} ج.م</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {product.oldPrice + selectedSize.priceOffset} ج.م
              </span>
            )}
            {product.oldPrice && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                وفر {(product.oldPrice + selectedSize.priceOffset) - finalPrice} ج.م
              </span>
            )}
          </div>

          {/* ── QTY + ADD TO CART ──────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-border bg-muted">
              <button
                type="button"
                aria-label="تقليل الكمية"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center rounded-r-xl transition-colors hover:bg-border"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button
                type="button"
                aria-label="زيادة الكمية"
                onClick={() => setQty((q) => q + 1)}
                className="grid size-11 place-items-center rounded-l-xl transition-colors hover:bg-border"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="flex-1 min-w-[160px]"
              onClick={() => {
                add(product, qty);
                toast.success(`تمت إضافة ${qty}× ${product.name} (${selectedSize.label}) إلى السلة 🎉`);
              }}
            >
              <ShoppingCart className="size-4" />
              أضف إلى السلة
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 border-t border-border pt-4">
            {["دفع آمن 100%", "ضمان الجودة", "استرداد سهل"].map((b) => (
              <span key={b} className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS SECTION ─────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        {/* Tab bar */}
        <div className="flex gap-1 rounded-2xl border border-border bg-muted p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-background text-primary shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {tab === "التقييمات" && (
                <span className="ms-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                  {reviews.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Description ─────────────────────────────────────────────── */}
        {activeTab === "الوصف التفصيلي" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-black text-brand">عن هذا المنتج</h2>
              <p className="leading-9 text-muted-foreground">
                {product.longDescription ||
                  `${product.description} — يُعدّ هذا الصنف من أكثر المنتجات طلباً في وزير الحلو، ويتميز بجودة المكونات المستخدمة وطازجية التحضير اليومي على أيدي أمهر الطهاة. يُقدَّم بتغليف أنيق يجعله هدية مثالية للمناسبات أو متعة يومية لا تقاوم.`}
              </p>
              <p className="leading-9 text-muted-foreground">
                يتوفر بأحجام متعددة لتناسب احتياجاتك سواء كنت تطلبه لنفسك أو لمجموعة أصدقاء
                أو لمناسبة عائلية. نضمن لك مستوى ثابتاً من الجودة في كل طلب.
              </p>
              <ul className="space-y-2">
                {[
                  "مُحضَّر يومياً بمكونات طازجة 100%",
                  "خالٍ من المواد الحافظة الصناعية",
                  "يُسلَّم في عبوة معزولة للحفاظ على درجة الحرارة",
                  "مناسب لجميع الأعمار",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-brand">جدول المقاسات والسعرات</h3>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2.5 text-start font-bold">الحجم</th>
                      <th className="px-4 py-2.5 text-start font-bold">الوزن تقريباً</th>
                      <th className="px-4 py-2.5 text-start font-bold">السعر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeOptions.map((s, i) => (
                      <tr
                        key={s.suffix}
                        className={`border-t border-border ${sizeIdx === i ? "bg-primary/5 font-semibold" : ""}`}
                      >
                        <td className="px-4 py-2.5">{s.label} ({s.suffix})</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {[200, 350, 500, 800][i]} جم
                        </td>
                        <td className="px-4 py-2.5 font-bold text-primary">
                          {product.price + s.priceOffset} ج.م
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Ingredients & Specs ─────────────────────────────────────── */}
        {activeTab === "المكونات والمواصفات" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Ingredients */}
            <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-4">
              <h2 className="font-black text-brand">المكونات الأساسية</h2>
              {product.ingredients && product.ingredients.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <li
                      key={ing.name}
                      className="rounded-xl bg-background px-3 py-1.5 text-xs font-medium shadow-sm"
                    >
                      {ing.name}
                      {ing.quantity && (
                        <span className="ms-1 text-muted-foreground">· {ing.quantity}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {["حليب طازج", "كريمة بلدية", "سكر", "فانيليا طبيعية", "مكسرات", "عسل نحل"].map((i) => (
                    <li key={i} className="rounded-xl bg-background px-3 py-1.5 text-xs font-medium shadow-sm">
                      {i}
                    </li>
                  ))}
                </ul>
              )}

              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-xs text-amber-700 dark:text-amber-400">
                ⚠️ قد يحتوي على آثار من المكسرات والغلوتين. يُرجى التواصل معنا في حال وجود حساسية غذائية.
              </div>
            </div>

            {/* Nutrition */}
            <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-4">
              <h2 className="font-black text-brand">القيمة الغذائية (لكل 100 جم)</h2>
              {product.nutrition ? (
                <div className="space-y-2">
                  {[
                    { label: "السعرات الحرارية", value: product.nutrition.calories + " سعرة", pct: 65 },
                    { label: "الدهون", value: product.nutrition.fat + " جم", pct: 45 },
                    { label: "الكربوهيدرات", value: product.nutrition.carbs + " جم", pct: 72 },
                    { label: "البروتين", value: product.nutrition.protein + " جم", pct: 30 },
                    { label: "السكر", value: product.nutrition.sugar + " جم", pct: 58 },
                    { label: "الألياف", value: product.nutrition.fiber + " جم", pct: 18 },
                  ].map((n) => (
                    <div key={n.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-foreground">{n.label}</span>
                        <span className="text-muted-foreground">{n.value}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${n.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">لم يتم إدخال قيم غذائية لهذا المنتج بعد.</p>
              )}
            </div>

            {/* Storage & Serving */}
            <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "طريقة التخزين",
                  icon: "❄️",
                  items: product.storageInfo
                    ? [product.storageInfo]
                    : [
                        "يُحفظ في الثلاجة من 2 إلى 5 درجات مئوية",
                        "مدة الصلاحية: 3 أيام من تاريخ التحضير",
                        "لا يُنصح بالتجميد للحفاظ على الطعم",
                      ],
                },
                {
                  title: "طريقة التقديم",
                  icon: "🍽️",
                  items: product.servingInfo
                    ? [product.servingInfo]
                    : [
                        "يُقدَّم بارداً مباشرة من الثلاجة",
                        "يمكن تزيينه بالمكسرات والعسل",
                        "مناسب للإفطار والحفلات والهدايا",
                      ],
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-sm"
                >
                  <h3 className="flex items-center gap-2 font-bold text-brand">
                    <span>{s.icon}</span> {s.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Reviews ─────────────────────────────────────────────────── */}
        {activeTab === "التقييمات" && (
          <div className="space-y-8">
            {/* Overview row */}
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              {/* Avg score */}
              <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-muted/50 p-6 text-center">
                <span className="text-6xl font-black text-primary">{avgRating.toFixed(1)}</span>
                <StarRow n={Math.round(avgRating)} filled />
                <span className="mt-2 text-xs text-muted-foreground">{reviews.length} تقييم موثق</span>
              </div>
              {/* Bar breakdown */}
              <div className="flex flex-col justify-center gap-2">
                {dist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-6 text-end font-bold">{star}</span>
                    <Star className="size-3.5 fill-gold text-gold" />
                    <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-gold transition-all"
                        style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="w-6 text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review cards */}
            <div className="space-y-4">
              {displayedReviews.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-brand text-brand-foreground font-bold text-sm shrink-0">
                        {r.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-bold text-brand">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <StarRow n={r.rating} filled />
                  </div>

                  <div className="relative mt-4">
                    <Quote className="absolute -start-1 -top-1 size-5 text-primary/20" />
                    <p className="ps-5 text-sm leading-7 text-muted-foreground">{r.text}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setHelpfulSet((prev) => {
                          const next = new Set(prev);
                          next.has(i) ? next.delete(i) : next.add(i);
                          return next;
                        })
                      }
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        helpfulSet.has(i)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <ThumbsUp className="size-3.5" />
                      مفيد ({r.helpful + (helpfulSet.has(i) ? 1 : 0)})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowAllReviews((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {showAllReviews ? "إظهار أقل" : `عرض كل التقييمات (${reviews.length})`}
                  <ChevronDown className={`size-4 transition-transform ${showAllReviews ? "rotate-180" : ""}`} />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Related products ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xl font-black text-brand">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to="/products/$id"
                params={{ id: p.id }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.badge && (
                    <span className="absolute start-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold text-brand text-sm">{p.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-extrabold text-primary">{p.price} ج.م</p>
                    <StarRow n={Math.round(p.rating)} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
