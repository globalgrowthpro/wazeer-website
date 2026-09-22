import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BarChart3, ClipboardList, LayoutDashboard, Package, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "الطلبات", icon: ClipboardList, exact: false },
  { to: "/admin/products", label: "المنتجات", icon: Package, exact: false },
  { to: "/admin/staff", label: "الفريق والمندوبين", icon: Users, exact: false },
  { to: "/admin/reports", label: "التقارير", icon: BarChart3, exact: false },
] as const;

function AdminLayout() {
  return (
    <div className="bg-muted/50">
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          <p className="px-3 py-2 text-xs font-bold text-muted-foreground">لوحة الإدارة</p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.exact }}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-muted"
              >
                <l.icon className="size-4" />
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
