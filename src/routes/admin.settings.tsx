import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BellRing,
  Check,
  CheckSquare,
  DollarSign,
  KeyRound,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Store,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
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
  availableAdminPages,
  initialRoles,
  initialSmsSettings,
  initialSmtpSettings,
  initialStoreSettings,
  type RolePermission,
  type SmsSettings,
  type SmtpSettings,
  type StoreSettings,
} from "@/data/adminStore";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "إعدادات المتجر والصلاحيات | وزير الحلو" },
      {
        name: "description",
        content: "إعدادات وسائل التواصل، خادم SMTP، بوابة SMS، أدوار المستخدمين والصلاحيات والصفحات المصرح بها.",
      },
    ],
  }),
  component: AdminSettings,
});

type SettingsTab = "general" | "social" | "smtp" | "sms" | "roles";

function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // Core Store Settings
  const [settings, setSettings] = useState<StoreSettings>(initialStoreSettings);

  // SMTP Settings
  const [smtp, setSmtp] = useState<SmtpSettings>(initialSmtpSettings);

  // SMS Settings
  const [sms, setSms] = useState<SmsSettings>(initialSmsSettings);

  // Roles & Permissions & Allowed Pages
  const [roles, setRoles] = useState<RolePermission[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoles[0]?.id ?? "role-super");

  // Add Role Modal
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const currentRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0]!;

  const handleSaveGeneral = () => {
    toast.success("تم حفظ إعدادات المتجر العامة بنجاح");
  };

  const handleSaveSocial = () => {
    toast.success("تم تحديث روابط وسائل التواصل الاجتماعي بنجاح");
  };

  const handleSaveSmtp = () => {
    toast.success("تم حفظ إعدادات خادم البريد (SMTP) بنجاح");
  };

  const handleTestSmtp = () => {
    toast.info("جاري إرسال بريد إلكتروني تجريبي...");
    setTimeout(() => {
      toast.success("تم إرسال البريد التجريبي بنجاح عبر " + smtp.host);
    }, 800);
  };

  const handleSaveSms = () => {
    toast.success("تم حفظ إعدادات بوابة الرسائل القصيرة (SMS) بنجاح");
  };

  const handleTestSms = () => {
    toast.info("جاري إرسال رسالة نصية تجريبية...");
    setTimeout(() => {
      toast.success(`تم إرسال SMS بنجاح باسم الراسل (${sms.senderId})`);
    }, 800);
  };

  // Role Permissions Handlers
  const togglePermission = (key: "canRead" | "canCreate" | "canEdit" | "canDelete" | "canExport") => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === currentRole.id ? { ...r, [key]: !r[key] } : r
      )
    );
  };

  const toggleAllowedPage = (pageId: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== currentRole.id) return r;
        const exists = r.allowedPages.includes(pageId);
        const nextAllowed = exists
          ? r.allowedPages.filter((p) => p !== pageId)
          : [...r.allowedPages, pageId];
        return { ...r, allowedPages: nextAllowed };
      })
    );
  };

  const handleSelectAllPages = () => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === currentRole.id
          ? { ...r, allowedPages: availableAdminPages.map((p) => p.id) }
          : r
      )
    );
    toast.success("تم تفعيل الوصول لكافة الصفحات لهذا الدور");
  };

  const handleClearAllPages = () => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === currentRole.id ? { ...r, allowedPages: [] } : r
      )
    );
    toast.info("تم إلغاء تحديد كافة الصفحات");
  };

  const handleSaveRoles = () => {
    toast.success(`تم حفظ صلاحيات وصفحات دور "${currentRole.name}" بنجاح`);
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error("يرجى إدخال اسم الدور الوظيفي");
      return;
    }

    const newRole: RolePermission = {
      id: `role-${Date.now()}`,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || "صلاحيات مخصصة",
      usersCount: 0,
      canRead: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canExport: false,
      allowedPages: ["dashboard", "orders"],
    };

    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleId(newRole.id);
    setIsAddRoleOpen(false);
    toast.success(`تم إنشاء دور جديد: ${newRole.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand flex items-center gap-2">
            <Settings className="size-6 text-primary" />
            إعدادات النظام والمتجر
          </h1>
          <p className="text-xs text-muted-foreground">
            تخصيص الهوية، وسائل التواصل، خدمات SMTP و SMS، وإدارة الصلاحيات والصفحات المصرح بها
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2.5">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "general"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Store className="size-3.5" />
          المتجر والضرائب
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "social"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Share2 className="size-3.5" />
          وسائل التواصل الاجتماعي (Social)
        </button>

        <button
          onClick={() => setActiveTab("smtp")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "smtp"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Mail className="size-3.5" />
          البريد الإلكتروني (SMTP)
        </button>

        <button
          onClick={() => setActiveTab("sms")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "sms"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <MessageSquare className="size-3.5" />
          بوابة الرسائل (SMS)
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "roles"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <ShieldCheck className="size-3.5" />
          الأدوار والصلاحيات والصفحات المصرح بها
        </button>
      </div>

      {/* 1. GENERAL TAB */}
      {activeTab === "general" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div>
              <h2 className="text-sm font-extrabold text-brand">حالة استقبال الطلبات (أونلاين)</h2>
              <p className="text-xs text-muted-foreground">
                إيقاف أو فتح استقبال الطلبات من المتجر والتطبيق
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.isOpen}
                onCheckedChange={(val) => {
                  setSettings({ ...settings, isOpen: val });
                  toast.info(val ? "المتجر مفتوح لاستقبال الطلبات" : "تم إغلاق المتجر مؤقتاً");
                }}
              />
              <span className="text-xs font-bold text-foreground">
                {settings.isOpen ? "مفتوح ويستقبل الطلبات" : "مغلق مؤقتاً"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
                <Store className="size-4 text-primary" />
                هوية المتجر وبيانات الاتصال
              </h2>
              <Button variant="hero" size="sm" onClick={handleSaveGeneral}>
                <Check className="size-3.5" /> حفظ البيانات
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-brand block mb-1">اسم المتجر</label>
                <Input
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand block mb-1">الشعار التسويقي (Slogan)</label>
                <Input
                  value={settings.storeSlogan}
                  onChange={(e) => setSettings({ ...settings, storeSlogan: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-bold text-brand block mb-1">رقم الهاتف الأساسي</label>
                <Input
                  dir="ltr"
                  value={settings.primaryPhone}
                  onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand block mb-1">الخط الساخن المختصر</label>
                <Input
                  dir="ltr"
                  value={settings.hotline}
                  onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand block mb-1">البريد الإلكتروني للشكاوى</label>
                <Input
                  dir="ltr"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">العنوان الرئيسي للمقر</label>
              <Input
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3 border-t border-border pt-4">
              <div>
                <label className="text-xs font-bold text-brand block mb-1">ضريبة القيمة المضافة (%)</label>
                <Input
                  type="number"
                  value={settings.vatRate}
                  onChange={(e) =>
                    setSettings({ ...settings, vatRate: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand block mb-1">رسوم التوصيل الأساسية (ج.م)</label>
                <Input
                  type="number"
                  value={settings.defaultDeliveryFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultDeliveryFee: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand block mb-1">حد التوصيل المجاني (ج.م)</label>
                <Input
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SOCIAL MEDIA TAB */}
      {activeTab === "social" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
                <Share2 className="size-4 text-primary" />
                حسابات وروابط وسائل التواصل الاجتماعي
              </h2>
              <p className="text-xs text-muted-foreground">
                تظهر هذه الروابط في الترويسة والتذييل وصفحات التواصل
              </p>
            </div>
            <Button variant="hero" size="sm" onClick={handleSaveSocial}>
              <Check className="size-3.5" /> حفظ الروابط
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-brand block mb-1">رابط فيسبوك (Facebook)</label>
              <Input
                dir="ltr"
                placeholder="https://facebook.com/wazeerelhelw"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">رابط انستجرام (Instagram)</label>
              <Input
                dir="ltr"
                placeholder="https://instagram.com/wazeerelhelw"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">رابط تيك توك (TikTok)</label>
              <Input
                dir="ltr"
                placeholder="https://tiktok.com/@wazeerelhelw"
                value={settings.tiktokUrl}
                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">قناة يوتيوب (YouTube)</label>
              <Input
                dir="ltr"
                placeholder="https://youtube.com/@wazeerelhelw"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">منصة إكس (Twitter/X)</label>
              <Input
                dir="ltr"
                placeholder="https://x.com/wazeerelhelw"
                value={settings.twitterUrl}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">رقم الواتساب للطلبات والدعم</label>
              <Input
                dir="ltr"
                placeholder="+20 122 228 1651"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. SMTP SETTINGS TAB */}
      {activeTab === "smtp" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                إعدادات خادم البريد الإلكتروني (SMTP Mail Server)
              </h2>
              <p className="text-xs text-muted-foreground">
                إرسال فواتير الشراء، إشعارات تأكيد الطلب، ورسائل إعادة تعيين كلمة المرور
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTestSmtp} className="gap-1.5">
                <Send className="size-3.5" /> تجربة الإرسال
              </Button>
              <Button variant="hero" size="sm" onClick={handleSaveSmtp} className="gap-1.5">
                <Check className="size-3.5" /> حفظ SMTP
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-brand block mb-1">خادم SMTP (Host / Server)</label>
              <Input
                dir="ltr"
                placeholder="smtp.gmail.com أو smtp.mailgun.org"
                value={smtp.host}
                onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-brand block mb-1">المنفذ (Port)</label>
                <Input
                  type="number"
                  dir="ltr"
                  placeholder="587"
                  value={smtp.port}
                  onChange={(e) => setSmtp({ ...smtp, port: parseInt(e.target.value) || 587 })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand block mb-1">التشفير (Encryption)</label>
                <select
                  value={smtp.encryption}
                  onChange={(e) =>
                    setSmtp({ ...smtp, encryption: e.target.value as "TLS" | "SSL" | "None" })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="TLS">TLS (موصى به)</option>
                  <option value="SSL">SSL</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">اسم المستخدم / البريد (Username)</label>
              <Input
                dir="ltr"
                placeholder="apikey أو user@domain.com"
                value={smtp.username}
                onChange={(e) => setSmtp({ ...smtp, username: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">كلمة المرور / App Password</label>
              <Input
                type="password"
                dir="ltr"
                placeholder="••••••••••••••••"
                value={smtp.password}
                onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">اسم الراسل (Sender Name)</label>
              <Input
                placeholder="وزير الحلو"
                value={smtp.senderName}
                onChange={(e) => setSmtp({ ...smtp, senderName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">بريد الراسل (Sender Email)</label>
              <Input
                type="email"
                dir="ltr"
                placeholder="orders@wazeerelhelw.com"
                value={smtp.senderEmail}
                onChange={(e) => setSmtp({ ...smtp, senderEmail: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SMS GATEWAY TAB */}
      {activeTab === "sms" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                بوابة الرسائل النصية القصيرة (SMS Gateway)
              </h2>
              <p className="text-xs text-muted-foreground">
                إرسال كود التفعيل والتحقق، وتحديثات حالة تسليم الطلبات للعميل على هاتفه
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTestSms} className="gap-1.5">
                <Send className="size-3.5" /> إرسال رسالة تجريبية
              </Button>
              <Button variant="hero" size="sm" onClick={handleSaveSms} className="gap-1.5">
                <Check className="size-3.5" /> حفظ SMS
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-brand block mb-1">مزود الخدمة (SMS Provider)</label>
              <select
                value={sms.provider}
                onChange={(e) =>
                  setSms({
                    ...sms,
                    provider: e.target.value as "SMS Misr" | "Vodafone SMS" | "Orange Business" | "Twilio",
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value="SMS Misr">SMS Misr (مصر)</option>
                <option value="Vodafone SMS">Vodafone SMS Business</option>
                <option value="Orange Business">Orange Business SMS</option>
                <option value="Twilio">Twilio Global</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">مفتاح الربط (API Key / Auth Token)</label>
              <Input
                type="password"
                dir="ltr"
                value={sms.apiKey}
                onChange={(e) => setSms({ ...sms, apiKey: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand block mb-1">اسم الراسل المعتمد (Sender ID)</label>
              <Input
                placeholder="WAZEER"
                value={sms.senderId}
                onChange={(e) => setSms({ ...sms, senderId: e.target.value.toUpperCase() })}
                className="font-mono uppercase"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
            <h3 className="text-xs font-bold text-brand">محفزات الإرسال التلقائي للرسائل (SMS Triggers)</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>إرسال رسالة عند استلام الطلب وتأكيد الحجز</span>
                <Switch
                  checked={sms.sendOnNewOrder}
                  onCheckedChange={(val) => setSms({ ...sms, sendOnNewOrder: val })}
                />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span>إرسال رسالة عند خروج الكابتن بالطلب وتحديد رقم هاتفه</span>
                <Switch
                  checked={sms.sendOnDispatch}
                  onCheckedChange={(val) => setSms({ ...sms, sendOnDispatch: val })}
                />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span>إرسال رسالة شكر وتقييم عند إتمام التوصيل</span>
                <Switch
                  checked={sms.sendOnDelivered}
                  onCheckedChange={(val) => setSms({ ...sms, sendOnDelivered: val })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. USER ROLES, PERMISSIONS & ALLOWED PAGES TAB */}
      {activeTab === "roles" && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 className="text-base font-extrabold text-brand flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                أدوار المستخدمين والصلاحيات والصفحات المصرح بها
              </h2>
              <p className="text-xs text-muted-foreground">
                تحديد الصلاحيات الإجرائية والصفحات التي يحق لكل دور وظيفي تصفحها وإدارتها
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAddRoleOpen(true)}>
                <Plus className="size-3.5" /> إضافة دور جديد
              </Button>
              <Button variant="hero" size="sm" onClick={handleSaveRoles}>
                <Check className="size-3.5" /> حفظ إعدادات الدور
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Roles List */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground px-1">الأدوار الوظيفية الحالية:</p>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`w-full text-right rounded-2xl border p-3 transition-all ${
                    selectedRoleId === r.id
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-card hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-brand text-xs">{r.name}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {r.usersCount} موظف
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                    {r.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Role Config Panel */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-brand">{currentRole.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{currentRole.description}</p>
              </div>

              {/* CRUD Permissions */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                <h4 className="text-xs font-bold text-brand">الصلاحيات الإجرائية (Permissions):</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={currentRole.canRead}
                      onChange={() => togglePermission("canRead")}
                      className="rounded text-primary focus:ring-primary size-4"
                    />
                    <span>عرض وقراءة</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={currentRole.canCreate}
                      onChange={() => togglePermission("canCreate")}
                      className="rounded text-primary focus:ring-primary size-4"
                    />
                    <span>إضافة وإنشاء</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={currentRole.canEdit}
                      onChange={() => togglePermission("canEdit")}
                      className="rounded text-primary focus:ring-primary size-4"
                    />
                    <span>تعديل وتحديث</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={currentRole.canDelete}
                      onChange={() => togglePermission("canDelete")}
                      className="rounded text-primary focus:ring-primary size-4"
                    />
                    <span>حذف</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={currentRole.canExport}
                      onChange={() => togglePermission("canExport")}
                      className="rounded text-primary focus:ring-primary size-4"
                    />
                    <span>تصدير تقارير</span>
                  </label>
                </div>
              </div>

              {/* Allowed Pages Checklist */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                  <h4 className="text-xs font-bold text-brand flex items-center gap-1.5">
                    <CheckSquare className="size-3.5 text-primary" />
                    الصفحات المصرح بالدخول إليها (Allowed Pages):
                    <span className="text-primary font-bold">
                      ({currentRole.allowedPages.length} من {availableAdminPages.length})
                    </span>
                  </h4>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={handleSelectAllPages}
                      className="font-bold text-primary hover:underline"
                    >
                      تحديد الكل
                    </button>
                    <span>•</span>
                    <button
                      onClick={handleClearAllPages}
                      className="text-muted-foreground hover:underline"
                    >
                      إلغاء التحديد
                    </button>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {availableAdminPages.map((page) => {
                    const isAllowed = currentRole.allowedPages.includes(page.id);
                    return (
                      <div
                        key={page.id}
                        onClick={() => toggleAllowedPage(page.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isAllowed
                            ? "border-primary/50 bg-primary/5 text-brand"
                            : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={() => {}} // handled by parent onClick
                            className="rounded text-primary focus:ring-primary size-4 pointer-events-none"
                          />
                          <div>
                            <p className="font-bold">{page.label}</p>
                            <code className="text-[10px] text-muted-foreground">{page.path}</code>
                          </div>
                        </div>

                        <span className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground font-semibold">
                          {page.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة دور وظيفي جديد</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-brand">اسم الدور الوظيفي</label>
              <Input
                placeholder="مثال: منسق طلبات الحفلات"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand">الوصف والمهام</label>
              <Input
                placeholder="مسؤول عن استقبال ومتابعة طلبيات التورت والبوفيهات..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={handleCreateRole}>
              إنشاء الدور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
