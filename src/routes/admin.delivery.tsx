import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bike, Car, CheckCircle2, Clock, Pencil, Phone, Plus, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initialDeliveryBoys, type DeliveryBoy } from "@/data/adminStore";

export const Route = createFileRoute("/admin/delivery")({
  head: () => ({
    meta: [
      { title: "مناديب التوصيل والأسطول | وزير الحلو" },
      { name: "description", content: "إدارة كباتن التوصيل، متابعة حالتهم وتوزيع الطلبات." },
    ],
  }),
  component: AdminDelivery,
});

function AdminDelivery() {
  const [drivers, setDrivers] = useState<DeliveryBoy[]>(initialDeliveryBoys);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeliveryBoy | null>(null);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formNationalId, setFormNationalId] = useState("");
  const [formVehicle, setFormVehicle] = useState<"سكوتر" | "دراجة نارية" | "سيارة">("سكوتر");
  const [formBranch, setFormBranch] = useState("موقف الخصوص");

  const filtered = drivers.filter((d) => {
    const matchesSearch =
      d.name.includes(search.trim()) ||
      d.phone.includes(search.trim()) ||
      d.branch.includes(search.trim());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => {
    setEditingItem(null);
    setFormName("");
    setFormPhone("+20 ");
    setFormNationalId("");
    setFormVehicle("سكوتر");
    setFormBranch("موقف الخصوص");
    setIsModalOpen(true);
  };

  const openEdit = (d: DeliveryBoy) => {
    setEditingItem(d);
    setFormName(d.name);
    setFormPhone(d.phone);
    setFormNationalId(d.nationalId);
    setFormVehicle(d.vehicle);
    setFormBranch(d.branch);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPhone.trim()) {
      toast.error("يرجى إدخال اسم المندوب ورقم هاتفه");
      return;
    }

    if (editingItem) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === editingItem.id
            ? {
                ...d,
                name: formName.trim(),
                phone: formPhone.trim(),
                nationalId: formNationalId.trim(),
                vehicle: formVehicle,
                branch: formBranch,
              }
            : d
        )
      );
      toast.success("تم تحديث بيانات المندوب بنجاح");
    } else {
      const newDriver: DeliveryBoy = {
        id: `dr-${Date.now()}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        nationalId: formNationalId.trim() || "29900000000000",
        vehicle: formVehicle,
        branch: formBranch,
        status: "متاح",
        activeOrders: 0,
        completedOrders: 0,
        rating: 5.0,
        joinedDate: new Date().toISOString().split("T")[0] ?? "2026-09-22",
      };
      setDrivers((prev) => [newDriver, ...prev]);
      toast.success("تمت إضافة المندوب للأسطول بنجاح");
    }
    setIsModalOpen(false);
  };

  const changeStatus = (id: string, newStatus: "متاح" | "في الطريق" | "غير متاح") => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    toast.success(`تم تغيير حالة المندوب إلى ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    toast.success("تم إزالة المندوب");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Bike className="size-6 text-primary" />
            مناديب التوصيل وأسطول الكباتن
          </h1>
          <p className="text-xs text-muted-foreground">
            متابعة حالة الكباتن في الوقت الفعلي، توزيع الطلبات، وتقييمات العملاء
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> إضافة كابتن جديد
        </Button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] text-center">
          <p className="text-xs text-muted-foreground font-semibold">الكباتن المتاحين</p>
          <p className="text-2xl font-black text-green-600">
            {drivers.filter((d) => d.status === "متاح").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] text-center">
          <p className="text-xs text-muted-foreground font-semibold">في الطريق للتوصيل</p>
          <p className="text-2xl font-black text-primary">
            {drivers.filter((d) => d.status === "في الطريق").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] text-center">
          <p className="text-xs text-muted-foreground font-semibold">إجمالي الطلبات المسلمة</p>
          <p className="text-2xl font-black text-brand">
            {drivers.reduce((acc, d) => acc + d.completedOrders, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {["all", "متاح", "في الطريق", "غير متاح"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${
                statusFilter === st
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {st === "all" ? "جميع الكباتن" : st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-brand">{d.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-semibold">
                      {d.vehicle === "سيارة" ? (
                        <Car className="size-3 text-primary" />
                      ) : (
                        <Bike className="size-3 text-primary" />
                      )}
                      {d.vehicle}
                    </span>
                    <span>فرع: {d.branch}</span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    d.status === "متاح"
                      ? "bg-green-100 text-green-700"
                      : d.status === "في الطريق"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {d.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-y border-border py-2 text-center text-xs">
                <div>
                  <span className="block text-[11px] text-muted-foreground">الطلبات النشطة</span>
                  <span className="font-bold text-primary">{d.activeOrders}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground">الطلبات المنجزة</span>
                  <span className="font-bold text-foreground">{d.completedOrders}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground">التقييم</span>
                  <span className="font-bold text-amber-500 inline-flex items-center gap-0.5 justify-center">
                    <Star className="size-3 fill-amber-500" /> {d.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <div className="flex items-center gap-1">
                <select
                  value={d.status}
                  onChange={(e) =>
                    changeStatus(d.id, e.target.value as "متاح" | "في الطريق" | "غير متاح")
                  }
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs font-semibold"
                >
                  <option value="متاح">متاح</option>
                  <option value="في الطريق">في الطريق</option>
                  <option value="غير متاح">غير متاح</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => window.open(`tel:${d.phone}`)}
                >
                  <Phone className="size-3" /> اتصال
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(d)} title="تعديل">
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)} title="حذف">
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
              {editingItem ? "تعديل بيانات الكابتن" : "إضافة كابتن توصيل جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">اسم الكابتن ثلاثي</label>
              <Input
                placeholder="محمود حسن السيد"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">رقم الهاتف للتواصل والواتساب</label>
              <Input
                dir="ltr"
                placeholder="+20 100..."
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الرقم القومي (14 رقم)</label>
              <Input
                dir="ltr"
                placeholder="29801011234567"
                value={formNationalId}
                onChange={(e) => setFormNationalId(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">وسيلة التوصيل</label>
                <select
                  value={formVehicle}
                  onChange={(e) =>
                    setFormVehicle(e.target.value as "سكوتر" | "دراجة نارية" | "سيارة")
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="سكوتر">سكوتر</option>
                  <option value="دراجة نارية">دراجة نارية</option>
                  <option value="سيارة">سيارة</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-brand">الفرع التابع له</label>
                <Input
                  value={formBranch}
                  onChange={(e) => setFormBranch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingItem ? "حفظ التعديلات" : "إضافة الكابتن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
