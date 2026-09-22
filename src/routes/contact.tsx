import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | وزير الحلو" },
      {
        name: "description",
        content: "تواصل مع وزير الحلو عبر الهاتف أو واتساب أو البريد، وتعرف على عناوين الفروع ومواعيد العمل.",
      },
      { property: "og:title", content: "تواصل معنا | وزير الحلو" },
      { property: "og:description", content: "بيانات التواصل وعناوين فروع وزير الحلو." },
    ],
  }),
  component: ContactPage,
});

const info = [
  { icon: Phone, label: "الهاتف", value: "+20 122 228 1651" },
  { icon: MessageCircle, label: "واتساب", value: "+20 122 228 1651" },
  { icon: Mail, label: "البريد الإلكتروني", value: "info@wazeerelhelw.com" },
  { icon: MapPin, label: "العنوان", value: "موقف الخصوص، القليوبية، مصر" },
  { icon: Clock, label: "مواعيد العمل", value: "يومياً من 9 صباحاً حتى 1 بعد منتصف الليل" },
];

const branches = [
  { name: "فرع الخصوص", address: "موقف الخصوص، القليوبية", phone: "+20 122 228 1651" },
  { name: "فرع شبرا", address: "شارع شبرا الرئيسي، القاهرة", phone: "+20 122 228 1652" },
  { name: "فرع المرج", address: "ميدان المرج، القاهرة", phone: "+20 122 228 1653" },
];

function ContactPage() {
  return (
    <>
      <PageHero title="تواصل معنا" subtitle="نحن هنا لخدمتك دائمًا" />

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {info.map((i) => (
                <div
                  key={i.label}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <i.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">{i.label}</p>
                    <p className="text-sm font-bold text-brand">{i.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-xl text-brand">فروعنا</h2>
            <div className="mt-4 space-y-3">
              {branches.map((b) => (
                <div key={b.name} className="rounded-2xl bg-muted p-4">
                  <p className="font-bold text-brand">{b.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>
                  <p className="text-sm text-muted-foreground">{b.phone}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-xl text-brand">أرسل لنا رسالة</h2>
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("تم إرسال رسالتك، سنتواصل معك قريبًا");
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">الاسم</Label>
                  <Input id="name" required placeholder="اسمك بالكامل" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" required placeholder="01xxxxxxxxx" className="h-11" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">الموضوع</Label>
                <Input id="subject" placeholder="موضوع الرسالة" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">الرسالة</Label>
                <Textarea id="message" required rows={5} placeholder="اكتب رسالتك هنا..." />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                إرسال الرسالة
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
