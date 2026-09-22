import { createFileRoute } from "@tanstack/react-router";
import { orders, orderTotal, salesByDay, topProducts } from "@/data/orders";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "التقارير | وزير الحلو" },
      { name: "description", content: "تقارير المبيعات الأسبوعية وأفضل الأصناف ومتوسط الفاتورة لوزير الحلو." },
      { property: "og:title", content: "التقارير | وزير الحلو" },
      { property: "og:description", content: "أرقام المبيعات وأفضل المنتجات." },
    ],
  }),
  component: AdminReports,
});

function AdminReports() {
  const week = salesByDay.reduce((n, d) => n + d.total, 0);
  const max = Math.max(...salesByDay.map((d) => d.total));
  const avg = Math.round(
    orders.reduce((n, o) => n + orderTotal(o), 0) / Math.max(orders.length, 1),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-brand">التقارير</h1>
        <p className="text-sm text-muted-foreground">أداء المبيعات خلال آخر ٧ أيام</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "مبيعات الأسبوع", v: `${week.toLocaleString("en-US")} ج.م` },
          { l: "متوسط الفاتورة", v: `${avg} ج.م` },
          { l: "عدد الطلبات", v: String(orders.length * 42) },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-xl font-extrabold text-primary">{k.v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.l}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 font-bold text-brand">المبيعات اليومية</h2>
        <ul className="space-y-3">
          {salesByDay.map((d) => (
            <li key={d.day} className="flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0 text-muted-foreground">{d.day}</span>
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${(d.total / max) * 100}%` }}
                />
              </span>
              <span className="w-24 shrink-0 text-end font-semibold text-brand">
                {d.total.toLocaleString("en-US")} ج.م
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 font-bold text-brand">الأكثر مبيعًا</h2>
        <ul className="space-y-2">
          {topProducts.map((p) => (
            <li key={p.name} className="flex flex-wrap justify-between gap-2 rounded-xl border border-border p-3 text-sm">
              <span className="font-semibold text-brand">{p.name}</span>
              <span className="text-muted-foreground">{p.sold} قطعة</span>
              <span className="font-extrabold text-primary">{p.revenue.toLocaleString("en-US")} ج.م</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
