import { Link } from "@tanstack/react-router";
import { Home, Images, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart";

const items = [
  { to: "/", label: "الرئيسية", icon: Home, exact: true },
  { to: "/menu", label: "المنتجات", icon: LayoutGrid, exact: false },
  { to: "/cart", label: "السلة", icon: ShoppingCart, exact: false },
  { to: "/gallery", label: "المعرض", icon: Images, exact: false },
  { to: "/account", label: "حسابي", icon: User, exact: false },
] as const;

export function BottomNav() {
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-[0_-6px_20px_-12px_rgba(15,23,42,0.4)] lg:hidden">
      <ul className="flex items-stretch justify-between px-1">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "text-primary" }}
              className="relative flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold text-muted-foreground transition-colors"
            >
              <span className="relative">
                <Icon className="size-5" />
                {to === "/cart" && count > 0 && (
                  <span className="absolute -top-1.5 -end-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
