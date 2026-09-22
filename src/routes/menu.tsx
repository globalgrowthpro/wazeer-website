import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, products } from "@/data/menu";

type MenuSearch = { cat?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>): MenuSearch => ({
    cat: typeof search["cat"] === "string" ? (search["cat"] as string) : undefined,
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "قائمة المنتجات | وزير الحلو" },
      {
        name: "description",
        content: "تصفح قائمة وزير الحلو: قشطوطة، آيس كريم، كيك، حلويات شرقية، أطباق رئيسية ومشروبات.",
      },
      { property: "og:title", content: "قائمة المنتجات | وزير الحلو" },
      { property: "og:description", content: "كل أصناف وزير الحلو مع الأسعار والعروض." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { cat, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/menu" });
  const [sort, setSort] = useState("popular");

  const list = useMemo(() => {
    let items = products.filter((p) => (cat ? p.category === cat : true));
    if (q) items = items.filter((p) => p.name.includes(q) || p.description.includes(q));
    if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "rating") items = [...items].sort((a, b) => b.rating - a.rating);
    if (sort === "offers") items = items.filter((p) => p.oldPrice);
    return items;
  }, [cat, q, sort]);

  const setCat = (value: string | undefined) =>
    navigate({ search: (prev): MenuSearch => ({ q: prev.q, cat: value }) });

  return (
    <>
      <PageHero title="قائمة المنتجات" subtitle="اختر صنفك المفضل وأضفه للسلة في ثوانٍ" />

      <section className="section-y">
        <div className="container-page">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q ?? ""}
                onChange={(e) =>
                  navigate({
                    search: (prev): MenuSearch => ({ cat: prev.cat, q: e.target.value || undefined }),
                  })
                }
                placeholder="ابحث عن قشطوطة، كيك، آيس كريم..."
                className="h-11 ps-9"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-11 md:w-52">
                <SelectValue placeholder="ترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">الأكثر طلبًا</SelectItem>
                <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
                <SelectItem value="rating">الأعلى تقييمًا</SelectItem>
                <SelectItem value="offers">العروض فقط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="no-scrollbar -mx-4 mb-7 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            <button
              onClick={() => setCat(undefined)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                !cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              الكل
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  cat === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-lg font-bold text-brand">لم نجد ما تبحث عنه؟</p>
              <p className="mt-2 text-sm text-muted-foreground">جرّب فئة أخرى أو ابحث بكلمة مختلفة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
