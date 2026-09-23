import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Truck, User, MapPin } from "lucide-react";
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

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCity, setRegCity] = useState("القليوبية");
  const [regDistrict, setRegDistrict] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const enter = (role: Role, name?: string) => {
    signIn({
      name: name?.trim() || (role === "admin" ? "هشام وزير" : role === "driver" ? "محمود سيد" : "أحمد محمد"),
      phone: loginPhone || "+20 100 123 4567",
      email: "customer@wazeerelhelw.com",
      role,
    });
    toast.success("تم تسجيل الدخول بنجاح");
    navigate({ to: roleHome[role] });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      toast.error("يرجى كتابة الاسم بالكامل");
      return;
    }
    if (!regPhone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }
    if (!regPassword) {
      toast.error("يرجى كتابة كلمة المرور");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("كلمة المرور يجب ألا تقل عن 6 أحرف");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast.error("كلمة المرور وتأكيد كلمة المرور غير متطابقتين!");
      return;
    }

    signIn({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || "customer@wazeerelhelw.com",
      city: regCity,
      district: regDistrict.trim() || undefined,
      role: "customer",
    });
    toast.success("تم إنشاء الحساب بنجاح! أهلاً بك في وزير الحلو");
    navigate({ to: "/account" });
  };

  return (
    <>
      <PageHero title="حسابك في وزير الحلو" subtitle="سجّل الدخول لمتابعة طلباتك أو لإدارة المتجر" />

      <section className="section-y" dir="rtl">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_360px]" dir="rtl">
          {/* Main Auth Form Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8 text-right" dir="rtl">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "login" | "register")}
              dir="rtl"
            >
              <TabsList className="w-full flex" dir="rtl">
                <TabsTrigger value="login" className="flex-1 font-bold">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register" className="flex-1 font-bold">حساب جديد</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-6 space-y-4 text-right" dir="rtl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    enter("customer");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2 text-right">
                    <Label htmlFor="phone" className="text-right block font-bold">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      dir="ltr"
                      className="text-left font-mono"
                      placeholder="+20 1XX XXX XXXX"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label htmlFor="pass" className="text-right block font-bold">كلمة المرور</Label>
                    <Input
                      id="pass"
                      type="password"
                      dir="ltr"
                      className="text-left"
                      placeholder="••••••••"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      required
                    />
                  </div>
                  <Button variant="hero" size="lg" type="submit" className="w-full font-bold text-base shadow-md">
                    دخول
                  </Button>
                  <p className="text-center text-xs text-muted-foreground pt-1">
                    نسيت كلمة المرور؟ سنرسل لك رمز تحقق على رقم هاتفك المسجل.
                  </p>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-6 space-y-4 text-right" dir="rtl">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Name and Phone */}
                  <div className="grid gap-4 sm:grid-cols-2" dir="rtl">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="name" className="text-right block font-bold">الاسم بالكامل</Label>
                      <Input
                        id="name"
                        dir="rtl"
                        className="text-right"
                        placeholder="اكتب اسمك الثلاثي"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="rphone" className="text-right block font-bold">رقم الهاتف</Label>
                      <Input
                        id="rphone"
                        dir="ltr"
                        className="text-left font-mono"
                        placeholder="+20 1XX XXX XXXX"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* City and District */}
                  <div className="grid gap-4 sm:grid-cols-2" dir="rtl">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="city" className="text-right block font-bold">المدينة / المحافظة</Label>
                      <select
                        id="city"
                        dir="rtl"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-right font-medium"
                      >
                        <option value="القليوبية">القليوبية (الخصوص، شبين، بنها)</option>
                        <option value="القاهرة">القاهرة (شبرا، المرج، العبور، المعادي)</option>
                        <option value="الجيزة">الجيزة (الدقي، المهندسين، فيصل، الهرم)</option>
                        <option value="الشرقية">الشرقية (العاشر من رمضان، الزقازيق)</option>
                        <option value="الإسكندرية">الإسكندرية</option>
                        <option value="أخرى">محافظة أخرى</option>
                      </select>
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="district" className="text-right block font-bold">المنطقة / الحي</Label>
                      <Input
                        id="district"
                        dir="rtl"
                        className="text-right"
                        placeholder="مثال: الخصوص، شبرا، المرج، العبور..."
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Optional Email */}
                  <div className="space-y-2 text-right">
                    <Label htmlFor="email" className="text-right block font-bold">البريد الإلكتروني (اختياري)</Label>
                    <Input
                      id="email"
                      dir="ltr"
                      type="email"
                      className="text-left"
                      placeholder="name@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  {/* Password and Password Confirmation */}
                  <div className="grid gap-4 sm:grid-cols-2" dir="rtl">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="rpass" className="text-right block font-bold">كلمة المرور</Label>
                      <Input
                        id="rpass"
                        type="password"
                        dir="ltr"
                        className="text-left"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="cpass" className="text-right block font-bold">تأكيد كلمة المرور</Label>
                      <Input
                        id="cpass"
                        type="password"
                        dir="ltr"
                        className={`text-left ${
                          regConfirmPassword
                            ? regPassword === regConfirmPassword
                              ? "border-emerald-500 focus-visible:ring-emerald-500"
                              : "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        required
                      />
                      {regConfirmPassword && (
                        <p
                          className={`text-xs font-semibold ${
                            regPassword === regConfirmPassword ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {regPassword === regConfirmPassword
                            ? "✓ كلمات المرور متطابقة"
                            : "✗ كلمات المرور غير متطابقة"}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button variant="hero" size="lg" type="submit" className="w-full font-bold text-base shadow-md">
                    إنشاء الحساب
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Demo Accounts Sidebar */}
          <aside className="space-y-3 text-right" dir="rtl">
            <h2 className="text-lg font-bold text-brand">دخول تجريبي</h2>
            <p className="text-sm text-muted-foreground">
              اختر نوع الحساب لتجربة كل لوحة (بيانات تجريبية).
            </p>
            {demos.map((d) => (
              <button
                key={d.role}
                type="button"
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
