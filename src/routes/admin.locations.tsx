import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Compass,
  DollarSign,
  MapPin,
  Navigation,
  Pencil,
  Phone,
  Plus,
  Scale,
  Search,
  Store,
  Trash2,
  Truck,
  User,
} from "lucide-react";
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
import {
  initialDeliveryZones,
  initialLocations,
  type DeliveryZoneItem,
  type LocationItem,
} from "@/data/adminStore";

export const Route = createFileRoute("/admin/locations")({
  head: () => ({
    meta: [
      { title: "الفروع ومناطق التوصيل | وزير الحلو" },
      { name: "description", content: "إدارة فروع وزير الحلو، نطاق التوصيل، المدن والأحياء ورسوم التوصيل." },
    ],
  }),
  component: AdminLocations,
});

function AdminLocations() {
  const [activeTab, setActiveTab] = useState<"branches" | "zones">("zones");

  // Branches state
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [searchBranch, setSearchBranch] = useState("");
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<LocationItem | null>(null);

  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formManager, setFormManager] = useState("");
  const [formRadius, setFormRadius] = useState("15");
  const [formMinOrder, setFormMinOrder] = useState("80");
  const [formDeliveryFee, setFormDeliveryFee] = useState("15");
  const [formHours, setFormHours] = useState("10:00 ص - 02:00 ص");

  // Delivery Zones state (City, district, cost, qty, unit)
  const [zones, setZones] = useState<DeliveryZoneItem[]>(initialDeliveryZones);
  const [searchZone, setSearchZone] = useState("");
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZoneItem | null>(null);

  const [zoneCity, setZoneCity] = useState("");
  const [zoneDistrict, setZoneDistrict] = useState("");
  const [zoneCost, setZoneCost] = useState("20");
  const [zoneQty, setZoneQty] = useState("1");
  const [zoneUnit, setZoneUnit] = useState<"طلب" | "كجم" | "قطعة" | "وجبة" | "بوكس">("طلب");
  const [zoneTime, setZoneTime] = useState("30-45 دقيقة");

  // Filtered lists
  const filteredBranches = locations.filter(
    (l) =>
      l.name.includes(searchBranch.trim()) ||
      l.address.includes(searchBranch.trim()) ||
      l.city.includes(searchBranch.trim()) ||
      l.manager.includes(searchBranch.trim())
  );

  const filteredZones = zones.filter(
    (z) =>
      z.city.includes(searchZone.trim()) ||
      z.district.includes(searchZone.trim())
  );

  // Branch handlers
  const openAddBranch = () => {
    setEditingBranch(null);
    setFormName("");
    setFormAddress("");
    setFormCity("القاهرة الكبرى");
    setFormPhone("+20 122 228 1651");
    setFormManager("");
    setFormRadius("15");
    setFormMinOrder("80");
    setFormDeliveryFee("15");
    setFormHours("10:00 ص - 02:00 ص");
    setIsBranchModalOpen(true);
  };

  const openEditBranch = (l: LocationItem) => {
    setEditingBranch(l);
    setFormName(l.name);
    setFormAddress(l.address);
    setFormCity(l.city);
    setFormPhone(l.phone);
    setFormManager(l.manager);
    setFormRadius(l.radiusKm.toString());
    setFormMinOrder(l.minOrder.toString());
    setFormDeliveryFee(l.deliveryFee.toString());
    setFormHours(l.workingHours);
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = () => {
    if (!formName.trim() || !formAddress.trim()) {
      toast.error("يرجى إدخال اسم الفرع وعنوانه");
      return;
    }

    if (editingBranch) {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === editingBranch.id
            ? {
                ...l,
                name: formName.trim(),
                address: formAddress.trim(),
                city: formCity.trim(),
                phone: formPhone.trim(),
                manager: formManager.trim(),
                radiusKm: parseFloat(formRadius) || 10,
                minOrder: parseFloat(formMinOrder) || 50,
                deliveryFee: parseFloat(formDeliveryFee) || 15,
                workingHours: formHours.trim(),
              }
            : l
        )
      );
      toast.success("تم تحديث بيانات الفرع بنجاح");
    } else {
      const newLoc: LocationItem = {
        id: `loc-${Date.now()}`,
        name: formName.trim(),
        address: formAddress.trim(),
        city: formCity.trim() || "مصر",
        phone: formPhone.trim() || "+20 122 228 1651",
        manager: formManager.trim() || "مدير الفرع",
        radiusKm: parseFloat(formRadius) || 10,
        minOrder: parseFloat(formMinOrder) || 50,
        deliveryFee: parseFloat(formDeliveryFee) || 15,
        workingHours: formHours.trim(),
        isActive: true,
      };
      setLocations((prev) => [...prev, newLoc]);
      toast.success("تمت إضافة الفرع الجديد بنجاح");
    }
    setIsBranchModalOpen(false);
  };

  const toggleBranchStatus = (id: string) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l))
    );
    toast.success("تم تغيير حالة تشغيل الفرع");
  };

  const handleDeleteBranch = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    toast.success("تم حذف الفرع");
  };

  // Zone handlers
  const openAddZone = () => {
    setEditingZone(null);
    setZoneCity("الخصوص");
    setZoneDistrict("");
    setZoneCost("20");
    setZoneQty("1");
    setZoneUnit("طلب");
    setZoneTime("30-40 دقيقة");
    setIsZoneModalOpen(true);
  };

  const openEditZone = (z: DeliveryZoneItem) => {
    setEditingZone(z);
    setZoneCity(z.city);
    setZoneDistrict(z.district);
    setZoneCost(z.cost.toString());
    setZoneQty(z.qty.toString());
    setZoneUnit(z.unit);
    setZoneTime(z.estimatedTime);
    setIsZoneModalOpen(true);
  };

  const handleSaveZone = () => {
    if (!zoneCity.trim() || !zoneDistrict.trim()) {
      toast.error("يرجى إدخال اسم المدينة والحي أو المنطقة");
      return;
    }

    const costNum = parseFloat(zoneCost) || 0;
    const qtyNum = parseFloat(zoneQty) || 1;

    if (editingZone) {
      setZones((prev) =>
        prev.map((z) =>
          z.id === editingZone.id
            ? {
                ...z,
                city: zoneCity.trim(),
                district: zoneDistrict.trim(),
                cost: costNum,
                qty: qtyNum,
                unit: zoneUnit,
                estimatedTime: zoneTime.trim() || "30-45 دقيقة",
              }
            : z
        )
      );
      toast.success("تم تحديث منطقة التوصيل بنجاح");
    } else {
      const newZone: DeliveryZoneItem = {
        id: `zn-${Date.now()}`,
        city: zoneCity.trim(),
        district: zoneDistrict.trim(),
        cost: costNum,
        qty: qtyNum,
        unit: zoneUnit,
        estimatedTime: zoneTime.trim() || "30-45 دقيقة",
        isActive: true,
      };
      setZones((prev) => [...prev, newZone]);
      toast.success("تمت إضافة منطقة التوصيل بنجاح");
    }
    setIsZoneModalOpen(false);
  };

  const toggleZoneStatus = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z))
    );
    toast.success("تم تحديث حالة منطقة التوصيل");
  };

  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    toast.success("تم حذف منطقة التوصيل");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <MapPin className="size-6 text-primary" />
            الفروع ومناطق ورسوم التوصيل (Delivery Zones)
          </h1>
          <p className="text-xs text-muted-foreground">
            إدارة فروع وزير الحلو، تسعير التوصيل حسب المدينة والحي والكمية والوحدة
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "zones" ? (
            <Button variant="hero" onClick={openAddZone}>
              <Plus className="size-4" /> إضافة منطقة توصيل (Zone)
            </Button>
          ) : (
            <Button variant="hero" onClick={openAddBranch}>
              <Plus className="size-4" /> إضافة فرع جديد
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("zones")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "zones"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Truck className="size-3.5" />
          مناطق ورسوم التوصيل ({zones.length})
        </button>
        <button
          onClick={() => setActiveTab("branches")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "branches"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Store className="size-3.5" />
          الفروع ومطابخ التجهيز ({locations.length})
        </button>
      </div>

      {/* DELIVERY ZONES TAB */}
      {activeTab === "zones" && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ابحث بالمدينة أو الحي..."
              value={searchZone}
              onChange={(e) => setSearchZone(e.target.value)}
              className="pr-9"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold">
                  <th className="pb-3 pr-2">المدينة (City)</th>
                  <th className="pb-3">الحي / المنطقة (District)</th>
                  <th className="pb-3 text-center">تكلفة التوصيل (Cost)</th>
                  <th className="pb-3 text-center">الكمية (Qty)</th>
                  <th className="pb-3 text-center">الوحدة (Unit)</th>
                  <th className="pb-3 text-center">الوقت المقدر</th>
                  <th className="pb-3 text-center">الحالة</th>
                  <th className="pb-3 pl-2 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredZones.map((z) => (
                  <tr key={z.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-2 font-bold text-brand">{z.city}</td>
                    <td className="py-3 font-semibold text-foreground">{z.district}</td>
                    <td className="py-3 text-center font-extrabold text-primary">
                      {z.cost} ج.م
                    </td>
                    <td className="py-3 text-center font-bold text-foreground">
                      {z.qty}
                    </td>
                    <td className="py-3 text-center">
                      <span className="rounded bg-muted px-2 py-0.5 font-semibold text-muted-foreground">
                        {z.unit}
                      </span>
                    </td>
                    <td className="py-3 text-center text-muted-foreground">
                      {z.estimatedTime}
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <Switch
                          checked={z.isActive}
                          onCheckedChange={() => toggleZoneStatus(z.id)}
                        />
                        <span className="text-[11px] text-muted-foreground">
                          {z.isActive ? "نشط" : "معطل"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pl-2 text-left">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditZone(z)}
                          title="تعديل"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteZone(z.id)}
                          title="حذف"
                        >
                          <Trash2 className="size-3.5 text-primary" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredZones.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                لا توجد مناطق توصيل مسجلة تطابق البحث
              </div>
            )}
          </div>
        </div>
      )}

      {/* BRANCHES TAB */}
      {activeTab === "branches" && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ابحث عن فرع أو مدينة..."
              value={searchBranch}
              onChange={(e) => setSearchBranch(e.target.value)}
              className="pr-9"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBranches.map((loc) => (
              <div
                key={loc.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-brand text-base">{loc.name}</h3>
                    <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {loc.city}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-primary mt-0.5" />
                    {loc.address}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                    <div className="flex items-center gap-2">
                      <User className="size-3.5 text-primary" />
                      <span>مدير الفرع: {loc.manager}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-primary" />
                      <span dir="ltr">{loc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-primary" />
                      <span>{loc.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="size-3.5 text-primary" />
                      <span>نطاق التغطية: {loc.radiusKm} كم | الأساسي: {loc.deliveryFee} ج.م</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={loc.isActive}
                      onCheckedChange={() => toggleBranchStatus(loc.id)}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {loc.isActive ? "يعمل الآن" : "مغلق مؤقتاً"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditBranch(loc)} title="تعديل">
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteBranch(loc.id)} title="حذف">
                      <Trash2 className="size-3.5 text-primary" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ZONE MODAL (City, district, cost, qty, unit) */}
      <Dialog open={isZoneModalOpen} onOpenChange={setIsZoneModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingZone ? "تعديل منطقة التوصيل" : "إضافة منطقة توصيل جديدة (Delivery Zone)"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">المدينة (City)</label>
              <Input
                placeholder="مثال: الخصوص، القاهرة، القليوبية، الجيزة"
                value={zoneCity}
                onChange={(e) => setZoneCity(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الحي / المنطقة (District)</label>
              <Input
                placeholder="مثال: ميدان المحطة، شارع النعام، روكسي"
                value={zoneDistrict}
                onChange={(e) => setZoneDistrict(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">تكلفة التوصيل (Cost)</label>
                <Input
                  type="number"
                  placeholder="20"
                  value={zoneCost}
                  onChange={(e) => setZoneCost(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand">الكمية (Qty)</label>
                <Input
                  type="number"
                  placeholder="1"
                  value={zoneQty}
                  onChange={(e) => setZoneQty(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand">الوحدة (Unit)</label>
                <select
                  value={zoneUnit}
                  onChange={(e) =>
                    setZoneUnit(e.target.value as "طلب" | "كجم" | "قطعة" | "وجبة" | "بوكس")
                  }
                  className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="طلب">طلب (Order)</option>
                  <option value="كجم">كجم (Kg)</option>
                  <option value="قطعة">قطعة (Piece)</option>
                  <option value="وجبة">وجبة (Meal)</option>
                  <option value="بوكس">بوكس (Box)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الوقت المتوقع للتوصيل</label>
              <Input
                placeholder="مثال: 30-40 دقيقة"
                value={zoneTime}
                onChange={(e) => setZoneTime(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsZoneModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSaveZone}>
              {editingZone ? "حفظ التعديلات" : "إضافة المنطقة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BRANCH MODAL */}
      <Dialog open={isBranchModalOpen} onOpenChange={setIsBranchModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBranch ? "تعديل بيانات الفرع" : "إضافة فرع جديد"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[70vh] overflow-y-auto px-1">
            <div>
              <label className="text-xs font-bold text-brand">اسم الفرع</label>
              <Input
                placeholder="مثال: فرع مدينة نصر"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">المدينة / المحافظة</label>
              <Input
                placeholder="القاهرة، القليوبية، الجيزة..."
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">العنوان التفصيلي</label>
              <Input
                placeholder="اسم الشارع، أقرب علامة مميزة..."
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">اسم مدير الفرع</label>
                <Input
                  placeholder="محمد أحمد"
                  value={formManager}
                  onChange={(e) => setFormManager(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">هاتف الفرع</label>
                <Input
                  dir="ltr"
                  placeholder="+20 122..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">النطاق (كم)</label>
                <Input
                  type="number"
                  value={formRadius}
                  onChange={(e) => setFormRadius(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">أقل طلب (ج.م)</label>
                <Input
                  type="number"
                  value={formMinOrder}
                  onChange={(e) => setFormMinOrder(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">رسوم التوصيل</label>
                <Input
                  type="number"
                  value={formDeliveryFee}
                  onChange={(e) => setFormDeliveryFee(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand">ساعات العمل</label>
              <Input
                placeholder="10:00 ص - 02:00 ص"
                value={formHours}
                onChange={(e) => setFormHours(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsBranchModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSaveBranch}>
              {editingBranch ? "حفظ التعديلات" : "إضافة الفرع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
