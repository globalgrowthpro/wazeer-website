import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  Bike,
  Boxes,
  CalendarDays,
  CircleAlert,
  Clock3,
  Download,
  PackageCheck,
  Search,
  ShoppingBag,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { drivers, orders, orderTotal, salesByDay, statusLabel } from "@/data/orders";

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
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");
  const [orderQuery, setOrderQuery] = useState("");
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + orderTotal(o), 0);
  const visibleOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase();
    if (!query) return orders.slice(0, 5);
    return orders.filter((order) => `${order.id} ${order.customer} ${order.branch}`.toLowerCase().includes(query)).slice(0, 5);
  }, [orderQuery]);
  const chartMax = Math.max(...salesByDay.map((item) => item.total));
  const kpis = [
    { label: "إجمالي المبيعات", value: `${revenue.toLocaleString("en-US")} ج.م`, trend: "+12.8%", positive: true, icon: WalletCards, tone: "brand" },
    { label: "الطلبات اليوم", value: String(orders.length), trend: "+8.4%", positive: true, icon: ShoppingBag, tone: "primary" },
    { label: "متوسط الطلب", value: `${Math.round(revenue / orders.length)} ج.م`, trend: "+4.1%", positive: true, icon: PackageCheck, tone: "fresh" },
    { label: "وقت التجهيز", value: "18 دقيقة", trend: "-2.3%", positive: true, icon: Clock3, tone: "gold" },
  ];

  const branches = [
    { name: "الخصوص", orders: 128, sales: "24,890", progress: 88 },
    { name: "شبرا", orders: 96, sales: "18,420", progress: 68 },
    { name: "المرج", orders: 74, sales: "14,730", progress: 53 },
  ];

  const toneClasses: Record<string, string> = {
    brand: "bg-brand/10 text-brand",
    primary: "bg-primary/10 text-primary",
    fresh: "bg-fresh/10 text-fresh",
    gold: "bg-gold/20 text-gold-foreground",
  };

  const statusClasses: Record<string, string> = {
    received: "bg-brand/10 text-brand",
    preparing: "bg-gold/20 text-gold-foreground",
    ready: "bg-fresh/10 text-fresh",
    on_way: "bg-primary/10 text-primary",
    delivered: "bg-fresh/10 text-fresh",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold text-primary">مركز العمليات</p>
          <h1 className="text-2xl text-brand md:text-3xl">نظرة عامة على الأداء</h1>
          <p className="mt-1 text-sm text-muted-foreground">متابعة مباشرة للمبيعات والطلبات وحالة الفروع</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border bg-card p-1 shadow-sm">
            {(["today", "week", "month"] as const).map((value) => (
              <Button
                key={value}
                variant={period === value ? "brand" : "ghost"}
                size="sm"
                onClick={() => setPeriod(value)}
              >
                {value === "today" ? "اليوم" : value === "week" ? "هذا الأسبوع" : "هذا الشهر"}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Download /> تصدير التقرير</Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="group rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
            <div className="mb-5 flex items-start justify-between">
              <span className={`flex size-11 items-center justify-center rounded-md ${toneClasses[kpi.tone]}`}>
                <kpi.icon className="size-5" />
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-fresh">
                {kpi.positive ? <ArrowUpLeft className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
                {kpi.trend}
              </span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{kpi.value}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">مقارنة بالفترة السابقة</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,.75fr)]">
        <article className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-brand">حركة المبيعات</h2>
              <p className="text-xs text-muted-foreground">إجمالي الأسبوع: 260,400 ج.م</p>
            </div>
            <span className="flex items-center gap-2 text-xs font-semibold text-fresh"><span className="size-2 rounded-full bg-fresh" /> نمو مستقر</span>
          </div>
          <div className="grid h-64 grid-cols-7 items-end gap-2 border-b border-border pt-6 sm:gap-4">
            {salesByDay.map((item) => {
              const height = Math.round((item.total / chartMax) * 100);
              return (
                <div key={item.day} className="group/bar flex h-full flex-col items-center justify-end gap-2">
                  <span className="invisible text-[10px] font-bold text-brand group-hover/bar:visible">{(item.total / 1000).toFixed(1)}K</span>
                  <div className="w-full max-w-10 rounded-t-md bg-brand/15 transition-all group-hover/bar:bg-primary" style={{ height: `${height}%` }} />
                  <span className="text-[10px] text-muted-foreground sm:text-xs">{item.day.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="font-bold text-brand">أداء الفروع</h2>
              <p className="text-xs text-muted-foreground">ترتيب حسب المبيعات</p>
            </div>
            <CalendarDays className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-5">
            {branches.map((branch, index) => (
              <div key={branch.name}>
                <div className="mb-2 flex items-end justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">{index + 1}</span>
                    <div><p className="text-sm font-bold">{branch.name}</p><p className="text-[10px] text-muted-foreground">{branch.orders} طلب</p></div>
                  </div>
                  <p className="text-sm font-extrabold text-brand">{branch.sales} ج.م</p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-brand" style={{ width: `${branch.progress}%` }} /></div>
              </div>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm" className="mt-5 w-full text-brand">
            <Link to="/admin/locations">تفاصيل كل الفروع <ArrowLeft /></Link>
          </Button>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.85fr)]">
        <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="font-bold text-brand">أحدث الطلبات</h2><p className="text-xs text-muted-foreground">آخر تحديث منذ دقيقتين</p></div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} placeholder="رقم الطلب أو العميل" aria-label="البحث في الطلبات" className="h-9 w-full rounded-md border border-input bg-background pr-9 pl-3 text-xs outline-none focus:ring-1 focus:ring-ring sm:w-56" />
              </div>
              <Button asChild variant="outline" size="sm"><Link to="/admin/orders">الكل</Link></Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-right text-sm">
              <thead className="bg-muted/60 text-[11px] font-bold text-muted-foreground">
                <tr><th className="px-5 py-3">رقم الطلب</th><th className="px-5 py-3">العميل</th><th className="px-5 py-3">الفرع</th><th className="px-5 py-3">الحالة</th><th className="px-5 py-3">الإجمالي</th><th className="px-5 py-3">الوقت</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-muted/35">
                    <td className="px-5 py-4 font-extrabold text-brand" dir="ltr">{order.id}</td>
                    <td className="px-5 py-4 font-semibold">{order.customer}</td>
                    <td className="px-5 py-4 text-muted-foreground">{order.branch}</td>
                    <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClasses[order.status]}`}>{statusLabel[order.status]}</span></td>
                    <td className="px-5 py-4 font-extrabold">{orderTotal(order)} ج.م</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleOrders.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">لا توجد طلبات مطابقة.</p>}
          </div>
        </article>

        <div className="space-y-5">
          <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-brand">مركز التنبيهات</h2><CircleAlert className="size-5 text-primary" /></div>
            <div className="space-y-3">
              <div className="flex gap-3 rounded-md border border-primary/20 bg-primary/5 p-3"><Boxes className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-xs font-bold">مخزون منخفض</p><p className="mt-0.5 text-[11px] text-muted-foreground">القشطة والفستق أقل من حد إعادة الطلب.</p></div></div>
              <div className="flex gap-3 rounded-md border border-gold/35 bg-gold/10 p-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-gold-foreground" /><div><p className="text-xs font-bold">تأخير في التجهيز</p><p className="mt-0.5 text-[11px] text-muted-foreground">طلبان تجاوزا 25 دقيقة في فرع شبرا.</p></div></div>
            </div>
          </article>

          <article className="rounded-lg bg-brand p-5 text-brand-foreground shadow-[var(--shadow-card)]">
            <p className="text-xs font-semibold text-brand-foreground/65">حالة التوصيل الآن</p>
            <div className="mt-3 flex items-end justify-between"><p className="text-3xl font-extrabold">2</p><Bike className="size-7 text-gold" /></div>
            <p className="mt-1 text-xs text-brand-foreground/70">مندوبان نشطان وطلب واحد في الطريق</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-foreground/15"><div className="h-full w-2/3 rounded-full bg-gold" /></div>
            <Button asChild variant="onBrand" size="sm" className="mt-4 w-full"><Link to="/admin/delivery">إدارة المندوبين <ArrowLeft /></Link></Button>
          </article>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Button asChild variant="outline" className="h-auto justify-start p-4"><Link to="/admin/orders"><ShoppingBag className="text-primary" /><span className="text-right"><strong className="block text-brand">إدارة الطلبات</strong><small className="text-muted-foreground">تحديث الحالات والتعيين</small></span></Link></Button>
        <Button asChild variant="outline" className="h-auto justify-start p-4"><Link to="/admin/products"><Boxes className="text-brand" /><span className="text-right"><strong className="block text-brand">إدارة المنتجات</strong><small className="text-muted-foreground">الأسعار والتوفر والمخزون</small></span></Link></Button>
        <Button asChild variant="outline" className="h-auto justify-start p-4"><Link to="/admin/staff"><Users className="text-fresh" /><span className="text-right"><strong className="block text-brand">فريق العمل</strong><small className="text-muted-foreground">الموظفون والصلاحيات</small></span></Link></Button>
      </section>
    </div>
  );
}
