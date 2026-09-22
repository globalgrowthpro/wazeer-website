import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Leaf, Lightbulb, ShieldCheck, Sparkles, Timer } from "lucide-react";
import aboutStore from "@/assets/about-store.jpg";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن وزير الحلو | قصتنا وقيمنا" },
      {
        name: "description",
        content: "تعرف على قصة وزير الحلو، فلسفتنا في الطعام، قيمنا وأرقامنا عبر سنوات من الخبرة.",
      },
      { property: "og:title", content: "عن وزير الحلو | قصتنا وقيمنا" },
      { property: "og:description", content: "قصة وزير الحلو وقيمنا وأرقامنا." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: ShieldCheck, title: "الجودة", text: "مكونات مختارة بعناية في كل منتج." },
  { icon: Leaf, title: "النظافة", text: "معايير صارمة في التحضير والتغليف." },
  { icon: Lightbulb, title: "الابتكار", text: "أصناف جديدة باستمرار بنكهات مميزة." },
  { icon: HeartHandshake, title: "رضا العميل", text: "رضاك هو مقياس نجاحنا الحقيقي." },
  { icon: Timer, title: "السرعة", text: "تحضير وتوصيل في أسرع وقت ممكن." },
  { icon: Sparkles, title: "التنوع", text: "حلويات ومشروبات وأطباق لكل الأذواق." },
];

const stats = [
  { value: "+20", label: "فرع" },
  { value: "+30", label: "سنة خبرة" },
  { value: "100%", label: "جودة" },
  { value: "+50K", label: "عميل سعيد" },
];

function AboutPage() {
  return (
    <>
      <PageHero
        title="عن وزير الحلو"
        subtitle="رحلة طويلة من الشغف بالطعم الأصيل والجودة العالية"
      />

      <section className="section-y">
        <div className="container-page grid gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]"
            >
              <p className="text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-muted">
        <div className="container-page grid items-center gap-8 md:grid-cols-2">
          <img
            src={aboutStore}
            alt="فرع وزير الحلو"
            loading="lazy"
            width={1200}
            height={800}
            className="rounded-3xl object-cover shadow-[var(--shadow-card)]"
          />
          <div>
            <h2 className="text-2xl text-brand md:text-3xl">قصة نجاحنا</h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
              بدأت رحلة وزير الحلو من محل صغير وحلم كبير: أن يجد كل بيت مصري الحلو الطازج بجودة
              عالية وسعر مناسب. ومع الوقت كبرت العائلة وتوسعت الفروع، لكن ظلت الوصفة واحدة —
              مكونات طازجة، تحضير يومي، واهتمام بأدق التفاصيل.
            </p>
            <p className="mt-3 text-sm leading-8 text-muted-foreground md:text-base">
              اليوم نقدم تشكيلة واسعة من الحلويات الشرقية والغربية والآيس كريم والمشروبات والأطباق
              الرئيسية، مع تجربة طلب أونلاين سريعة وسهلة تصل لباب بيتك.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <Link to="/menu">اكتشف قائمتنا</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading title="قيمنا" subtitle="ما نلتزم به في كل طلب" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-3 font-bold text-brand">{v.title}</h3>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
