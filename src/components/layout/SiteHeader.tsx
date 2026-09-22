import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, Menu, Phone, Search, ShoppingCart, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/menu", label: "القائمة" },
  { to: "/about", label: "من نحن" },
  { to: "/pos", label: "نقاط البيع" },
  { to: "/gallery", label: "معرض الصور" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-brand text-brand-foreground md:block">
        <div className="container-page flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href="mailto:info@wazeerelhelw.com" className="flex items-center gap-1.5 hover:text-gold">
              <Mail className="size-3.5" /> info@wazeerelhelw.com
            </a>
            <a href="tel:+201222281651" className="flex items-center gap-1.5 hover:text-gold">
              <Phone className="size-3.5" /> +20 122 228 1651
            </a>
            <span className="flex items-center gap-3">
              <Facebook className="size-3.5" />
              <Instagram className="size-3.5" />
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="hover:text-gold">
              السلة ({count})
            </Link>
            <span className="opacity-50">|</span>
            <span className="hover:text-gold">تسجيل الدخول / حساب جديد</span>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-6">
                <Logo className="mb-8" />
                <nav className="flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="rounded-lg px-3 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
                      activeProps={{ className: "bg-muted text-primary" }}
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
                <Button asChild variant="hero" size="lg" className="mt-6 w-full">
                  <Link to="/menu">اطلب الآن</Link>
                </Button>
              </SheetContent>
            </Sheet>
            <Logo />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm font-bold text-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="بحث"
              onClick={() => setSearchOpen((o) => !o)}
            >
              <Search />
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="السلة">
              <Link to="/cart" className="relative">
                <ShoppingCart />
                {count > 0 && (
                  <span className="absolute -top-0.5 end-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="حسابي">
              <User />
            </Button>
            <Button asChild variant="hero" className="hidden sm:inline-flex" size="default">
              <Link to="/menu">اطلب الآن</Link>
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border bg-background">
            <div className="container-page py-3">
              <Input placeholder="ابحث عن قشطوطة، كيك، آيس كريم..." className="h-11" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
