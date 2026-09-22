import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سلة الطلب | وزير الحلو" },
      { name: "description", content: "راجع أصناف سلتك وأكمل طلبك من وزير الحلو بسهولة." },
      { property: "og:title", content: "سلة الطلب | وزير الحلو" },
      { property: "og:description", content: "راجع سلتك وأكمل الطلب." },
    ],
  }),
  component: CartPage,
});

const DELIVERY = 25;

function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const delivery = items.length ? DELIVERY : 0;

  return (
    <>
      <PageHero title="سلة الطلب" subtitle="راجع طلبك قبل إتمام الشراء" />

      <section className="section-y">
        <div className="container-page">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border py-20 text-center">
              <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-bold text-brand">سلتك فارغة</p>
              <p className="mt-1 text-sm text-muted-foreground">أضف أصنافك المفضلة وابدأ الطلب</p>
              <Button asChild variant="hero" size="lg" className="mt-6">
                <Link to="/menu">تصفح القائمة</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      width={816}
                      height={816}
                      className="size-24 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-brand">{item.name}</h3>
                        <button
                          aria-label="حذف"
                          onClick={() => remove(item.id)}
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-border p-1">
                          <button
                            aria-label="زيادة"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="grid size-7 place-items-center rounded-full bg-muted"
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                          <button
                            aria-label="إنقاص"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="grid size-7 place-items-center rounded-full bg-muted"
                          >
                            <Minus className="size-3.5" />
                          </button>
                        </div>
                        <span className="font-extrabold text-primary">
                          {item.price * item.qty} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={clear}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary"
                >
                  إفراغ السلة
                </button>
              </div>

              <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h2 className="text-lg font-bold text-brand">ملخص الطلب</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">الإجمالي الفرعي</dt>
                    <dd className="font-bold">{subtotal} ج.م</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">التوصيل</dt>
                    <dd className="font-bold">{delivery} ج.م</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base">
                    <dt className="font-bold text-brand">الإجمالي</dt>
                    <dd className="font-extrabold text-primary">{subtotal + delivery} ج.م</dd>
                  </div>
                </dl>
                <Button
                  variant="hero"
                  size="lg"
                  className="mt-5 w-full"
                  onClick={() => toast.success("سيتم تفعيل إتمام الطلب قريبًا")}
                >
                  إتمام الطلب
                </Button>
                <Button asChild variant="outline" size="lg" className="mt-2 w-full">
                  <Link to="/menu">متابعة التسوق</Link>
                </Button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
