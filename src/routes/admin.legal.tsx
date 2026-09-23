import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, FileText, Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { initialLegalPages, type LegalPage } from "@/data/adminStore";

export const Route = createFileRoute("/admin/legal")({
  head: () => ({
    meta: [
      { title: "الصفحات القانونية والسياسات | وزير الحلو" },
      { name: "description", content: "إدارة وتعديل سياسة الخصوصية، الشروط والأحكام وسياسة التوصيل." },
    ],
  }),
  component: AdminLegal,
});

function AdminLegal() {
  const [pages, setPages] = useState<LegalPage[]>(initialLegalPages);
  const [selectedId, setSelectedId] = useState<string>(initialLegalPages[0]?.id ?? "terms");

  const activePage: LegalPage =
    pages.find((p) => p.id === selectedId) ?? pages[0] ?? initialLegalPages[0]!;
  const [currentContent, setCurrentContent] = useState(activePage.content);

  const handleSelect = (page: LegalPage) => {
    setSelectedId(page.id);
    setCurrentContent(page.content);
  };

  const handleSave = () => {
    const today: string = new Date().toISOString().split("T")[0] ?? "2026-09-22";
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePage.id
          ? { ...p, content: currentContent, lastUpdated: today }
          : p
      )
    );
    toast.success(`تم حفظ صفحة "${activePage.title}" بنجاح`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-brand flex items-center gap-2">
          <Scale className="size-6 text-primary" />
          الصفحات القانونية وسياسات المتجر
        </h1>
        <p className="text-xs text-muted-foreground">
          تعديل الشروط والأحكام، سياسة الخصوصية، وقواعد الإلغاء والاسترجاع
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelect(p)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedId === p.id
                ? "bg-brand text-brand-foreground shadow-sm"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            <FileText className="size-3.5" />
            {p.title}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-black text-brand">{activePage.title}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3 text-primary" />
              <span>آخر تحديث: {activePage.lastUpdated}</span>
              <span>•</span>
              <code className="text-primary">/{activePage.slug}</code>
            </div>
          </div>

          <Button variant="hero" onClick={handleSave} className="gap-1.5">
            <Check className="size-4" /> حفظ التعديلات
          </Button>
        </div>

        <div>
          <label className="text-xs font-bold text-brand block mb-1.5">
            محتوى الصفحة والبنود القانونية
          </label>
          <textarea
            rows={12}
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-4 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-sans"
          />
        </div>

        <div className="rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground leading-relaxed">
          <p className="font-bold text-foreground mb-1">تنبيه قانوني:</p>
          التعديلات على الشروط والسياسات تنطبق تلقائياً على كافة الطلبات الجديدة المنجزة عبر الموقع
          وتطبيق الهاتف.
        </div>
      </div>
    </div>
  );
}
