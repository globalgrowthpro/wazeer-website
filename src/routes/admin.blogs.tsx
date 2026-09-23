import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Calendar, Clock, Pencil, Plus, Search, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initialBlogs, type BlogPost } from "@/data/adminStore";

export const Route = createFileRoute("/admin/blogs")({
  head: () => ({
    meta: [
      { title: "المدونة والوصفات | وزير الحلو" },
      { name: "description", content: "إدارة مقالات مدونة وزير الحلو، أسرار الحلويات والوصفات." },
    ],
  }),
  component: AdminBlogs,
});

function AdminBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formCategory, setFormCategory] = useState("حلويات شرقية");
  const [formReadTime, setFormReadTime] = useState("4 دقائق");
  const [formExcerpt, setFormExcerpt] = useState("");

  const filtered = blogs.filter(
    (b) =>
      b.title.includes(search.trim()) ||
      b.excerpt.includes(search.trim()) ||
      b.author.includes(search.trim())
  );

  const openAdd = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormSlug("");
    setFormAuthor("شيف وزير الحلو");
    setFormCategory("حلويات شرقية");
    setFormReadTime("4 دقائق");
    setFormExcerpt("");
    setIsModalOpen(true);
  };

  const openEdit = (b: BlogPost) => {
    setEditingItem(b);
    setFormTitle(b.title);
    setFormSlug(b.slug);
    setFormAuthor(b.author);
    setFormCategory(b.category);
    setFormReadTime(b.readTime);
    setFormExcerpt(b.excerpt);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error("يرجى إدخال عنوان المقال");
      return;
    }

    if (editingItem) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === editingItem.id
            ? {
                ...b,
                title: formTitle.trim(),
                slug: formSlug.trim() || formTitle.trim().replace(/\s+/g, "-"),
                author: formAuthor.trim(),
                category: formCategory.trim(),
                readTime: formReadTime.trim(),
                excerpt: formExcerpt.trim(),
              }
            : b
        )
      );
      toast.success("تم تحديث بيانات المقال بنجاح");
    } else {
      const newBlog: BlogPost = {
        id: `blg-${Date.now()}`,
        title: formTitle.trim(),
        slug: formSlug.trim() || `post-${Date.now()}`,
        author: formAuthor.trim() || "فريق التحرير",
        category: formCategory.trim() || "عام",
        readTime: formReadTime.trim() || "3 دقائق",
        date: new Date().toISOString().split("T")[0] ?? "2026-09-22",
        image: blogs[0]?.image || "",
        excerpt: formExcerpt.trim(),
        isPublished: true,
      };
      setBlogs((prev) => [newBlog, ...prev]);
      toast.success("تم نشر المقال الجديد بنجاح");
    }
    setIsModalOpen(false);
  };

  const togglePublish = (id: string) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPublished: !b.isPublished } : b))
    );
    toast.success("تم تحديث حالة نشر المقال");
  };

  const handleDelete = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    toast.success("تم حذف المقال");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <BookOpen className="size-6 text-primary" />
            المدونة والوصفات والمقالات
          </h1>
          <p className="text-xs text-muted-foreground">
            إدارة المحتوى التسويقي، قصص الحلويات، ووصفات وزير الحلو المميزة
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> كتابة مقال جديد
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث في المقالات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
          >
            <div>
              <div className="relative mb-3 h-36 overflow-hidden rounded-xl bg-muted">
                <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
                <span className="absolute right-2.5 top-2.5 rounded bg-brand/80 px-2 py-0.5 text-[11px] font-bold text-brand-foreground backdrop-blur">
                  {b.category}
                </span>
              </div>

              <h3 className="font-extrabold text-brand line-clamp-2 leading-snug">{b.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{b.excerpt}</p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2.5">
                <span className="inline-flex items-center gap-1">
                  <User className="size-3 text-primary" /> {b.author}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" /> {b.readTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" /> {b.date}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={b.isPublished}
                  onCheckedChange={() => togglePublish(b.id)}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {b.isPublished ? "منشور" : "مسودة"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(b)} title="تعديل">
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)} title="حذف">
                  <Trash2 className="size-3.5 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "تعديل المقال" : "كتابة مقال جديد"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[70vh] overflow-y-auto px-1">
            <div>
              <label className="text-xs font-bold text-brand">عنوان المقال</label>
              <Input
                placeholder="أسرار تحضير القشطوطة..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الرابط المختصر (Slug)</label>
              <Input
                placeholder="secrets-of-keshtota"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand">الكاتب</label>
                <Input
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand">وقت القراءة</label>
                <Input
                  value={formReadTime}
                  onChange={(e) => setFormReadTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand">التصنيف</label>
              <Input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">المقتطف / الملخص</label>
              <textarea
                rows={3}
                placeholder="ملخص قصير يظهر في بطاقة المقال..."
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingItem ? "حفظ التعديلات" : "نشر المقال"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
