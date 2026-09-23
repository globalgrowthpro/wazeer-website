import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Percent, Pencil, Plus, Search, Tag, Trash2 } from "lucide-react";
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
import { initialOffers, type OfferItem } from "@/data/adminStore";

export const Route = createFileRoute("/admin/offers")({
  head: () => ({
    meta: [
      { title: "العروض والخصومات الترويجية | وزير الحلو" },
      { name: "description", content: "إدارة وتفعيل حملات الخصومات والعروض الخاصة لوزير الحلو." },
    ],
  }),
  component: AdminOffers,
});

function AdminOffers() {
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OfferItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formDiscountType, setFormDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [formDiscountVal, setFormDiscountVal] = useState("20");
  const [formCategory, setFormCategory] = useState("قشطوطة");
  const [formStart, setFormStart] = useState("2026-09-22");
  const [formEnd, setFormEnd] = useState("2026-10-15");

  const filtered = offers.filter(
    (o) =>
      o.title.includes(search.trim()) ||
      o.targetCategory.includes(search.trim()) ||
      o.badge.includes(search.trim())
  );

  const openAdd = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormBadge("عرض محدود");
    setFormDiscountType("percentage");
    setFormDiscountVal("20");
    setFormCategory("قشطوطة");
    setFormStart("2026-09-22");
    setFormEnd("2026-10-15");
    setIsModalOpen(true);
  };

  const openEdit = (o: OfferItem) => {
    setEditingItem(o);
    setFormTitle(o.title);
    setFormBadge(o.badge);
    setFormDiscountType(o.discountType);
    setFormDiscountVal(o.discountValue.toString());
    setFormCategory(o.targetCategory);
    setFormStart(o.startDate);
    setFormEnd(o.endDate);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error("يرجى إدخال عنوان العرض الترويجي");
      return;
    }

    const discountNum = parseFloat(formDiscountVal) || 0;

    if (editingItem) {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === editingItem.id
            ? {
                ...o,
                title: formTitle.trim(),
                badge: formBadge.trim(),
                discountType: formDiscountType,
                discountValue: discountNum,
                targetCategory: formCategory,
                startDate: formStart,
                endDate: formEnd,
              }
            : o
        )
      );
      toast.success("تم تحديث بيانات العرض بنجاح");
    } else {
      const newOffer: OfferItem = {
        id: `off-${Date.now()}`,
        title: formTitle.trim(),
        badge: formBadge.trim() || "عرض خاص",
        discountType: formDiscountType,
        discountValue: discountNum,
        targetCategory: formCategory,
        startDate: formStart,
        endDate: formEnd,
        isActive: true,
        bannerImage: offers[0]?.bannerImage || "",
      };
      setOffers((prev) => [newOffer, ...prev]);
      toast.success("تم إطلاق العرض الجديد بنجاح");
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
    toast.success("تم تغيير حالة تفعيل العرض");
  };

  const handleDelete = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    toast.success("تم حذف العرض");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Percent className="size-6 text-primary" />
            العروض والخصومات الترويجية
          </h1>
          <p className="text-xs text-muted-foreground">
            إدارة الباقات التوفيرية، التخفيضات المئوية، وعروض نهاية الأسبوع
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> إضافة عرض جديد
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث عن عرض..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((offer) => (
          <div
            key={offer.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
          >
            <div>
              <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-muted">
                <img
                  src={offer.bannerImage}
                  alt={offer.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-2.5 top-2.5 rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-md">
                  {offer.badge}
                </span>
              </div>

              <h3 className="font-extrabold text-brand line-clamp-1">{offer.title}</h3>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5">
                  <Tag className="size-3 text-primary" /> {offer.targetCategory}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" /> {offer.startDate} إلى {offer.endDate}
                </span>
              </div>

              <div className="mt-3 text-sm font-bold text-primary">
                قيمة الخصم:{" "}
                {offer.discountType === "percentage"
                  ? `${offer.discountValue}%`
                  : `${offer.discountValue} ج.م`}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={offer.isActive}
                  onCheckedChange={() => toggleStatus(offer.id)}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {offer.isActive ? "نشط حالياً" : "متوقف"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(offer)} title="تعديل">
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(offer.id)} title="حذف">
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
            <DialogTitle>{editingItem ? "تعديل بيانات العرض" : "إضافة عرض ترويجي جديد"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">عنوان العرض</label>
              <Input
                placeholder="مثال: خصم خاص على قشطوطة اللوتس"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">شارة التمييز (Badge)</label>
              <Input
                placeholder="مثال: خصم 25% أو 1+1 مجاناً"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">نوع الخصم</label>
                <select
                  value={formDiscountType}
                  onChange={(e) => setFormDiscountType(e.target.value as "percentage" | "fixed")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ج.م)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-brand">قيمة الخصم</label>
                <Input
                  type="number"
                  value={formDiscountVal}
                  onChange={(e) => setFormDiscountVal(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand">القسم المستهدف</label>
              <Input
                placeholder="قشطوطة، كيك، حلويات شرقية..."
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">تاريخ البدء</label>
                <Input
                  type="date"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">تاريخ الانتهاء</label>
                <Input
                  type="date"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingItem ? "حفظ التعديلات" : "إطلاق العرض"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
