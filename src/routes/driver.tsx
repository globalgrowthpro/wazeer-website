import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  orders as seedOrders,
  orderTotal,
  statusLabel,
  type Order,
  type OrderStatus,
} from "@/data/orders";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/driver")({
  head: () => ({
    meta: [
      { title: "لوحة مندوب التوصيل | وزير الحلو" },
      { name: "description", content: "طلبات التوصيل المسندة للمندوب مع تحديث الحالة وبيانات العميل." },
      { property: "og:title", content: "لوحة مندوب التوصيل | وزير الحلو" },
      { property: "og:description", content: "تابع طلباتك وسلّمها في وقتها." },
    ],
  }),
  component: DriverPanel,
});

const DRIVER_ID = "d1";

function DriverPanel() {
  const { user } = useAuth();
  const [list, setList] = useState<Order[]>(
    seedOrders.filter((o) => o.driverId === DRIVER_ID || o.status === "ready"),
  );

  const advance = (o: Order) => {
    const next: OrderStatus = o.status === "on_way" ? "delivered" : "on_way";
    setList((prev) => prev.map((i) => (i.id === o.id ? { ...i, status: next } : i)));
    toast.success(next === "delivered" ? "تم تسليم الطلب" : "بدأت رحلة التوصيل");
  };

  const active = list.filter((o) => o.status !== "delivered");
  const done = list.filter((o) => o.status === "delivered");

  return (
    <div className="bg-muted/50">
      <div className="container-page space-y-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl text-brand">لوحة مندوب التوصيل</h1>
            <p className="text-sm text-muted-foreground">
              {user ? `أهلاً ${user.name}` : "طلبات التوصيل المسندة إليك"}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/auth">تبديل الحساب</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { l: "طلبات نشطة", v: String(active.length) },
            { l: "تم التسليم اليوم", v: String(done.length) },
            { l: "إجمالي التحصيل", v: `${list.reduce((n, o) => n + orderTotal(o), 0)} ج.م` },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <p className="text-xl font-extrabold text-primary">{k.v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{k.l}</p>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="font-bold text-brand">الطلبات المسندة</h2>
          {active.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-brand" dir="ltr">{o.id}</p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {statusLabel[o.status]}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-brand">{o.customer}</p>
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" /> {o.address}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {o.lines.map((l) => `${l.name} ×${l.qty}`).join(" ، ")}
              </p>
              <p className="mt-1 text-sm font-extrabold text-primary">
                التحصيل: {orderTotal(o)} ج.م • {o.payment}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="hero" size="sm" onClick={() => advance(o)}>
                  {o.status === "on_way" ? "تم التسليم" : "بدء التوصيل"}
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`}>
                    <Phone className="size-4" /> اتصال بالعميل
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(o.address)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="size-4" /> الخريطة
                  </a>
                </Button>
              </div>
            </div>
          ))}
          {active.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              لا توجد طلبات نشطة حاليًا.
            </p>
          )}
        </section>

        {done.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-bold text-brand">تم تسليمها</h2>
            {done.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap justify-between gap-2 rounded-xl border border-border bg-card p-3 text-sm"
              >
                <span className="font-bold text-brand" dir="ltr">{o.id}</span>
                <span className="text-muted-foreground">{o.customer}</span>
                <span className="font-extrabold text-fresh">{orderTotal(o)} ج.م</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
