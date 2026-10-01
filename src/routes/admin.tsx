import { useState } from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bell,
  Bike,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Globe,
  Headphones,
  Images,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  Package,
  Percent,
  Search,
  Scale,
  Settings,
  TicketPercent,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import emblemLight from "@/assets/wazeer-emblem-light.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navGroups = [
  {
    title: "الرئيسية والطلبات",
    links: [
      { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
      { to: "/admin/orders", label: "الطلبات", icon: ClipboardList, exact: false },
      { to: "/admin/reports", label: "التقارير المالية", icon: BarChart3, exact: false },
    ],
  },
  {
    title: "الكتالوج والمتجر",
    links: [
      { to: "/admin/products", label: "المنتجات", icon: Package, exact: false },
      { to: "/admin/categories", label: "الأقسام", icon: Layers, exact: false },
      { to: "/admin/brands", label: "العلامات التجارية", icon: Award, exact: false },
      { to: "/admin/sliders", label: "السلايدر والبانرات", icon: Images, exact: false },
    ],
  },
  {
    title: "التسويق والمبيعات",
    links: [
      { to: "/admin/offers", label: "العروض والخصومات", icon: Percent, exact: false },
      { to: "/admin/coupons", label: "كوبونات الخصم", icon: TicketPercent, exact: false },
    ],
  },
  {
    title: "العمليات والتشغيل",
    links: [
      { to: "/admin/locations", label: "الفروع والمناطق", icon: MapPin, exact: false },
      { to: "/admin/delivery", label: "مناديب التوصيل", icon: Bike, exact: false },
      { to: "/admin/support", label: "الدعم الفني", icon: Headphones, exact: false },
    ],
  },
  {
    title: "المحتوى والصفحات",
    links: [
      { to: "/admin/blogs", label: "المدونة والوصفات", icon: BookOpen, exact: false },
      { to: "/admin/legal", label: "الصفحات القانونية", icon: Scale, exact: false },
    ],
  },
  {
    title: "النظام والأمان",
    links: [
      { to: "/admin/seo", label: "تحسين محركات البحث", icon: Globe, exact: false },
      { to: "/admin/security", label: "الأمان والصلاحيات", icon: Lock, exact: false },
      { to: "/admin/settings", label: "إعدادات المتجر", icon: Settings, exact: false },
    ],
  },
] as const;

function AdminLayout() {
  const [navQuery, setNavQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchField = (
    <div className="relative order-3 w-full md:order-none md:mx-4 md:max-w-sm md:flex-1">
      <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={navQuery}
        onChange={(event) => setNavQuery(event.target.value)}
        placeholder="ابحث في الإدارة..."
        aria-label="البحث في أقسام الإدارة"
        className="h-10 w-full rounded-md border border-border bg-muted/60 pr-9 pl-3 text-xs text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background"
      />
    </div>
  );
  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.label.includes(navQuery.trim())),
    }))
    .filter((group) => group.links.length > 0);

  return (
    <div className="min-h-screen bg-surface text-foreground lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[var(--shadow-float)] transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/admin" aria-label="لوحة تحكم وزير الحلو" className="flex min-w-0 items-center gap-3">
            <img src={emblemLight} alt="وزير الحلو" className="h-11 w-auto object-contain" />
            <span className="border-r border-sidebar-border pr-3 text-sm font-bold">نظام الإدارة</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X />
          </Button>
        </div>

        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto p-4 pt-6">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-1.5 px-2.5 text-[11px] font-bold text-sidebar-foreground/50">
                  {group.title}
                </p>
                <nav className="flex flex-col gap-0.5">
                  {group.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      activeOptions={{ exact: l.exact }}
                      activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-md" }}
                      className="group flex items-center gap-2.5 rounded-md px-3 py-2.5 text-xs font-semibold text-sidebar-foreground/75 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <l.icon className="size-4 shrink-0" />
                      <span>{l.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
            {filteredGroups.length === 0 && (
              <p className="rounded-md border border-dashed border-sidebar-border p-4 text-center text-xs text-sidebar-foreground/60">
                لا توجد نتائج
              </p>
            )}
        </div>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/70 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold font-extrabold text-gold-foreground">ح</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">حافظ رحيم</p>
              <p className="truncate text-[11px] text-sidebar-foreground/55">مدير النظام</p>
            </div>
            <ChevronDown className="size-4 text-sidebar-foreground/55" />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-7 md:py-0">
          <div className="flex flex-wrap items-center justify-between gap-3 md:h-16 md:flex-nowrap">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="فتح القائمة">
              <Menu />
            </Button>
            <div>
              <p className="text-sm font-bold text-brand">مساء الخير، حافظ</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">الخميس، 1 أكتوبر 2026</p>
            </div>
          </div>
          {searchField}
          <div className="relative flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="الإشعارات"
              aria-expanded={notificationsOpen}
            >
              <Bell />
              <span className="absolute left-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">كل الفروع</span>
            {notificationsOpen && (
              <div className="absolute left-0 top-12 w-80 rounded-lg border border-border bg-popover p-3 shadow-[var(--shadow-float)]">
                <p className="mb-2 text-sm font-bold text-popover-foreground">الإشعارات</p>
                <div className="space-y-2 text-xs">
                  <p className="rounded-md bg-primary/8 p-3 text-popover-foreground">طلب جديد WZ-10249 ينتظر التأكيد</p>
                  <p className="rounded-md bg-gold/15 p-3 text-popover-foreground">مخزون القشطة يقترب من الحد الأدنى</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto min-w-0 max-w-[1500px] p-4 md:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
