import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Images, Pencil, Plus, Trash2 } from "lucide-react";
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
import { initialSliders, type SliderItem } from "@/data/adminStore";

export const Route = createFileRoute("/admin/sliders")({
  head: () => ({
    meta: [
      { title: "السلايدر والبانرات الرئيسية | وزير الحلو" },
      { name: "description", content: "إدارة البانرات والشرائح الترويجية في الصفحة الرئيسية." },
    ],
  }),
  component: AdminSliders,
});

function AdminSliders() {
  const [sliders, setSliders] = useState<SliderItem[]>(initialSliders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SliderItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formBtnText, setFormBtnText] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formOrder, setFormOrder] = useState("1");

  const openAdd = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormSubtitle("");
    setFormBadge("جديد");
    setFormBtnText("اطلب الآن");
    setFormLink("/menu");
    setFormOrder((sliders.length + 1).toString());
    setIsModalOpen(true);
  };

  const openEdit = (s: SliderItem) => {
    setEditingItem(s);
    setFormTitle(s.title);
    setFormSubtitle(s.subtitle);
    setFormBadge(s.badge);
    setFormBtnText(s.buttonText);
    setFormLink(s.link);
    setFormOrder(s.order.toString());
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error("يرجى إدخال عنوان الشريحة (Slider)");
      return;
    }

    if (editingItem) {
      setSliders((prev) =>
        prev.map((s) =>
          s.id === editingItem.id
            ? {
                ...s,
                title: formTitle.trim(),
                subtitle: formSubtitle.trim(),
                badge: formBadge.trim(),
                buttonText: formBtnText.trim() || "اطلب الآن",
                link: formLink.trim() || "/menu",
                order: parseInt(formOrder) || 1,
              }
            : s
        )
      );
      toast.success("تم تحديث الشريحة بنجاح");
    } else {
      const newSlider: SliderItem = {
        id: `sld-${Date.now()}`,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        badge: formBadge.trim() || "جديد",
        buttonText: formBtnText.trim() || "اطلب الآن",
        link: formLink.trim() || "/menu",
        image: sliders[0]?.image || "",
        order: parseInt(formOrder) || sliders.length + 1,
        isActive: true,
      };
      setSliders((prev) => [...prev, newSlider]);
      toast.success("تمت إضافة الشريحة الترويجية بنجاح");
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setSliders((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.success("تم تحديث حالة تفعيل الشريحة");
  };

  const handleDelete = (id: string) => {
    setSliders((prev) => prev.filter((s) => s.id !== id));
    toast.success("تم حذف الشريحة");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Images className="size-6 text-primary" />
            السلايدر والبانرات الترويجية
          </h1>
          <p className="text-xs text-muted-foreground">
            تخصيص البانرات المتحركة في واجهة الموقع، العروض المميزة، وروابط الطلب السريع
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> إضافة شريحة جديدة
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sliders
          .sort((a, b) => a.order - b.order)
          .map((slider) => (
            <div
              key={slider.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
            >
              <div>
                <div className="relative mb-3 h-40 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={slider.image}
                    alt={slider.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute left-2.5 top-2.5 rounded bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur">
                    ترتيب: {slider.order}
                  </span>
                  {slider.badge && (
                    <span className="absolute right-2.5 top-2.5 rounded bg-primary px-2 py-0.5 text-xs font-bold text-white shadow">
                      {slider.badge}
                    </span>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 left-2.5 text-white">
                    <h3 className="font-extrabold text-base drop-shadow">{slider.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {slider.subtitle}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="rounded-md bg-muted px-2 py-1 font-semibold text-foreground">
                    زر الإجراء: {slider.buttonText}
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    <ExternalLink className="size-3" /> {slider.link}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slider.isActive}
                    onCheckedChange={() => toggleStatus(slider.id)}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {slider.isActive ? "معروض بالرئيسية" : "مخفي"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(slider)} title="تعديل">
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(slider.id)} title="حذف">
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
              {editingItem ? "تعديل الشريحة الترويجية" : "إضافة شريحة سلايدر جديدة"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">العنوان الرئيسي</label>
              <Input
                placeholder="مثال: تشكيلة التورت الملكية"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">النص الفرعي / الوصف</label>
              <Input
                placeholder="نص تسويقي قصير يوضح العرض أو الصنف..."
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">شارة التمييز</label>
                <Input
                  placeholder="الأكثر طلباً، خصم 30%"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">ترتيب العرض</label>
                <Input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">نص الزر</label>
                <Input
                  placeholder="اطلب الآن، تصفح القائمة"
                  value={formBtnText}
                  onChange={(e) => setFormBtnText(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">رابط التوجيه</label>
                <Input
                  placeholder="/menu أو /pos"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingItem ? "حفظ التعديلات" : "إضافة الشريحة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
