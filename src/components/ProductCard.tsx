import { Heart, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import type { Product } from "@/data/menu";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const isFav = has(product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]">
      {/* Clickable image + badge + wishlist */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to="/products/$id" params={{ id: product.id }} aria-label={product.name} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={816}
            height={816}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-3 start-3 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow pointer-events-none">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label={isFav ? "إزالة من الأمنيات" : "أضف للأمنيات"}
          onClick={() => {
            toggle(product);
            toast.success(
              isFav
                ? `تمت إزالة ${product.name} من الأمنيات`
                : `تمت إضافة ${product.name} إلى الأمنيات ❤️`,
            );
          }}
          className="absolute top-3 end-3 grid size-9 place-items-center rounded-full bg-background/90 text-muted-foreground shadow transition-colors hover:text-primary"
        >
          <Heart className={`size-4 transition-all ${isFav ? "fill-primary text-primary scale-110" : ""}`} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          className="hover:text-primary transition-colors"
        >
          <h3 className="text-base font-bold text-brand md:text-lg">{product.name}</h3>
        </Link>
        <p className="hidden text-xs leading-6 text-muted-foreground sm:block line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="font-bold text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-primary">{product.price} ج.م</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {product.oldPrice} ج.م
              </span>
            )}
          </div>
          <Button
            size="icon"
            className="rounded-full"
            aria-label="أضف للسلة"
            onClick={() => {
              add(product);
              toast.success(`تمت إضافة ${product.name} إلى السلة`);
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </article>
  );
}
