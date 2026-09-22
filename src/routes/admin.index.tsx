import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { orders, orderTotal, statusLabel, drivers } from "@/data/orders";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | وزير الحلو" },
      { name: "description", content: "نظرة سريعة على مبيعات اليوم والطلبات الجديدة والمندوبين النشطين." },
      { property: "og:title", content: "لوحة الإدارة | وزير الحلو" },
      { property: "og:description", content: "متابعة الطلبات والمبيعات من مكان واحد." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + orderTotal(o), 0);
  const kpis = [
    { label: "مبيعات اليوم", value: `${revenue.toLocaleString("en-US")} ج.م` },
    { label: "عدد الطلبات", value: String(orders.length) },
    { label: "قيد التجهيز", value: String(orders.filter((o) => o.status === "preparing").length) },
    { label: "مندوبون نشطون", value: String(drivers.filter((d) => d.active).length) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-brand">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">ملخص أداء اليوم لكل الفروع</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-xl font-extrabold text-primary">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-brand">أحدث الطلبات</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/orders">كل الطلبات</Link>
          </Button>
        </div>
        <ul className="space-y-2">
          {orders.slice(0, 5).map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm"
            >
              <span className="font-bold text-brand" dir="ltr">{o.id}</span>
              <span className="text-muted-foreground">{o.customer}</span>
              <span className="text-muted-foreground">{statusLabel[o.status]}</span>
              <span className="font-extrabold text-primary">{orderTotal(o)} ج.م</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
