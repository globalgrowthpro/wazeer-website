import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Package,
  Pencil,
  Plus,
  RulerIcon,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
  X,
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
  categories,
  categoryName,
  products as seedProducts,
  type CategoryId,
  type NutritionFacts,
  type Product,
  type ProductIngredient,
  type SizePricing,
} from "@/data/menu";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "إدارة المنتجات | وزير الحلو" },
      { name: "description", content: "إضافة وتعديل منتجات وزير الحلو وأسعارها ومكوناتها والحد الأدنى للطلب." },
    ],
  }),
  component: AdminProducts,
});

const quickSuggestions = ["حليب طازج", "كريمة", "سكر", "فانيليا", "مكسرات", "عسل", "بيض", "زبدة"];

const DEFAULT_SIZE_OPTIONS: SizePricing[] = [
  { suffix: "S",  label: "صغير",  priceOffset: -20 },
  { suffix: "M",  label: "وسط",   priceOffset: 0   },
  { suffix: "L",  label: "كبير",  priceOffset: 30  },
  { suffix: "XL", label: "عائلي", priceOffset: 60  },
];

const EMPTY_NUTRITION: NutritionFacts = {
  calories: "", fat: "", carbs: "", protein: "", sugar: "", fiber: "",
};

// ── Section accordion wrapper ─────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-black text-brand hover:bg-muted/40 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t border-border p-4 space-y-3.5">{children}</div>}
    </div>
  );
}

function AdminProducts() {
  const [list, setList] = useState<Product[]>(seedProducts);
  const [hidden, setHidden] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // ── Form: Core ──────────────────────────────────────────────────────────────
  const [formName, setFormName]           = useState("");
  const [formCategory, setFormCategory]   = useState<CategoryId>("keshtota");
  const [formPrice, setFormPrice]         = useState("");
  const [formOldPrice, setFormOldPrice]   = useState("");
  const [formDesc, setFormDesc]           = useState("");
  const [formLongDesc, setFormLongDesc]   = useState("");
  const [formBadge, setFormBadge]         = useState("");
  const [formPopular, setFormPopular]     = useState(false);

  // ── Form: Serving / Prep ────────────────────────────────────────────────────
  const [formServesCount, setFormServesCount]         = useState("");
  const [formMinOrderQty, setFormMinOrderQty]         = useState("1");
  const [formPreparationInfo, setFormPreparationInfo] = useState("");
  const [formStorageInfo, setFormStorageInfo]         = useState("");
  const [formServingInfo, setFormServingInfo]         = useState("");

  // ── Form: Sizes ─────────────────────────────────────────────────────────────
  const [sizesEnabled, setSizesEnabled]   = useState(false);
  const [formSizes, setFormSizes]         = useState<SizePricing[]>(DEFAULT_SIZE_OPTIONS);

  // ── Form: Ingredients ───────────────────────────────────────────────────────
  const [formIngredients, setFormIngredients] = useState<ProductIngredient[]>([]);
  const [newIngName, setNewIngName]           = useState("");
  const [newIngQty, setNewIngQty]             = useState("");

  // ── Form: Nutrition ─────────────────────────────────────────────────────────
  const [nutritionEnabled, setNutritionEnabled] = useState(false);
  const [formNutrition, setFormNutrition]       = useState<NutritionFacts>(EMPTY_NUTRITION);

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = list.filter((p) => {
    const matchesSearch = p.name.includes(q.trim()) || p.description.includes(q.trim());
    const matchesCategory = selectedCat === "all" || p.category === selectedCat;
    return matchesSearch && matchesCategory;
  });

  // ── Reset + open modal ──────────────────────────────────────────────────────
  const resetForm = () => {
    setFormName(""); setFormCategory("keshtota");
    setFormPrice(""); setFormOldPrice("");
    setFormDesc(""); setFormLongDesc("");
    setFormBadge(""); setFormPopular(false);
    setFormServesCount(""); setFormMinOrderQty("1");
    setFormPreparationInfo(""); setFormStorageInfo(""); setFormServingInfo("");
    setSizesEnabled(false); setFormSizes(DEFAULT_SIZE_OPTIONS);
    setFormIngredients([]); setNewIngName(""); setNewIngQty("");
    setNutritionEnabled(false); setFormNutrition(EMPTY_NUTRITION);
  };

  const openAddModal = () => { resetForm(); setEditingProduct(null); setIsModalOpen(true); };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormOldPrice(p.oldPrice ? p.oldPrice.toString() : "");
    setFormDesc(p.description);
    setFormLongDesc(p.longDescription || "");
    setFormBadge(p.badge || "");
    setFormPopular(p.popular ?? false);
    setFormServesCount(p.servesCount || "");
    setFormMinOrderQty(p.minOrderQty ? p.minOrderQty.toString() : "1");
    setFormPreparationInfo(p.preparationInfo || "");
    setFormStorageInfo(p.storageInfo || "");
    setFormServingInfo(p.servingInfo || "");
    setSizesEnabled(!!p.sizePricing && p.sizePricing.length > 0);
    setFormSizes(p.sizePricing && p.sizePricing.length > 0 ? p.sizePricing : DEFAULT_SIZE_OPTIONS);
    setFormIngredients(p.ingredients ? [...p.ingredients] : []);
    setNewIngName(""); setNewIngQty("");
    setNutritionEnabled(!!p.nutrition);
    setFormNutrition(p.nutrition ? { ...p.nutrition } : EMPTY_NUTRITION);
    setIsModalOpen(true);
  };

  const handleAddIngredient = () => {
    if (!newIngName.trim()) { toast.error("يرجى إدخال اسم المكون"); return; }
    const item: ProductIngredient = { name: newIngName.trim() };
    if (newIngQty.trim()) item.quantity = newIngQty.trim();
    setFormIngredients((prev) => [...prev, item]);
    setNewIngName(""); setNewIngQty("");
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrice.trim()) {
      toast.error("يرجى إدخال اسم المنتج والسعر");
      return;
    }

    const priceNum   = parseFloat(formPrice) || 0;
    const oldPriceNum = formOldPrice ? parseFloat(formOldPrice) : 0;
    const minQtyNum  = parseInt(formMinOrderQty) || 1;

    const applyOptionals = (obj: Product) => {
      if (oldPriceNum > 0) obj.oldPrice = oldPriceNum; else delete obj.oldPrice;
      if (formBadge.trim()) obj.badge = formBadge.trim(); else delete obj.badge;
      obj.popular = formPopular;
      if (formServesCount.trim()) obj.servesCount = formServesCount.trim(); else delete obj.servesCount;
      if (minQtyNum > 1) obj.minOrderQty = minQtyNum; else delete obj.minOrderQty;
      if (formPreparationInfo.trim()) obj.preparationInfo = formPreparationInfo.trim(); else delete obj.preparationInfo;
      if (formStorageInfo.trim()) obj.storageInfo = formStorageInfo.trim(); else delete obj.storageInfo;
      if (formServingInfo.trim()) obj.servingInfo = formServingInfo.trim(); else delete obj.servingInfo;
      if (formLongDesc.trim()) obj.longDescription = formLongDesc.trim(); else delete obj.longDescription;
      if (formIngredients.length > 0) obj.ingredients = formIngredients; else delete obj.ingredients;
      if (sizesEnabled) obj.sizePricing = formSizes; else delete obj.sizePricing;
      if (nutritionEnabled) obj.nutrition = formNutrition; else delete obj.nutrition;
    };

    if (editingProduct) {
      setList((prev) =>
        prev.map((item) => {
          if (item.id !== editingProduct.id) return item;
          const updated: Product = {
            ...item,
            name: formName.trim(),
            category: formCategory,
            price: priceNum,
            description: formDesc.trim(),
          };
          applyOptionals(updated);
          return updated;
        }),
      );
      toast.success("تم تحديث بيانات المنتج بنجاح");
    } else {
      const defaultImage = categories.find((c) => c.id === formCategory)?.image ?? seedProducts[0]?.image ?? "";
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        description: formDesc.trim(),
        rating: 5.0,
        reviews: 0,
        image: defaultImage,
      };
      applyOptionals(newProduct);
      setList((prev) => [newProduct, ...prev]);
      toast.success("تمت إضافة المنتج الجديد بنجاح");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setList((l) => l.filter((i) => i.id !== id));
    toast.success("تم حذف المنتج من القائمة");
  };

  // ── Nutrition field helper ───────────────────────────────────────────────────
  const NutritionInput = ({ field, label }: { field: keyof NutritionFacts; label: string }) => (
    <div>
      <label className="mb-1 block text-xs font-bold text-brand">{label}</label>
      <Input
        placeholder="مثال: 285"
        value={formNutrition[field]}
        onChange={(e) => setFormNutrition((prev) => ({ ...prev, [field]: e.target.value }))}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand">إدارة المنتجات والأصناف</h1>
          <p className="text-xs text-muted-foreground">
            {list.length} صنف متوفر في قائمة طعام وزير الحلو
          </p>
        </div>
        <Button variant="hero" onClick={openAddModal}>
          <Plus className="size-4" /> إضافة صنف جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الوصف..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Filter className="size-3.5 text-muted-foreground" />
          <button
            onClick={() => setSelectedCat("all")}
            className={`rounded-lg px-2.5 py-1.5 font-bold transition-colors ${selectedCat === "all" ? "bg-brand text-brand-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
          >
            الكل ({list.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`rounded-lg px-2.5 py-1.5 font-bold transition-colors whitespace-nowrap ${selectedCat === c.id ? "bg-brand text-brand-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] transition-all hover:border-primary/30"
          >
            <img src={p.image} alt={p.name} loading="lazy" className="size-16 rounded-xl object-cover" />
            <div className="min-w-44 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-brand">{p.name}</p>
                {p.badge && (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                    {p.badge}
                  </span>
                )}
                {p.popular && (
                  <span className="rounded-md bg-gold/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                    ⭐ الأكثر طلباً
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {categoryName(p.category)}
                </span>
                {p.servesCount && (
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    {p.servesCount}
                  </span>
                )}
                {p.sizePricing && p.sizePricing.length > 0 && (
                  <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                    {p.sizePricing.length} أحجام
                  </span>
                )}
                {p.ingredients && p.ingredients.length > 0 && (
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {p.ingredients.length} مكونات
                  </span>
                )}
                {p.nutrition && (
                  <span className="rounded bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                    قيمة غذائية
                  </span>
                )}
              </div>
            </div>

            <div className="text-left">
              <div className="font-extrabold text-primary">{p.price} ج.م</div>
              {p.oldPrice && (
                <div className="text-xs text-muted-foreground line-through">{p.oldPrice} ج.م</div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch
                checked={!hidden.includes(p.id)}
                onCheckedChange={(on) =>
                  setHidden((h) => (on ? h.filter((i) => i !== p.id) : [...h, p.id]))
                }
              />
              <span className="w-10">{hidden.includes(p.id) ? "مخفي" : "نشط"}</span>
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEditModal(p)} title="تعديل">
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} title="حذف">
                <Trash2 className="size-4 text-primary" />
              </Button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            لا توجد أصناف مطابقة لمعايير البحث
          </div>
        )}
      </div>

      {/* ── Add / Edit Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-brand">
              {editingProduct ? "✏️ تعديل بيانات الصنف" : "➕ إضافة صنف جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* ── 1. Basic Info ─────────────────────────────────────────────── */}
            <Section title="📋 المعلومات الأساسية">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand">اسم الصنف *</label>
                  <Input placeholder="مثال: قشطوطة لوتس ملوكي" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand">القسم *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand">السعر الأساسي (ج.م) *</label>
                  <Input type="number" placeholder="99" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand">السعر القديم (اختياري)</label>
                  <Input type="number" placeholder="129" value={formOldPrice} onChange={(e) => setFormOldPrice(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-brand">الوصف المختصر *</label>
                <Input placeholder="جملة قصيرة تظهر في البطاقة" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-brand">الوصف التفصيلي (يظهر في صفحة المنتج)</label>
                <textarea
                  rows={4}
                  placeholder="اكتب وصفاً كاملاً عن المنتج — مكوناته، مميزاته، تجربة الأكل..."
                  value={formLongDesc}
                  onChange={(e) => setFormLongDesc(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand">شارة المنتج (Badge)</label>
                  <Input placeholder="الأكثر مبيعاً / خصم خاص" value={formBadge} onChange={(e) => setFormBadge(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Switch checked={formPopular} onCheckedChange={setFormPopular} />
                  <span className="text-sm font-bold text-brand">منتج الأكثر طلباً؟</span>
                </div>
              </div>
            </Section>

            {/* ── 2. Serving & Prep ─────────────────────────────────────────── */}
            <Section title="⏱️ الحصص والتجهيز" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand">
                    <Users className="size-3.5 text-primary" /> مناسب لعدد
                  </label>
                  <Input placeholder="4-6 أشخاص" value={formServesCount} onChange={(e) => setFormServesCount(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand">
                    <Package className="size-3.5 text-primary" /> أقل كمية للطلب
                  </label>
                  <Input type="number" min="1" placeholder="1" value={formMinOrderQty} onChange={(e) => setFormMinOrderQty(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand">
                    <Clock className="size-3.5 text-primary" /> وقت التجهيز
                  </label>
                  <Input placeholder="جاهز خلال 24 ساعة" value={formPreparationInfo} onChange={(e) => setFormPreparationInfo(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand">
                    <SlidersHorizontal className="size-3.5 text-primary" /> معلومات التخزين
                  </label>
                  <Input placeholder="يُحفظ بالثلاجة 3 أيام" value={formStorageInfo} onChange={(e) => setFormStorageInfo(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-brand">طريقة التقديم والاستخدام</label>
                <Input placeholder="يُقدَّم بارداً مع مكسرات ..." value={formServingInfo} onChange={(e) => setFormServingInfo(e.target.value)} />
              </div>
            </Section>

            {/* ── 3. Size Pricing ───────────────────────────────────────────── */}
            <Section title="📐 أحجام وأسعار متعددة" defaultOpen={false}>
              <div className="flex items-center gap-3">
                <Switch checked={sizesEnabled} onCheckedChange={setSizesEnabled} />
                <span className="text-sm font-bold text-brand">
                  {sizesEnabled ? "تفعيل أحجام متعددة (السعر يتغير حسب الحجم)" : "حجم واحد فقط (السعر الأساسي)"}
                </span>
              </div>

              {sizesEnabled && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    السعر النهائي = السعر الأساسي ({formPrice || "0"} ج.م) + فرق الحجم
                  </p>
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2.5 text-start font-bold">الحجم</th>
                          <th className="px-4 py-2.5 text-start font-bold">الرمز</th>
                          <th className="px-4 py-2.5 text-start font-bold">فرق السعر (ج.م)</th>
                          <th className="px-4 py-2.5 text-start font-bold text-primary">السعر النهائي</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formSizes.map((s, i) => (
                          <tr key={s.suffix} className="border-t border-border">
                            <td className="px-4 py-2">
                              <Input
                                value={s.label}
                                onChange={(e) =>
                                  setFormSizes((prev) =>
                                    prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x)
                                  )
                                }
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                value={s.suffix}
                                onChange={(e) =>
                                  setFormSizes((prev) =>
                                    prev.map((x, j) => j === i ? { ...x, suffix: e.target.value } : x)
                                  )
                                }
                                className="h-8 w-16 text-xs"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                type="number"
                                value={s.priceOffset}
                                onChange={(e) =>
                                  setFormSizes((prev) =>
                                    prev.map((x, j) => j === i ? { ...x, priceOffset: parseFloat(e.target.value) || 0 } : x)
                                  )
                                }
                                className="h-8 w-24 text-xs"
                              />
                            </td>
                            <td className="px-4 py-2 font-bold text-primary">
                              {(parseFloat(formPrice) || 0) + s.priceOffset} ج.م
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormSizes((prev) => [
                        ...prev,
                        { suffix: `S${prev.length + 1}`, label: "حجم جديد", priceOffset: 0 },
                      ])
                    }
                  >
                    <Plus className="size-3.5" /> إضافة حجم
                  </Button>
                </div>
              )}
            </Section>

            {/* ── 4. Ingredients ────────────────────────────────────────────── */}
            <Section title="🧪 مكونات المنتج" defaultOpen={false}>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Add form */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">أضف كل مكون على حدة مع الكمية</p>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="اسم المكون"
                      value={newIngName}
                      onChange={(e) => setNewIngName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                      className="flex-1"
                    />
                    <Input
                      placeholder="الكمية"
                      value={newIngQty}
                      onChange={(e) => setNewIngQty(e.target.value)}
                      className="w-24"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddIngredient} className="shrink-0">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                    <span className="mb-2 block text-[11px] font-bold text-brand">اقتراحات سريعة:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickSuggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => { setNewIngName(sug); setNewIngQty(""); }}
                          className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-brand">المكونات ({formIngredients.length})</h4>
                    {formIngredients.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormIngredients([])}
                        className="text-[11px] text-primary hover:underline"
                      >
                        مسح الكل
                      </button>
                    )}
                  </div>
                  <div className="min-h-[120px] rounded-2xl border-2 border-dashed border-border bg-muted/10 p-3">
                    {formIngredients.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/50">
                        <Package className="size-10 stroke-[1]" />
                        <p className="mt-2 text-xs">لا توجد مكونات بعد</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {formIngredients.map((ing, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-card p-2.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-primary" />
                              <span className="font-bold text-brand">{ing.name}</span>
                              {ing.quantity && (
                                <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">{ing.quantity}</span>
                              )}
                            </div>
                            <Button
                              type="button" variant="ghost" size="icon"
                              className="size-6 text-muted-foreground hover:text-primary"
                              onClick={() => setFormIngredients((prev) => prev.filter((_, i) => i !== idx))}
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Section>

            {/* ── 5. Nutrition Facts ────────────────────────────────────────── */}
            <Section title="🥗 القيمة الغذائية (لكل 100 جم)" defaultOpen={false}>
              <div className="flex items-center gap-3">
                <Switch checked={nutritionEnabled} onCheckedChange={setNutritionEnabled} />
                <span className="text-sm font-bold text-brand">
                  {nutritionEnabled ? "تفعيل جدول القيمة الغذائية" : "إخفاء جدول القيمة الغذائية"}
                </span>
              </div>

              {nutritionEnabled && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <NutritionInput field="calories" label="السعرات الحرارية" />
                  <NutritionInput field="fat"      label="الدهون (جم)" />
                  <NutritionInput field="carbs"    label="الكربوهيدرات (جم)" />
                  <NutritionInput field="protein"  label="البروتين (جم)" />
                  <NutritionInput field="sugar"    label="السكر (جم)" />
                  <NutritionInput field="fiber"    label="الألياف (جم)" />
                </div>
              )}
            </Section>

          </div>

          <DialogFooter className="gap-2 border-t border-border pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button variant="hero" onClick={handleSave}>
              {editingProduct ? "💾 حفظ التعديلات" : "✅ إضافة الصنف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
