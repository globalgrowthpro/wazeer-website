import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orders, orderTotal, statusLabel } from "@/data/orders";
import { mostOrdered } from "@/data/menu";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي | وزير الحلو" },
      { name: "description", content: "بياناتك وطلباتك السابقة والمفضلة والعناوين المحفوظة في وزير الحلو." },
      { property: "og:title", content: "حسابي | وزير الحلو" },
      { property: "og:description", content: "إدارة بياناتك وطلباتك ومفضلاتك." },
    ],
  }),
  component: AccountPage,
});

const addresses = [
  { title: "المنزل", text: "١٢ شارع الجمهورية، الخصوص، القليوبية" },
  { title: "العمل", text: "٣٠ شارع شبرا، القاهرة" },
];

function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <PageHero title="حسابي" subtitle={user ? `أهلاً ${user.name}` : "سجّل الدخول لمتابعة طلباتك"} />

      <section className="section-y">
        <div className="container-page">
          {!user ? (
            <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
              <p className="text-sm text-muted-foreground">
                سجّل الدخول للوصول إلى طلباتك وعناوينك ومفضلاتك.
              </p>
              <Button asChild variant="hero" className="mt-5">
                <Link to="/auth">تسجيل الدخول</Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="orders">
              <TabsList className="flex w-full flex-wrap">
                <TabsTrigger value="orders">طلباتي</TabsTrigger>
                <TabsTrigger value="profile">بياناتي</TabsTrigger>
                <TabsTrigger value="favorites">المفضلة</TabsTrigger>
                <TabsTrigger value="addresses">العناوين</TabsTrigger>
                <TabsTrigger value="settings">الإعدادات</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6 space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                  >
                    <div>
                      <p className="font-bold text-brand" dir="ltr">{o.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.createdAt} • {o.lines.length} أصناف • {statusLabel[o.status]}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-primary">{orderTotal(o)} ج.م</span>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/orders/$id" params={{ id: o.id }}>
                          تتبع
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <div className="grid max-w-2xl gap-4 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="an">الاسم</Label>
                    <Input id="an" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ap">رقم الهاتف</Label>
                    <Input id="ap" dir="ltr" defaultValue={user.phone} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ae">البريد الإلكتروني</Label>
                    <Input id="ae" dir="ltr" defaultValue={user.email} />
                  </div>
                  <Button variant="hero" className="sm:col-span-2">حفظ التعديلات</Button>
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {mostOrdered.slice(0, 4).map((p) => (
                    <div key={p.id} className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={816}
                        height={816}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <p className="mt-2 flex items-center gap-1 font-bold text-brand">
                        <Heart className="size-4 fill-primary text-primary" /> {p.name}
                      </p>
                      <p className="text-sm font-extrabold text-primary">{p.price} ج.م</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="mt-6 space-y-3">
                {addresses.map((a) => (
                  <div
                    key={a.title}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                  >
                    <MapPin className="mt-0.5 size-5 text-primary" />
                    <div>
                      <p className="font-bold text-brand">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.text}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline">إضافة عنوان جديد</Button>
              </TabsContent>

              <TabsContent value="settings" className="mt-6 max-w-xl space-y-4">
                {["إشعارات حالة الطلب", "عروض وخصومات عبر الرسائل", "النشرة البريدية"].map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
                  >
                    <span className="text-sm font-semibold text-brand">{s}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut();
                    navigate({ to: "/auth" });
                  }}
                >
                  <LogOut className="size-4" /> تسجيل الخروج
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </>
  );
}
