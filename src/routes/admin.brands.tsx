import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initialBrands, type BrandItem } from "@/data/adminStore";

export const Route = createFileRoute("/admin/brands")({
  head: () => ({
    meta: [
      { title: "العلامات التجارية والشركاء | وزير الحلو" },
      { name: "description", content: "إدارة العلامات التجارية وموردي المكونات الفاخرة." },
    ],
  }),
  component: AdminBrands,
});

function AdminBrands() {
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BrandItem | null>(null);

  const [formName, setFormName] = useState("");
  const [formOrigin, setFormOrigin] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const filtered = brands.filter(
    (b) =>
      b.name.includes(search.trim()) ||
      b.origin.includes(search.trim()) ||
      b.description.includes(search.trim())
  );

  const openAdd = () => {
    setEditingItem(null);
    setFormName("");
    setFormOrigin("");
    setFormDesc("");
    setIsModalOpen(true);
  };

  const openEdit = (b: BrandItem) => {
    setEditingItem(b);
    setFormName(b.name);
    setFormOrigin(b.origin);
    setFormDesc(b.description);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("يرجى إدخال اسم العلامة التجارية");
      return;
    }

    if (editingItem) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingItem.id
            ? { ...b, name: formName.trim(), origin: formOrigin.trim(), description: formDesc.trim() }
            : b
        )
      );
      toast.success("تم تحديث بيانات العلامة التجارية بنجاح");
    } else {
      const newBrand: BrandItem = {
        id: `brand-${Date.now()}`,
        name: formName.trim(),
        origin: formOrigin.trim() || "محلي",
        description: formDesc.trim() || "مكونات مميزة لحلويات وزير الحلو",
        productsCount: 0,
        isActive: true,
      };
      setBrands((prev) => [...prev, newBrand]);
      toast.success("تمت إضافة العلامة التجارية بنجاح");
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    toast.success("تم تحديث حالة تفعيل العلامة التجارية");
  };

  const handleDelete = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    toast.success("تم حذف العلامة التجارية");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Award className="size-6 text-primary" />
            العلامات التجارية والشركاء
          </h1>
          <p className="text-xs text-muted-foreground">
            إدارة الماركات العالمية والمحلية المعتمدة في تحضير وتزيين حلويات وزير الحلو
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> إضافة علامة تجارية
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث عن علامة تجارية..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  بلد المنشأ: {b.origin}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {b.productsCount} صنف مرتبط
                </span>
              </div>
              <h3 className="mt-2 text-base font-extrabold text-brand">{b.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={b.isActive}
                  onCheckedChange={() => toggleStatus(b.id)}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {b.isActive ? "نشط" : "معطل"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(b)} title="تعديل">
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)} title="حذف">
                  <Trash2 className="size-3.5 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "تعديل العلامة التجارية" : "إضافة علامة تجارية جديدة"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">اسم العلامة التجارية</label>
              <Input
                placeholder="مثال: شوكولاتة كيندر (Kinder)"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">بلد المنشأ</label>
              <Input
                placeholder="مثال: إيطاليا، مصر، ألمانيا"
                value={formOrigin}
                onChange={(e) => setFormOrigin(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الوصف ونبذة الشراكة</label>
              <Input
                placeholder="مكونات أصلية تستخدم في تحضير الكريب والوافل..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingItem ? "حفظ التعديلات" : "إضافة الآن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
