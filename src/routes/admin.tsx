import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bike,
  BookOpen,
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
  Scale,
  Settings,
  TicketPercent,
} from "lucide-react";

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
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="mb-4 border-b border-border pb-3">
            <h2 className="text-base font-extrabold text-brand">لوحة تحكم وزير الحلو</h2>
            <p className="text-xs text-muted-foreground">إدارة المنتجات، الطلبات، والعمليات</p>
          </div>

          <div className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {group.title}
                </p>
                <nav className="flex flex-col gap-0.5">
                  {group.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      activeOptions={{ exact: l.exact }}
                      activeProps={{ className: "bg-primary/10 text-primary font-bold shadow-xs" }}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-brand transition-all hover:bg-muted"
                    >
                      <l.icon className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                      <span>{l.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Outlet */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
