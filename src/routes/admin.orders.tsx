import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  drivers,
  orders as seedOrders,
  orderTotal,
  statusFlow,
  statusLabel,
  type Order,
  type OrderStatus,
} from "@/data/orders";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "إدارة الطلبات | وزير الحلو" },
      { name: "description", content: "متابعة الطلبات الواردة وتغيير حالتها وإسنادها لمندوبي التوصيل." },
      { property: "og:title", content: "إدارة الطلبات | وزير الحلو" },
      { property: "og:description", content: "تحكم كامل في دورة حياة الطلب." },
    ],
  }),
  component: AdminOrders,
});

const filters: { v: OrderStatus | "all"; t: string }[] = [
  { v: "all", t: "الكل" },
  ...statusFlow.map((s) => ({ v: s, t: statusLabel[s] })),
  { v: "cancelled", t: statusLabel.cancelled },
];

function AdminOrders() {
  const [list, setList] = useState<Order[]>(seedOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const update = (id: string, patch: Partial<Order>) => {
    setList((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    toast.success("تم تحديث الطلب");
  };

  const shown = filter === "all" ? list : list.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-brand">إدارة الطلبات</h1>
        <p className="text-sm text-muted-foreground">غيّر حالة الطلب أو أسنده لمندوب</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === f.v
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-brand hover:border-primary"
            }`}
          >
            {f.t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-brand" dir="ltr">{o.id}</p>
                <p className="text-xs text-muted-foreground">
                  {o.customer} • <span dir="ltr">{o.phone}</span> • {o.createdAt} • فرع {o.branch}
                </p>
              </div>
              <span className="font-extrabold text-primary">{orderTotal(o)} ج.م</span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {o.lines.map((l) => `${l.name} ×${l.qty}`).join(" ، ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {o.type === "delivery" ? o.address : "استلام من الفرع"} • {o.payment}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Select value={o.status} onValueChange={(v) => update(o.id, { status: v as OrderStatus })}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {[...statusFlow, "cancelled" as OrderStatus].map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabel[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={o.driverId ?? "none"}
                onValueChange={(v) => update(o.id, { driverId: v === "none" ? undefined : v })}
                disabled={o.type === "pickup"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="المندوب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون مندوب</SelectItem>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} — {d.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            لا توجد طلبات بهذه الحالة.
          </p>
        )}
      </div>
    </div>
  );
}
