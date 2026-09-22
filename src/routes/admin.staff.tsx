import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { drivers as seedDrivers, staff, type Driver } from "@/data/orders";

export const Route = createFileRoute("/admin/staff")({
  head: () => ({
    meta: [
      { title: "الفريق والمندوبين | وزير الحلو" },
      { name: "description", content: "إدارة فريق العمل ومندوبي التوصيل وصلاحياتهم في وزير الحلو." },
      { property: "og:title", content: "الفريق والمندوبين | وزير الحلو" },
      { property: "og:description", content: "أعضاء الفريق ومندوبو التوصيل." },
    ],
  }),
  component: AdminStaff,
});

function AdminStaff() {
  const [list, setList] = useState<Driver[]>(seedDrivers);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl text-brand">الفريق والمندوبين</h1>
          <p className="text-sm text-muted-foreground">إدارة الموظفين ومندوبي التوصيل</p>
        </div>
        <Button variant="hero" onClick={() => toast.info("نموذج إضافة عضو جديد")}>
          <Plus className="size-4" /> إضافة عضو
        </Button>
      </div>

      <section>
        <h2 className="mb-3 font-bold text-brand">مندوبو التوصيل</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((d) => (
            <div key={d.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-brand">{d.name}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">{d.phone}</p>
                </div>
                <Switch
                  checked={d.active}
                  onCheckedChange={(on) => {
                    setList((l) => l.map((i) => (i.id === d.id ? { ...i, active: on } : i)));
                    toast.success(on ? "المندوب متاح الآن" : "تم إيقاف المندوب");
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                فرع {d.branch} • {d.deliveries} توصيلة • تقييم {d.rating}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand">فريق العمل</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {staff.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="font-bold text-brand">{s.name}</p>
              <p className="text-xs text-muted-foreground" dir="ltr">{s.phone}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {s.role} • فرع {s.branch}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
