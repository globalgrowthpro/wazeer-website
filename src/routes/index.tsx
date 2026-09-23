import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  MapPin,
  Sparkles,
  Star,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import heroCake from "@/assets/hero-cake.jpg";
import keshtota from "@/assets/cat-keshtota.jpg";
import icecream from "@/assets/cat-icecream.jpg";
import oriental from "@/assets/cat-oriental.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { categories, mostOrdered, offers } from "@/data/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "وزير الحلو | الحلو دايمًا بمزاجك" },
      {
        name: "description",
        content:
          "اطلب أشهى الحلويات الشرقية والغربية، الآيس كريم، الكيك والأطباق الرئيسية من وزير الحلو — توصيل سريع وأسعار مناسبة.",
      },
      { property: "og:title", content: "وزير الحلو | الحلو دايمًا بمزاجك" },
      {
        property: "og:description",
        content: "أشهى الحلويات والمأكولات من وزير الحلو مع توصيل سريع لكل الفروع.",
      },
    ],
  }),
  component: Home,
});

const slides = [
  {
    title: "الحلو دايمًا بمزاجك",
    subtitle: "أشهى الحلويات والمأكولات من وزير الحلو",
    image: heroCake,
    alt: "كنافة بالشوكولاتة والفستق من وزير الحلو",
    link: "/menu",
    badge: "الأكثر طلباً",
  },
  {
    title: "قشطوطة وزير الأصلية",
    subtitle: "طبقات الحليب والكراميل والمكسرات الفاخرة بطعم لا يقاوم",
    image: keshtota,
    alt: "قشطوطة وزير الحلو الأصلية",
    link: "/menu?cat=keshtota",
    badge: "عرض خاص",
  },
  {
    title: "آيس كريم بنكهات لا تُقاوم",
    subtitle: "برودة الصيف في كوب — كريمة طازجة وفواكه يومياً",
    image: icecream,
    alt: "آيس كريم وزير الحلو",
    link: "/menu?cat=icecream",
    badge: "جديد",
  },
  {
    title: "حلويات شرقية أصيلة",
    subtitle: "كنافة وبسبوسة وكل ما تشتهيه من أصالة الحلوى المصرية",
    image: oriental,
    alt: "حلويات شرقية وزير الحلو",
    link: "/menu?cat=oriental",
    badge: "الأكثر مبيعاً",
  },
];

const benefits = [
  { icon: Award, title: "جودة عالية", text: "أفضل المكونات ونحرص على جودة كل منتج." },
  { icon: Sparkles, title: "تنوع كبير", text: "حلويات ومشروبات وأطباق تناسب مختلف الأذواق." },
  { icon: Truck, title: "خدمة سريعة", text: "تجربة طلب سهلة وتوصيل سريع وآمن." },
  { icon: MapPin, title: "فروع متعددة", text: "سهولة الوصول إلينا من خلال فروعنا." },
  { icon: Wallet, title: "أسعار مناسبة", text: "اختيارات متنوعة تناسب مختلف الميزانيات." },
  { icon: Clock, title: "تجربة مميزة", text: "نهتم بالتفاصيل من الطلب حتى استلامه." },
];

const testimonials = [
  { name: "أحمد محمد", text: "الطعم رائع والخدمة ممتازة، وأكيد هطلب مرة أخرى بالتأكيد." },
  { name: "سارة علي", text: "أفضل مكان للحلويات في مصر، جودة عالية وأسعار مناسبة." },
  { name: "محمود السيد", text: "تجربة رائعة من حيث الطعم والتغليف وسرعة التوصيل." },
];

function Home() {
  const [slide, setSlide] = useState(0);
  const current = slides[slide] ?? slides[0]!;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="brand-gradient relative overflow-hidden text-brand-foreground">
        <div className="container-page grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
          <div className="order-2 text-center md:order-1 md:text-start">
            <h1 className="text-3xl leading-tight md:text-5xl lg:text-6xl">
              {current.title.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="text-gradient-gold">
                {current.title.split(" ").slice(2).join(" ")}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-brand-foreground/85 md:mx-0 md:text-lg">
              {current.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button asChild variant="hero" size="pill">
                <Link to="/menu">اطلب الآن</Link>
              </Button>
              <Button asChild variant="onBrand" size="pill">
                <Link to="/menu">شاهد القائمة</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
              <button
                aria-label="السابق"
                onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
                className="grid size-9 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white/15"
              >
                <ChevronRight className="size-4" />
              </button>
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`شريحة ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-gold" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>
              <button
                aria-label="التالي"
                onClick={() => setSlide((s) => (s + 1) % slides.length)}
                className="grid size-9 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white/15"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-full bg-gold/25 blur-3xl" />
              <img
                key={slide}
                src={current.image}
                alt={current.alt}
                width={1200}
                height={1200}
                className="relative h-full w-full rounded-full border-4 border-gold/70 object-cover shadow-[var(--shadow-float)] transition-all duration-700 ease-in-out animate-in fade-in zoom-in-95"
              />
              {/* Badge */}
              <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-500">
                {current.badge}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            title="تصفح حسب الفئة"
            subtitle="كل ما تحب من الحلويات والمأكولات في مكان واحد"
          />
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-6 md:px-0">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/menu"
                search={{ cat: c.id }}
                className="group w-28 shrink-0 text-center md:w-auto"
              >
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={816}
                    height={816}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="mt-3 text-sm font-bold text-brand">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.count} صنف</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offers ───────────────────────────────────────────────────────── */}
      <section className="section-y relative overflow-hidden bg-muted">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute -top-24 end-0 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 start-0 size-72 rounded-full bg-gold/10 blur-3xl" />

        <div className="container-page relative">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Flame className="size-3.5" /> عروض حصرية
              </span>
              <h2 className="text-2xl font-black text-brand md:text-3xl">أحدث العروض</h2>
              <p className="mt-1 text-sm text-muted-foreground">استمتع بأفضل الأسعار على أشهى الأصناف</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/menu">عرض كل العروض <ArrowLeft className="size-3.5" /></Link>
            </Button>
          </div>

          {/* Top row: 3 cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.slice(0, 3).map((o) => {
              const savePct = o.oldPrice
                ? Math.round(((o.oldPrice - o.price) / o.oldPrice) * 100)
                : 0;
              return (
                <Link
                  key={o.id}
                  to="/products/$id"
                  params={{ id: o.id }}
                  className="group relative flex h-64 overflow-hidden rounded-3xl shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl sm:h-72"
                >
                  {/* Full-bleed image */}
                  <img
                    src={o.image}
                    alt={o.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

                  {/* Content */}
                  <div className="relative flex h-full w-full flex-col justify-between p-5">
                    {/* Top: badge & discount pill */}
                    <div className="flex items-center justify-between gap-2">
                      {o.badge ? (
                        <span className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-black text-gold-foreground shadow-md">
                          <Tag className="size-3" /> {o.badge}
                        </span>
                      ) : (
                        <div />
                      )}
                      {savePct > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-black text-white shadow-md">
                          <Flame className="size-3" /> -{savePct}%
                        </span>
                      )}
                    </div>

                    {/* Bottom: title + description + price + CTA */}
                    <div className="space-y-2.5">
                      <div>
                        <h3 className="text-lg font-black leading-tight text-white drop-shadow-md line-clamp-1">
                          {o.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-white/80 line-clamp-1">
                          {o.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        {/* Dark blue price pill */}
                        <div className="inline-flex items-center gap-2 rounded-xl bg-[#0a192f] px-3 py-1.5 border border-blue-400/25 shadow-md">
                          <span className="text-lg font-black text-gold drop-shadow">
                            {o.price} <span className="text-xs font-bold text-gold/80">ج.م</span>
                          </span>
                          {o.oldPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {o.oldPrice} ج.م
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-brand shadow-lg transition-all group-hover:bg-gold group-hover:text-gold-foreground">
                          اطلب الآن
                          <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Down row: 2 cards */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {offers.slice(3, 5).map((o, idx) => {
              const savePct = o.oldPrice
                ? Math.round(((o.oldPrice - o.price) / o.oldPrice) * 100)
                : 0;
              return (
                <Link
                  key={o.id}
                  to="/products/$id"
                  params={{ id: o.id }}
                  className="group relative flex h-56 overflow-hidden rounded-3xl shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl md:h-64"
                >
                  {/* Full-bleed image */}
                  <img
                    src={o.image}
                    alt={o.name}
                    loading="lazy"
                    width={900}
                    height={600}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 ${
                      idx === 0
                        ? "bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-transparent"
                        : "bg-gradient-to-l from-slate-950/95 via-slate-950/65 to-transparent"
                    }`}
                  />

                  {/* Content */}
                  <div
                    className={`relative flex h-full w-full flex-col justify-between p-5 md:p-6 ${
                      idx === 0 ? "items-start" : "items-end text-end"
                    }`}
                  >
                    {/* Top: badge & discount pill */}
                    <div className={`flex items-center gap-2 ${idx === 1 ? "flex-row-reverse" : ""}`}>
                      {o.badge && (
                        <span className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[11px] font-black text-gold-foreground shadow-md">
                          <Tag className="size-3" /> {o.badge}
                        </span>
                      )}
                      {savePct > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-[11px] font-black text-white shadow-md">
                          <Flame className="size-3" /> -{savePct}%
                        </span>
                      )}
                    </div>

                    {/* Bottom: title + description + price + CTA */}
                    <div className="space-y-2.5">
                      <h3 className="text-xl font-black leading-tight text-white drop-shadow-lg md:text-2xl">
                        {o.name}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-1 leading-relaxed">
                        {o.description}
                      </p>

                      <div className={`flex flex-wrap items-center gap-3 ${idx === 1 ? "justify-end" : ""}`}>
                        {/* Dark blue price pill */}
                        <div className="inline-flex items-center gap-2 rounded-xl bg-[#0a192f] px-3.5 py-1.5 border border-blue-400/25 shadow-md">
                          <span className="text-xl font-black text-gold drop-shadow">
                            {o.price} <span className="text-xs font-bold text-gold/80">ج.م</span>
                          </span>
                          {o.oldPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {o.oldPrice} ج.م
                            </span>
                          )}
                        </div>

                        {o.oldPrice && (
                          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                            وفر {o.oldPrice - o.price} ج.م
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-brand shadow-lg transition-all group-hover:bg-gold group-hover:text-gold-foreground">
                          اطلب الآن
                          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Most ordered */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading title="الأكثر طلبًا" subtitle="هذه هي الأصناف التي يحبها عملاؤنا" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {mostOrdered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/menu">عرض كل المنتجات</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="brand-gradient section-y text-brand-foreground">
        <div className="container-page">
          <SectionHeading
            light
            title="ليه وزير الحلو؟"
            subtitle="لأننا نؤمن بأن السعادة تبدأ من لقمة"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-sm"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-gold text-gold-foreground">
                  <b.icon className="size-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold md:text-base">{b.title}</h3>
                <p className="mt-1 text-xs leading-6 text-brand-foreground/75">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="section-y">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={heroCake}
              alt="عروض وزير الحلو"
              loading="lazy"
              width={1200}
              height={1200}
              className="h-56 w-full object-cover md:h-72"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand/80 px-4 text-center text-brand-foreground">
              <h2 className="text-2xl md:text-4xl">جاهز للحلو؟</h2>
              <p className="text-sm md:text-lg">اطلب المفضلة عندك الآن ووصلها لباب بيتك</p>
              <Button asChild variant="hero" size="pill">
                <Link to="/menu">اطلب الآن</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-y bg-muted">
        <div className="container-page">
          <SectionHeading title="آراء عملائنا" subtitle="ثقتهم هي سر نجاحنا" />
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-brand text-brand-foreground font-bold">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold text-brand">{t.name}</p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-y">
        <div className="container-page text-center">
          <h2 className="text-2xl text-brand md:text-4xl">الحلو دايمًا بمزاجك ❤️</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            اختار المفضل عندك واطلبه الآن
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="pill">
              <Link to="/menu">اطلب الآن</Link>
            </Button>
            <Button asChild variant="outline" size="pill">
              <Link to="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
