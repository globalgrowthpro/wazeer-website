import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Pencil, Plus, Search, TicketPercent, Trash2 } from "lucide-react";
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
import { initialCoupons, type CouponItem } from "@/data/adminStore";

export const Route = createFileRoute("/admin/coupons")({
  head: () => ({
    meta: [
      { title: "كوبونات الخصم وقسائم الشراء | وزير الحلو" },
      { name: "description", content: "إدارة وإنشاء أكواد الخصم وقسائم التخفيض لعملاء وزير الحلو." },
    ],
  }),
  component: AdminCoupons,
});

function AdminCoupons() {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CouponItem | null>(null);

  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<"percentage" | "fixed">("percentage");
  const [formValue, setFormValue] = useState("15");
  const [formMinSpend, setFormMinSpend] = useState("100");
  const [formLimit, setFormLimit] = useState("500");
  const [formExpiry, setFormExpiry] = useState("2026-12-31");

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openAdd = () => {
    setEditingItem(null);
    setFormCode("");
    setFormType("percentage");
    setFormValue("15");
    setFormMinSpend("150");
    setFormLimit("500");
    setFormExpiry("2026-12-31");
    setIsModalOpen(true);
  };

  const openEdit = (c: CouponItem) => {
    setEditingItem(c);
    setFormCode(c.code);
    setFormType(c.discountType);
    setFormValue(c.discountValue.toString());
    setFormMinSpend(c.minSpend.toString());
    setFormLimit(c.usageLimit.toString());
    setFormExpiry(c.expiryDate);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formCode.trim()) {
      toast.error("يرجى إدخال رمز الكوبون");
      return;
    }

    const valNum = parseFloat(formValue) || 0;
    const minNum = parseFloat(formMinSpend) || 0;
    const limitNum = parseInt(formLimit) || 100;

    if (editingItem) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                code: formCode.trim().toUpperCase(),
                discountType: formType,
                discountValue: valNum,
                minSpend: minNum,
                usageLimit: limitNum,
                expiryDate: formExpiry,
              }
            : c
        )
      );
      toast.success("تم تحديث الكوبون بنجاح");
    } else {
      const newCoupon: CouponItem = {
        id: `cpn-${Date.now()}`,
        code: formCode.trim().toUpperCase(),
        discountType: formType,
        discountValue: valNum,
        minSpend: minNum,
        usageLimit: limitNum,
        usageCount: 0,
        expiryDate: formExpiry,
        isActive: true,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success("تم إنشاء كود الخصم بنجاح");
    }
    setIsModalOpen(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`تم نسخ الكوبون ${code}`);
  };

  const toggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toast.success("تم تغيير حالة الكوبون");
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("تم حذف الكوبون");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <TicketPercent className="size-6 text-primary" />
            كوبونات الخصم الترويجية
          </h1>
          <p className="text-xs text-muted-foreground">
            إنشاء رموز الخصم المباشرة، تحديد نسب التخفيض، والحد الأدنى للطلبات
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> إنشاء كوبون جديد
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث برمز الكوبون..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-2xl border border-dashed border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/50"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black tracking-wider text-primary">
                    {c.code}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => copyCode(c.code)}
                    title="نسخ الرمز"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  {c.discountType === "percentage"
                    ? `خصم ${c.discountValue}%`
                    : `خصم ${c.discountValue} ج.م`}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground border-y border-border/60 py-2.5 my-2">
                <div>
                  <span className="block text-[11px]">الحد الأدنى للطلب:</span>
                  <span className="font-bold text-foreground">{c.minSpend} ج.م</span>
                </div>
                <div>
                  <span className="block text-[11px]">تاريخ الانتهاء:</span>
                  <span className="font-bold text-foreground">{c.expiryDate}</span>
                </div>
                <div>
                  <span className="block text-[11px]">مرات الاستخدام:</span>
                  <span className="font-bold text-foreground">
                    {c.usageCount} / {c.usageLimit}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px]">نسبة الاستهلاك:</span>
                  <span className="font-bold text-primary">
                    {Math.round((c.usageCount / c.usageLimit) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={c.isActive}
                  onCheckedChange={() => toggleStatus(c.id)}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {c.isActive ? "صالح للاستخدام" : "معطل"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="تعديل">
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} title="حذف">
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
            <DialogTitle>{editingItem ? "تعديل الكوبون" : "إنشاء كود خصم جديد"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">رمز الكوبون (Coupon Code)</label>
              <Input
                placeholder="مثال: WAZEER20"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                className="font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">نوع الخصم</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as "percentage" | "fixed")}
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
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">الحد الأدنى للطلب (ج.م)</label>
                <Input
                  type="number"
                  value={formMinSpend}
                  onChange={(e) => setFormMinSpend(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">أقصى عدد مرات استخدام</label>
                <Input
                  type="number"
                  value={formLimit}
                  onChange={(e) => setFormLimit(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand">تاريخ الانتهاء</label>
              <Input
                type="date"
                value={formExpiry}
                onChange={(e) => setFormExpiry(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingItem ? "حفظ التعديلات" : "إنشاء الكوبون"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
