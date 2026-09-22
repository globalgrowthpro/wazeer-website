import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Star,
  Truck,
  Wallet,
} from "lucide-react";
import heroCake from "@/assets/hero-cake.jpg";
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
  },
  {
    title: "كنافة وقشطوطة طازة",
    subtitle: "تُحضَّر يومياً بأجود المكونات في كل فروعنا",
  },
  {
    title: "توصيل سريع لباب بيتك",
    subtitle: "اطلب الآن واستمتع بطلبك في أسرع وقت",
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
                src={heroCake}
                alt="كنافة بالشوكولاتة والفستق من وزير الحلو"
                width={1200}
                height={1200}
                className="relative h-full w-full rounded-full border-4 border-gold/70 object-cover shadow-[var(--shadow-float)]"
              />
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

      {/* Offers */}
      <section className="section-y bg-muted">
        <div className="container-page">
          <SectionHeading title="أحدث العروض" subtitle="استمتع بأفضل الأسعار على أشهى الأصناف" />
          <div className="grid gap-5 md:grid-cols-2">
            {offers.slice(0, 2).map((o) => (
              <div
                key={o.id}
                className="flex overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]"
              >
                <img
                  src={o.image}
                  alt={o.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-40 w-36 shrink-0 object-cover md:h-48 md:w-52"
                />
                <div className="flex flex-1 flex-col justify-center gap-2 p-4">
                  <span className="w-fit rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-gold-foreground">
                    {o.badge}
                  </span>
                  <h3 className="text-lg font-extrabold text-brand md:text-xl">{o.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-primary">{o.price} ج.م</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {o.oldPrice} ج.م
                    </span>
                  </div>
                  <Button asChild variant="brand" className="mt-2 w-fit">
                    <Link to="/menu">اطلب الآن</Link>
                  </Button>
                </div>
              </div>
            ))}
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
