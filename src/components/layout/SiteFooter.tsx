import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/menu", label: "القائمة" },
  { to: "/pos", label: "نقاط البيع" },
  { to: "/gallery", label: "معرض الصور" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

const service = ["الأسئلة الشائعة", "سياسة التوصيل", "الشروط والأحكام", "سياسة الخصوصية"];

export function SiteFooter() {
  return (
    <footer className="brand-gradient mt-16 text-brand-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block rounded-2xl bg-white px-3 py-1.5">
            <Logo light />
          </span>
          <p className="mt-4 text-sm leading-7 text-brand-foreground/80">
            وزير الحلو — أشهى الحلويات الشرقية والغربية والمأكولات الطازجة، محضّرة يومياً بأجود
            المكونات وبأسعار تناسب الجميع.
          </p>
          <div className="mt-5 flex gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-white/10">
              <Facebook className="size-4" />
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-white/10">
              <Instagram className="size-4" />
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-gold">روابط سريعة</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-brand-foreground/80 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-gold">خدمة العملاء</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-foreground/80">
            {service.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-gold">تواصل معنا</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-foreground/80">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-gold" /> <span dir="ltr">+20 122 228 1651</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-gold" /> info@wazeerelhelw.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-gold" /> موقف الخصوص، مصر
            </li>
          </ul>
          <form
            className="mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              type="email"
              required
              placeholder="بريدك الإلكتروني"
              className="h-10 border-white/25 bg-white/10 text-brand-foreground placeholder:text-brand-foreground/60"
            />
            <Button type="submit" variant="hero" className="h-10">
              اشترك
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-brand-foreground/70 md:flex-row">
          <span>© 2026 Wazeer ElHelw. جميع الحقوق محفوظة.</span>
          <span>الحلو دايمًا بمزاجك ❤️</span>
        </div>
      </div>
    </footer>
  );
}
