import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, Globe, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { initialSeoConfig, type SeoConfig } from "@/data/adminStore";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({
    meta: [
      { title: "تحسين محركات البحث (SEO) | وزير الحلو" },
      { name: "description", content: "إعدادات الأرشفة والكلمات المفتاحية والظهور في بحث جوجل." },
    ],
  }),
  component: AdminSeo,
});

function AdminSeo() {
  const [config, setConfig] = useState<SeoConfig>(initialSeoConfig);

  const handleSave = () => {
    toast.success("تم حفظ إعدادات محركات البحث (SEO) بنجاح وتحديث خريطة الموقع");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Globe className="size-6 text-primary" />
            تحسين محركات البحث والظهور (SEO)
          </h1>
          <p className="text-xs text-muted-foreground">
            تخصيص العناوين والكلمات الدلالية ومحاكاة مظهر الموقع في نتائج بحث جوجل ومواقع التواصل
          </p>
        </div>
        <Button variant="hero" onClick={handleSave} className="gap-1.5">
          <Check className="size-4" /> حفظ الإعدادات
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Inputs */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
          <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            بيانات الميتا (Meta Tags)
          </h2>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-brand">عنوان الموقع (Meta Title)</label>
              <span className="text-[11px] text-muted-foreground">
                {config.metaTitle.length} / 60 حرف
              </span>
            </div>
            <Input
              value={config.metaTitle}
              onChange={(e) => setConfig({ ...config, metaTitle: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-brand">الوصف التعريفي (Meta Description)</label>
              <span className="text-[11px] text-muted-foreground">
                {config.metaDescription.length} / 160 حرف
              </span>
            </div>
            <textarea
              rows={3}
              value={config.metaDescription}
              onChange={(e) => setConfig({ ...config, metaDescription: e.target.value })}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand block mb-1">الكلمات المفتاحية (Keywords)</label>
            <Input
              value={config.keywords}
              onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
            <div>
              <label className="text-xs font-bold text-brand block mb-1">معرف Google Analytics</label>
              <Input
                dir="ltr"
                value={config.googleAnalyticsId}
                onChange={(e) => setConfig({ ...config, googleAnalyticsId: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand block mb-1">معرف Meta (Facebook) Pixel</label>
              <Input
                dir="ltr"
                value={config.facebookPixelId}
                onChange={(e) => setConfig({ ...config, facebookPixelId: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
            <div>
              <p className="text-xs font-bold text-brand">السماح لعناكب البحث بأرشفة الموقع</p>
              <p className="text-[11px] text-muted-foreground">
                ملف robots.txt وخريطة sitemap.xml
              </p>
            </div>
            <Switch
              checked={config.allowRobotsIndexing}
              onCheckedChange={(val) => setConfig({ ...config, allowRobotsIndexing: val })}
            />
          </div>
        </div>

        {/* Live SERP & Social Previews */}
        <div className="space-y-4">
          {/* Google Preview */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-3">
            <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
              <Eye className="size-4 text-primary" />
              معاينة النتيجة في بحث جوجل (Google SERP)
            </h2>

            <div className="rounded-xl border border-border bg-background p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">wazeerelhelw.com</span>
                <span>› ar</span>
              </div>
              <h3 className="text-base font-bold text-blue-700 hover:underline cursor-pointer">
                {config.metaTitle}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {config.metaDescription}
              </p>
            </div>
          </div>

          {/* Social Share Preview */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-3">
            <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
              <Share2 className="size-4 text-primary" />
              معاينة المشاركة في واتساب وفيسبوك (OpenGraph)
            </h2>

            <div className="overflow-hidden rounded-xl border border-border bg-background">
              <div className="h-28 bg-gradient-to-r from-brand to-primary/80 flex items-center justify-center text-white font-extrabold text-lg">
                وزير الحلو — Wazeer ElHelw
              </div>
              <div className="p-3">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">
                  wazeerelhelw.com
                </p>
                <h4 className="font-bold text-xs text-brand line-clamp-1 mt-0.5">
                  {config.metaTitle}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">
                  {config.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
