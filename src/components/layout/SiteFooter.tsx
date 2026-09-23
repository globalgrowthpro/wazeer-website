import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

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
    <footer className="brand-gradient mt-10 md:mt-12 text-brand-foreground">
      <div className="container-page grid gap-8 py-8 md:py-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light imgClassName="h-12 w-auto" />
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
