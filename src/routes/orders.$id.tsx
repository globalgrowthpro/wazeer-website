import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import {
  drivers,
  orders,
  orderTotal,
  pickupFlow,
  statusFlow,
  statusLabel,
  type Order,
} from "@/data/orders";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "تتبع الطلب | وزير الحلو" },
      { name: "description", content: "تابع حالة طلبك من وزير الحلو خطوة بخطوة حتى التسليم." },
      { property: "og:title", content: "تتبع الطلب | وزير الحلو" },
      { property: "og:description", content: "حالة الطلب لحظة بلحظة." },
    ],
  }),
  component: TrackPage,
});

const fallback: Order = {
  id: "WZ-10249",
  customer: "عميل وزير الحلو",
  phone: "+20 100 123 4567",
  address: "١٢ شارع الجمهورية، الخصوص",
  branch: "الخصوص",
  type: "delivery",
  status: "preparing",
  payment: "الدفع عند الاستلام",
  createdAt: "اليوم",
  driverId: "d1",
  lines: [{ name: "قشطوطة مميزة", qty: 1, price: 99 }],
};

function TrackPage() {
  const { id } = Route.useParams();
  const order = orders.find((o) => o.id === id) ?? { ...fallback, id };
  const flow = order.type === "pickup" ? pickupFlow : statusFlow;
  const current = flow.indexOf(order.status);
  const driver = drivers.find((d) => d.id === order.driverId);

  return (
    <>
      <PageHero title="تتبع الطلب" subtitle={`رقم الطلب ${order.id}`} />

      <section className="section-y">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-bold text-brand">حالة الطلب</h2>
            <ol className="mt-6 space-y-5">
              {flow.map((s, i) => {
                const done = current >= i && order.status !== "cancelled";
                return (
                  <li key={s} className="flex items-start gap-3">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        done ? "bg-fresh text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="size-4" /> : i + 1}
                    </span>
                    <div>
                      <p className={`font-semibold ${done ? "text-brand" : "text-muted-foreground"}`}>
                        {s === "ready" && order.type === "pickup" ? "جاهز للاستلام" : statusLabel[s]}
                      </p>
                      {current === i && (
                        <p className="text-xs text-primary">الحالة الحالية</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {order.status === "cancelled" && (
              <p className="mt-6 rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary">
                تم إلغاء هذا الطلب.
              </p>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-bold text-brand">تفاصيل الطلب</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {order.lines.map((l) => (
                  <li key={l.name} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {l.name} × {l.qty}
                    </span>
                    <span className="font-semibold text-brand">{l.qty * l.price} ج.م</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-extrabold text-primary">
                <span>الإجمالي</span>
                <span>{orderTotal(order)} ج.م</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {order.type === "delivery" ? order.address : `الاستلام من فرع ${order.branch}`} •{" "}
                {order.payment}
              </p>
            </div>

            {driver && order.type === "delivery" && (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h2 className="font-bold text-brand">مندوب التوصيل</h2>
                <p className="mt-2 text-sm text-muted-foreground">{driver.name}</p>
                <p className="text-sm" dir="ltr">{driver.phone}</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <a href={`tel:${driver.phone.replace(/\s/g, "")}`}>
                    <Phone className="size-4" /> اتصال بالمندوب
                  </a>
                </Button>
              </div>
            )}

            <Button asChild variant="hero" className="w-full">
              <Link to="/menu">اطلب مرة أخرى</Link>
            </Button>
          </aside>
        </div>
      </section>
    </>
  );
}
