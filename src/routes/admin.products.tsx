import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { categoryName, products as seedProducts, type Product } from "@/data/menu";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "إدارة المنتجات | وزير الحلو" },
      { name: "description", content: "إضافة وتعديل منتجات وزير الحلو وأسعارها وإظهارها أو إخفاؤها." },
      { property: "og:title", content: "إدارة المنتجات | وزير الحلو" },
      { property: "og:description", content: "تحكم في الأصناف والأسعار." },
    ],
  }),
  component: AdminProducts;
});

function AdminProducts() {
  const [list, setList] = useState<Product[]>(seedProducts);
  const [hidden, setHidden] = useState<string[]>([]);
  const [q, setQ] = useState("");

  const shown = list.filter((p) => p.name.includes(q.trim()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl text-brand">إدارة المنتجات</h1>
          <p className="text-sm text-muted-foreground">{list.length} صنف في القائمة</p>
        </div>
        <Button variant="hero" onClick={() => toast.info("نموذج إضافة منتج جديد")}>
          <Plus className="size-4" /> إضافة منتج
        </Button>
      </div>

      <Input placeholder="ابحث عن منتج..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />

      <div className="space-y-3">
        {shown.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              width={816}
              height={816}
              className="size-16 rounded-xl object-cover"
            />
            <div className="min-w-40 flex-1">
              <p className="font-bold text-brand">{p.name}</p>
              <p className="text-xs text-muted-foreground">{categoryName(p.category)}</p>
            </div>
            <span className="font-extrabold text-primary">{p.price} ج.م</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch
                checked={!hidden.includes(p.id)}
                onCheckedChange={(on) =>
                  setHidden((h) => (on ? h.filter((i) => i !== p.id) : [...h, p.id]))
                }
              />
              {hidden.includes(p.id) ? "مخفي" : "ظاهر"}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => toast.info("تعديل المنتج")}>
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setList((l) => l.filter((i) => i.id !== p.id));
                  toast.success("تم حذف المنتج");
                }}
              >
                <Trash2 className="size-4 text-primary" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
