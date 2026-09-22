import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { roleHome, useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | وزير الحلو" },
      { name: "description", content: "سجّل الدخول أو أنشئ حسابًا لمتابعة طلباتك من وزير الحلو." },
      { property: "og:title", content: "تسجيل الدخول | وزير الحلو" },
      { property: "og:description", content: "حساب العملاء ولوحة الإدارة ولوحة مندوب التوصيل." },
    ],
  }),
  component: AuthPage,
});

const demos: { role: Role; title: string; text: string; icon: typeof User }[] = [
  { role: "customer", title: "دخول كعميل", text: "الطلبات والمفضلة والعناوين", icon: User },
  { role: "admin", title: "دخول كمدير", text: "الطلبات والمنتجات والتقارير", icon: ShieldCheck },
  { role: "driver", title: "دخول كمندوب", text: "طلبات التوصيل المسندة إليك", icon: Truck },
];

function AuthPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const enter = (role: Role, name?: string) => {
    signIn({
      name: name?.trim() || (role === "admin" ? "هشام وزير" : role === "driver" ? "محمود سيد" : "أحمد محمد"),
      phone: phone || "+20 100 123 4567",
      email: "customer@wazeerelhelw.com",
      role,
    });
    toast.success("تم تسجيل الدخول");
    navigate({ to: roleHome[role] });
  };

  return (
    <>
      <PageHero title="حسابك في وزير الحلو" subtitle="سجّل الدخول لمتابعة طلباتك أو لإدارة المتجر" />

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
            <Tabs defaultValue="login">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">حساب جديد</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    dir="ltr"
                    placeholder="+20 1XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass">كلمة المرور</Label>
                  <Input id="pass" type="password" placeholder="••••••••" />
                </div>
                <Button variant="hero" size="lg" className="w-full" onClick={() => enter("customer")}>
                  دخول
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  نسيت كلمة المرور؟ سنرسل لك رمز تحقق على رقمك.
                </p>
              </TabsContent>

              <TabsContent value="register" className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم بالكامل</Label>
                    <Input id="name" placeholder="اكتب اسمك" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rphone">رقم الهاتف</Label>
                    <Input id="rphone" dir="ltr" placeholder="+20 1XX XXX XXXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                  <Input id="email" dir="ltr" type="email" placeholder="name@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpass">كلمة المرور</Label>
                  <Input id="rpass" type="password" placeholder="••••••••" />
                </div>
                <Button variant="hero" size="lg" className="w-full" onClick={() => enter("customer")}>
                  إنشاء الحساب
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-3">
            <h2 className="text-lg font-bold text-brand">دخول تجريبي</h2>
            <p className="text-sm text-muted-foreground">
              اختر نوع الحساب لتجربة كل لوحة (بيانات تجريبية).
            </p>
            {demos.map((d) => (
              <button
                key={d.role}
                onClick={() => enter(d.role)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-start shadow-[var(--shadow-card)] transition-colors hover:border-primary"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <d.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-bold text-brand">{d.title}</span>
                  <span className="block text-xs text-muted-foreground">{d.text}</span>
                </span>
              </button>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
