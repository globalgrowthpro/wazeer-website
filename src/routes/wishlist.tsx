import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { products } from "@/data/menu";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "قائمة الأمنيات | وزير الحلو" },
      { name: "description", content: "المنتجات التي أضفتها لقائمة مفضلاتك في وزير الحلو." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { add } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <span className="grid size-24 place-items-center rounded-full bg-muted">
          <Heart className="size-12 text-muted-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-brand">قائمة الأمنيات فارغة</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            لم تضف أي منتج بعد. تصفح القائمة واضغط على ❤️ لحفظ ما يعجبك.
          </p>
        </div>
        <Button asChild variant="hero" size="pill">
          <Link to="/menu">تصفح القائمة</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page section-y space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-brand">
            <Heart className="size-6 fill-primary text-primary" />
            قائمة الأمنيات
          </h1>
          <p className="text-xs text-muted-foreground">{items.length} منتج محفوظ</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { clear(); toast.success("تم مسح قائمة الأمنيات"); }}>
          <Trash2 className="size-3.5" />
          مسح الكل
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {items.map((item) => {
          // Find the full product object from menu data for cart compatibility
          const product = products.find((p) => p.id === item.id);

          return (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.badge && (
                  <span className="absolute start-3 top-3 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow">
                    {item.badge}
                  </span>
                )}
                <button
                  type="button"
                  aria-label="إزالة من المفضلة"
                  onClick={() => { remove(item.id); toast.success(`تمت إزالة ${item.name} من الأمنيات`); }}
                  className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-primary shadow transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Heart className="size-4 fill-primary" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
                <h3 className="text-base font-bold text-brand md:text-lg">{item.name}</h3>
                <p className="hidden text-xs leading-6 text-muted-foreground sm:block line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-primary">{item.price} ج.م</span>
                    {item.oldPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {item.oldPrice} ج.م
                      </span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    className="rounded-full"
                    aria-label="أضف للسلة"
                    disabled={!product}
                    onClick={() => {
                      if (product) {
                        add(product);
                        toast.success(`تمت إضافة ${item.name} إلى السلة`);
                      }
                    }}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-4">
        <Button asChild variant="hero" size="pill">
          <Link to="/cart">
            <ShoppingCart className="size-4" />
            الذهاب إلى السلة
          </Link>
        </Button>
        <Button asChild variant="outline" size="pill">
          <Link to="/menu">مواصلة التسوق</Link>
        </Button>
      </div>
    </div>
  );
}
