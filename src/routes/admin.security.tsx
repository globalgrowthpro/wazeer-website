import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Lock, Plus, ShieldAlert, ShieldCheck, UserCheck, XCircle } from "lucide-react";
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
import {
  initialAdminUsers,
  initialAuditLogs,
  type AdminUser,
  type LoginAuditLog,
} from "@/data/adminStore";

export const Route = createFileRoute("/admin/security")({
  head: () => ({
    meta: [
      { title: "الأمان والصلاحيات وسجل الدخول | وزير الحلو" },
      { name: "description", content: "إدارة صلاحيات المشرفين، المصادقة الثنائية وسجل الأمان." },
    ],
  }),
  component: AdminSecurity,
});

function AdminSecurity() {
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [logs] = useState<LoginAuditLog[]>(initialAuditLogs);
  const [twoFactorGlobal, setTwoFactorGlobal] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<"سوبر أدمن" | "مدير فرع" | "محاسب / كاشير">("مدير فرع");

  const openAdd = () => {
    setFormName("");
    setFormEmail("");
    setFormRole("مدير فرع");
    setIsModalOpen(true);
  };

  const handleAddUser = () => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("يرجى إدخال اسم المستخدم والبريد الإلكتروني");
      return;
    }

    const newUser: AdminUser = {
      id: `adm-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      lastLogin: "لم يسجل بعد",
      twoFactorEnabled: false,
    };

    setUsers((prev) => [...prev, newUser]);
    toast.success(`تمت إضافة المشرف (${formName}) وإرسال دعوة التفعيل`);
    setIsModalOpen(false);
  };

  const toggle2FA = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, twoFactorEnabled: !u.twoFactorEnabled } : u))
    );
    toast.success("تم تحديث حالة المصادقة الثنائية للمستخدم");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Lock className="size-6 text-primary" />
            الأمان والصلاحيات وسجل النشاط
          </h1>
          <p className="text-xs text-muted-foreground">
            إدارة حسابات لوحة التحكم، المصادقة الثنائية (2FA)، وتتبع محاولات تسجيل الدخول
          </p>
        </div>
        <Button variant="hero" onClick={openAdd}>
          <Plus className="size-4" /> إضافة مشرف جديد
        </Button>
      </div>

      {/* Security Policies */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-green-600" />
              <h3 className="font-bold text-brand text-sm">المصادقة الثنائية الإلزامية (2FA)</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              فرض رمز التحقق عبر SMS أو تطبيق Google Authenticator عند الدخول
            </p>
          </div>
          <Switch
            checked={twoFactorGlobal}
            onCheckedChange={(val) => {
              setTwoFactorGlobal(val);
              toast.success("تم تحديث سياسة المصادقة الثنائية");
            }}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-primary" />
              <h3 className="font-bold text-brand text-sm">مهلة انتهاء الجلسة التلقائية</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              تسجيل الخروج التلقائي عند عدم وجود نشاط للحفاظ على الأمان
            </p>
          </div>
          <select
            value={sessionTimeout}
            onChange={(e) => {
              setSessionTimeout(e.target.value);
              toast.success("تم تحديث مهلة الجلسة");
            }}
            className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-semibold"
          >
            <option value="15">15 دقيقة</option>
            <option value="30">30 دقيقة</option>
            <option value="60">ساعة واحدة</option>
            <option value="120">ساعتان</option>
          </select>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="mb-3 text-base font-extrabold text-brand flex items-center gap-2">
          <UserCheck className="size-4 text-primary" />
          المشرفون وحسابات الإدارة
        </h2>

        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/50 p-3"
            >
              <div>
                <p className="font-bold text-brand text-sm">{u.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{u.email}</span>
                  <span>•</span>
                  <span className="font-semibold text-primary">{u.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">آخر دخول: {u.lastLogin}</span>

                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={u.twoFactorEnabled}
                    onCheckedChange={() => toggle2FA(u.id)}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {u.twoFactorEnabled ? "2FA مفعل" : "2FA معطل"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="mb-3 text-base font-extrabold text-brand">
          سجل محاولات تسجيل الدخول الأخيرة (Audit Log)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 font-bold">المستخدم</th>
                <th className="pb-2 font-bold">عنوان الـ IP</th>
                <th className="pb-2 font-bold">الجهاز / المتصفح</th>
                <th className="pb-2 font-bold">الموقع التقريبي</th>
                <th className="pb-2 font-bold">الوقت</th>
                <th className="pb-2 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => (
                <tr key={log.id} className="text-foreground">
                  <td className="py-2.5 font-bold">{log.user}</td>
                  <td className="py-2.5 font-mono text-[11px] text-muted-foreground" dir="ltr">
                    {log.ip}
                  </td>
                  <td className="py-2.5 text-muted-foreground">{log.device}</td>
                  <td className="py-2.5 text-muted-foreground">{log.location}</td>
                  <td className="py-2.5 text-muted-foreground">{log.timestamp}</td>
                  <td className="py-2.5">
                    {log.status === "ناجح" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 font-bold text-green-700">
                        <CheckCircle2 className="size-3" /> ناجح
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 font-bold text-red-700">
                        <XCircle className="size-3" /> محاولة فاشلة
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة مشرف جديد للوحة التحكم</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">الاسم الكامل</label>
              <Input
                placeholder="أحمد علي"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">البريد الإلكتروني</label>
              <Input
                type="email"
                dir="ltr"
                placeholder="ahmed@wazeerelhelw.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الدور / الصلاحية</label>
              <select
                value={formRole}
                onChange={(e) =>
                  setFormRole(e.target.value as "سوبر أدمن" | "مدير فرع" | "محاسب / كاشير")
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value="سوبر أدمن">سوبر أدمن (كافة الصلاحيات)</option>
                <option value="مدير فرع">مدير فرع (الطلبات، المنتجات والمخزون)</option>
                <option value="محاسب / كاشير">محاسب / كاشير (نقاط البيع والفواتير)</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleAddUser}>
              إرسال الدعوة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
