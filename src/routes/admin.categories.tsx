import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layers, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { initialCategories, type CategoryItem } from "@/data/adminStore";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "إدارة الأقسام والتصنيفات | وزير الحلو" },
      { name: "description", content: "إدارة أقسام قائمة طعام وزير الحلو وترتيبها." },
    ],
  }),
  component: AdminCategories,
});

function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);

  const [formName, setFormName] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formOrder, setFormOrder] = useState("1");

  const filtered = categories.filter(
    (c) =>
      c.name.includes(search.trim()) ||
      c.nameEn.toLowerCase().includes(search.trim().toLowerCase()) ||
      c.slug.includes(search.trim())
  );

  const openAdd = () => {
    setEditingItem(null);
    setFormName("");
    setFormNameEn("");
    setFormSlug("");
    setFormOrder((categories.length + 1).toString());
    setIsModalOpen(true);
  };

  const openEdit = (cat: CategoryItem) => {
    setEditingItem(cat);
    setFormName(cat.name);
    setFormNameEn(cat.nameEn);
    setFormSlug(cat.slug);
    setFormOrder(cat.order.toString());
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formSlug.trim()) {
      toast.error("يرجى إدخال اسم القسم بالعربية والرابط المختصر (Slug)");
      return;
    }

    if (editingItem) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                name: formName.trim(),
                nameEn: formNameEn.trim(),
                slug: formSlug.trim(),
                order: parseInt(formOrder) || 1,
              }
            : c
        )
      );
      toast.success("تم تحديث القسم بنجاح");
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        nameEn: formNameEn.trim() || formName.trim(),
        slug: formSlug.trim().toLowerCase(),
        image: categories[0]?.image || "",
        productsCount: 0,
        order: parseInt(formOrder) || categories.length + 1,
        isActive: true,
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success("تمت إضافة القسم الجديد بنجاح");
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toast.success("تم تحديث حالة تفعيل القسم");
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("تم حذف القسم");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Layers className="size-6 text-primary" />
            إدارة الأقسام والتصنيفات
          </h1>
          <p className="text-xs text-muted-foreground">
            تنظيم أصناف وزير الحلو وتحديد ترتيب ظهورها في المتجر والتطبيق
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> إضافة تصنيف جديد
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث عن قسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <img
                src={cat.image}
                alt={cat.name}
                className="size-14 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-brand">{cat.name}</h3>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    ترتيب: {cat.order}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{cat.nameEn}</p>
                <code className="text-[10px] text-primary">/{cat.slug}</code>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="font-semibold text-muted-foreground">
                {cat.productsCount} صنف مسجل
              </span>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={cat.isActive}
                    onCheckedChange={() => toggleStatus(cat.id)}
                  />
                  <span className="text-[11px]">{cat.isActive ? "نشط" : "معطل"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(cat)} title="تعديل">
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} title="حذف">
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
            <DialogTitle>{editingItem ? "تعديل بيانات القسم" : "إضافة قسم جديد"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">اسم القسم (بالعربية)</label>
              <Input
                placeholder="مثال: كنافة وبسبوسة"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">اسم القسم (بالإنجليزية)</label>
              <Input
                placeholder="e.g. Kunafa & Basbousa"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الرابط المختصر (Slug)</label>
              <Input
                placeholder="kunafa-basbousa"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">ترتيب الظهور</label>
              <Input
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingItem ? "حفظ التعديلات" : "إضافة القسم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
