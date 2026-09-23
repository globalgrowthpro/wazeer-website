import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Headphones, MessageCircle, MessageSquare, Phone, Plus, Search, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initialSupportTickets, type SupportTicket } from "@/data/adminStore";

export const Route = createFileRoute("/admin/support")({
  head: () => ({
    meta: [
      { title: "مركز الدعم الفني وخدمة العملاء | وزير الحلو" },
      { name: "description", content: "متابعة تذاكر الدعم وشكاوى واستفسارات عملاء وزير الحلو." },
    ],
  }),
  component: AdminSupport,
});

function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyTicket, setReplyTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.customerName.includes(search.trim()) ||
      t.customerPhone.includes(search.trim()) ||
      t.subject.includes(search.trim()) ||
      t.id.includes(search.trim());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openReply = (t: SupportTicket) => {
    setReplyTicket(t);
    setReplyMessage("");
    setIsModalOpen(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error("يرجى كتابة نص الرد للعميل");
      return;
    }

    if (replyTicket) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === replyTicket.id ? { ...t, status: "تم الحل" } : t
        )
      );
      toast.success(`تم إرسال الرد للعميل (${replyTicket.customerName}) وتم إغلاق التذكرة`);
    }
    setIsModalOpen(false);
  };

  const updateStatus = (id: string, newStatus: "جديد" | "قيد المتابعة" | "تم الحل") => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    toast.success(`تم تحديث حالة التذكرة إلى: ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    toast.success("تم حذف التذكرة");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Headphones className="size-6 text-primary" />
            مركز الدعم الفني وخدمة العملاء
          </h1>
          <p className="text-xs text-muted-foreground">
            متابعة رسائل العملاء، الرد على الاستفسارات، وشكاوى الطلبات والتوصيل
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث برقم التذكرة أو اسم العميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {["all", "جديد", "قيد المتابعة", "تم الحل"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${
                filterStatus === st
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {st === "all" ? "الكل" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">{t.id}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                    {t.category}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                      t.priority === "عالية"
                        ? "bg-red-100 text-red-700"
                        : t.priority === "متوسطة"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    أولوية: {t.priority}
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-extrabold text-brand">{t.subject}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    t.status === "جديد"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : t.status === "قيد المتابعة"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {t.status}
                </span>
                <span className="text-xs text-muted-foreground">{t.createdAt}</span>
              </div>
            </div>

            <p className="mt-2.5 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-foreground">
              {t.message}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-bold text-brand">{t.customerName}</span>
                <span dir="ltr">{t.customerPhone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs text-green-700 border-green-200 hover:bg-green-50"
                  onClick={() =>
                    window.open(`https://wa.me/${t.customerPhone.replace(/[^0-9]/g, "")}`)
                  }
                >
                  <MessageCircle className="size-3" /> واتساب
                </Button>
                <Button
                  variant="hero"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => openReply(t)}
                >
                  <Send className="size-3" /> الرد والإغلاق
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => handleDelete(t.id)}
                  title="حذف"
                >
                  <Trash2 className="size-3.5 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            لا توجد تذاكر دعم تطابق البحث
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>الرد على التذكرة: {replyTicket?.id}</DialogTitle>
          </DialogHeader>

          {replyTicket && (
            <div className="space-y-3 py-2">
              <div className="rounded-lg bg-muted p-2.5 text-xs">
                <span className="font-bold text-brand block mb-1">
                  العميل: {replyTicket.customerName} ({replyTicket.customerPhone})
                </span>
                <span className="text-muted-foreground">{replyTicket.message}</span>
              </div>

              <div>
                <label className="text-xs font-bold text-brand">نص الرد / الإجراء المتخذ</label>
                <textarea
                  rows={4}
                  placeholder="مرحباً بك، نعتذر عن التأخير وقد تم التواصل مع المندوب ومتابعة طلبك..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleSendReply}>
              إرسال الرد وحل التذكرة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
