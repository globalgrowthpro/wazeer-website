import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  CreditCard,
  FileText,
  Percent,
  Receipt,
  Store,
  Users,
  Zap,
} from "lucide-react";
import posTerminal from "@/assets/pos-terminal.jpg";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "نظام نقاط البيع POS | وزير الحلو" },
      {
        name: "description",
        content: "حل POS متكامل لإدارة المبيعات والفروع والمخزون والتقارير اللحظية لمطاعم ومحلات الحلويات.",
      },
      { property: "og:title", content: "نظام نقاط البيع POS | وزير الحلو" },
      { property: "og:description", content: "إدارة المبيعات والفروع والمخزون من مكان واحد." },
    ],
  }),
  component: PosPage,
});

const features = [
  { icon: Zap, title: "معالجة طلبات سريعة", text: "شاشة كاشير سريعة تقلل وقت الانتظار." },
  { icon: Boxes, title: "إدارة المنتجات والمخزون", text: "تحديث تلقائي للكميات بعد كل عملية بيع." },
  { icon: Store, title: "إدارة الفروع", text: "متابعة أداء كل فرع من لوحة واحدة." },
  { icon: Users, title: "إدارة الكاشير والصلاحيات", text: "صلاحيات دقيقة لكل مستخدم." },
  { icon: Percent, title: "الخصومات والعروض", text: "تطبيق العروض بضغطة واحدة." },
  { icon: CreditCard, title: "طرق دفع متعددة", text: "نقدي، بطاقات ومحافظ إلكترونية." },
  { icon: Receipt, title: "الإقفال اليومي", text: "تقفيل الوردية وحساب العهدة بدقة." },
  { icon: FileText, title: "الفواتير", text: "طباعة فواتير احترافية فوراً." },
  { icon: BarChart3, title: "تقارير لحظية", text: "مبيعات وأرباح وأفضل الأصناف في الوقت الفعلي." },
];

const workflow = [
  "اختيار المنتجات",
  "إنشاء الطلب",
  "الدفع",
  "إصدار الفاتورة",
  "تحديث المخزون",
  "التقرير",
];

const kpis = [
  { label: "مبيعات اليوم", value: "42,800 ج.م" },
  { label: "عدد الطلبات", value: "312" },
  { label: "متوسط الفاتورة", value: "137 ج.م" },
  { label: "الأصناف المباعة", value: "1,204" },
];

function PosPage() {
  return (
    <>
      <PageHero
        title="نظام نقاط البيع — POS"
        subtitle="حل ذكي لإدارة المبيعات والفروع والطلبات بسهولة"
      />

      <section className="section-y">
        <div className="container-page grid items-center gap-8 md:grid-cols-2">
          <img
            src={posTerminal}
            alt="شاشة نظام نقاط البيع"
            loading="lazy"
            width={1200}
            height={800}
            className="rounded-3xl object-cover shadow-[var(--shadow-card)]"
          />
          <div>
            <h2 className="text-2xl text-brand md:text-3xl">نظام POS متكامل وسهل الاستخدام</h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
              صُمم ليناسب المطاعم ومحلات الحلويات، يربط الكاشير بالمخزون والتقارير في منظومة واحدة
              تعمل بسرعة وبدون تعقيد، مع دعم كامل للغة العربية.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">اطلب عرضًا</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-muted">
        <div className="container-page">
          <SectionHeading title="مميزات النظام" subtitle="كل ما تحتاجه لإدارة نقاط البيع" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-3 font-bold text-brand">{f.title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading title="دورة العمل" subtitle="من الطلب حتى التقرير في خطوات واضحة" />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {workflow.map((step, i) => (
              <li
                key={step}
                className="rounded-2xl border border-border bg-card p-4 text-center shadow-[var(--shadow-card)]"
              >
                <span className="mx-auto grid size-8 place-items-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                  {i + 1}
                </span>
                <p className="mt-2 text-sm font-semibold text-brand">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="brand-gradient section-y text-brand-foreground">
        <div className="container-page">
          <SectionHeading light title="لوحة التحكم اللحظية" subtitle="أرقام أعمالك أمامك دائمًا" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-extrabold text-gold">{k.value}</p>
                <p className="mt-1 text-sm text-brand-foreground/80">{k.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="hero" size="pill">
              <Link to="/contact">اطلب عرضًا الآن</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
