import { useState, useRef, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  Bot,
  PhoneCall,
  X,
  Send,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  chips?: string[] | undefined;
}

const FAQ_CHIPS = [
  "🔥 أحدث العروض والخصومات",
  "📍 أين تقع فروعكم؟",
  "🛵 ما هي مدة وأسعار التوصيل؟",
  "🕒 ما هي مواعيد العمل؟",
  "🍰 ما هي أشهر حلوياتكم؟",
  "💬 تحدث مع موظف خدمة العملاء",
];

const BOT_RESPONSES: { keywords: string[]; answer: string; chips?: string[] | undefined }[] = [
  {
    keywords: ["عرض", "عروض", "خصم", "تخفيض", "سعر", "اسعار", "وفر"],
    answer:
      "🔥 عروض وزير الحلو الحالية لا تفوت:\n• قشطوطة مميزة: 99 ج.م (بدلاً من 129 ج.م)\n• آيس كريم فواكه: 49 ج.م (بدلاً من 65 ج.م)\n• كيك شوكولاتة: 120 ج.م (بدلاً من 150 ج.م)\n• كنافة بالفستق: 110 ج.م (بدلاً من 135 ج.م)\n• علبة بقلاوة فاخرة: 180 ج.م (بدلاً من 210 ج.م)\n\nيمكنك تصفح قسم العروض على الموقع والطلب الآن!",
    chips: ["🛵 كيف أطلب الآن؟", "📍 فروع وزير الحلو"],
  },
  {
    keywords: ["فرع", "فروع", "مكان", "عنوان", "لوكيشن", "الخصوص", "شبرا", "المرج", "العبور"],
    answer:
      "📍 فروع وزير الحلو في خدمتك دائماً:\n1. فرع الخصوص: موقف الخصوص الرئيسي - القليوبية\n2. فرع شبرا: شارع شبرا الرئيسي - القاهرة\n3. فرع المرج: ميدان المرج - القاهرة\n4. فرع العبور: الحي الترفيهي - مدينة العبور\n\nجميع الفروع تستقبلكم يومياً أو تطلب دليفري أونلاين!",
    chips: ["🕒 مواعيد العمل", "🛵 ما هي مدة وأسعار التوصيل؟"],
  },
  {
    keywords: ["توصيل", "دليفري", "طلب", "شحن", "طلبك", "مندوب", "سرعة"],
    answer:
      "🛵 خدمة التوصيل متوفرة لجميع المناطق:\n• مدة التوصيل: من 30 إلى 45 دقيقة كحد أقصى\n• تغليف حراري محكم يحافظ على برودة وجودة الحلويات\n• الدفع عند الاستلام متاح (نقدي أو فودافون كاش)\n• أضف طلبك للسلة هنا على الموقع أو راسلنا عبر واتساب!",
    chips: ["🔥 أحدث العروض والخصومات", "💬 تحدث مع موظف خدمة العملاء"],
  },
  {
    keywords: ["مواعيد", "وقت", "ساعة", "دوام", "شغالين", "مفتوح", "متى"],
    answer:
      "🕒 مواعيد عمل وزير الحلو:\nنعمل يومياً طوال أيام الأسبوع من الساعة 9:00 صباحاً وحتى 2:00 بعد منتصف الليل.\nخدمة التوصيل مستمرة حتى إغلاق الفروع!",
    chips: ["📍 أين تقع فروعكم؟", "🔥 أحدث العروض والخصومات"],
  },
  {
    keywords: ["أشهر", "اشهر", "مميز", "افضل", "قشطوطة", "حلويات", "كنافة", "بقلاوة", "منيو"],
    answer:
      "🍰 من أشهر وألذ إبداعات وزير الحلو:\n• قشطوطة وزير الأصلية (بالقشطة الطازجة والعسل والمكسرات)\n• كنافة محشوة بالفستق الحلبي المقرمش\n• تورتات وكيكات الشوكولاتة الغنية\n• آيس كريم الفواكه الطبيعي بدون مواد حافظة\n\nتفضل بزيارة صفحة «القائمة» لتصفح أكثر من 50 صنفاً شهياً!",
    chips: ["🔥 أحدث العروض والخصومات", "🛵 كيف أطلب الآن؟"],
  },
  {
    keywords: ["خدمة", "عملاء", "موظف", "انسان", "بشري", "شكوى", "مشكلة", "تواصل"],
    answer:
      "يسعدنا تواصلك المباشر مع فريق خدمة العملاء:\n📞 هاتفياً: 01222281651\n💬 واتساب مباشر: اضغط على زر الواتساب الأخضر بالأسفل للتحدث فوراً مع ممثل الخدمة!",
    chips: ["🔥 أحدث العروض والخصومات", "📍 أين تقع فروعكم؟"],
  },
];

function getBotReply(userText: string): { text: string; chips?: string[] | undefined } {
  const normalized = userText.toLowerCase().trim();
  for (const item of BOT_RESPONSES) {
    if (item.keywords.some((k) => normalized.includes(k))) {
      return { text: item.answer, chips: item.chips };
    }
  }
  return {
    text: "شكراً لتواصلك مع وزير الحلو! 🍰 يمكنك الاستفسار عن فروعنا، مواعيد العمل، العروض اليومية، أو التوصيل. كما يمكنك محادثة فريق الدعم مباشرة عبر واتساب.",
    chips: FAQ_CHIPS.slice(0, 4),
  };
}

export function StickyContactWidget() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "أهلاً بك في وزير الحلو! 🍰 يسعدني مساعدتك اليوم. اختر سؤالاً سريعاً أو اكتب أي استفسار تريده:",
      time: "الآن",
      chips: FAQ_CHIPS.slice(0, 4),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isTyping]);

  if (isAdmin) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: reply.text,
        time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        chips: reply.chips,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <aside
      aria-label="خيارات التواصل والمساعد الذكي"
      className="fixed bottom-20 lg:bottom-6 left-4 md:left-6 z-50 flex flex-col items-start gap-3"
      dir="rtl"
    >
      {/* ── Chatbot Window Popup ────────────────────────────────────────── */}
      {isChatOpen && (
        <div
          role="dialog"
          aria-labelledby="chatbot-title"
          className="relative mb-2 w-[calc(100vw-2rem)] sm:w-96 rounded-3xl border border-white/20 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col max-h-[520px] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-brand via-brand-deep to-primary p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative grid size-10 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
                  <Bot className="size-5 text-gold" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-brand" />
                </div>
                <div>
                  <h3 id="chatbot-title" className="text-sm font-black text-white flex items-center gap-1.5">
                    مساعد وزير الحلو الذكي
                    <Sparkles className="size-3.5 text-gold animate-spin-slow" />
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium">متصل الآن للإجابة على استفساراتك</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="إغلاق المحادثة"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-white dark:bg-slate-900 border border-border text-foreground rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</span>

                {/* Suggestions / Chips */}
                {m.chips && m.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="rounded-full bg-brand/5 dark:bg-brand/20 border border-brand/20 px-2.5 py-1 text-[11px] font-bold text-brand dark:text-gold hover:bg-brand hover:text-white transition-colors text-right"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-border rounded-2xl px-3 py-2 w-fit shadow-sm">
                <span className="size-1.5 rounded-full bg-brand animate-bounce" />
                <span className="size-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.2s]" />
                <span className="size-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Support Links in Footer */}
          <div className="px-3 py-1.5 bg-muted/60 border-t border-border flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium">أو تواصل فورياً:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/201222281651?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D8%B2%D9%8A%D8%B1%20%D8%A7%D9%84%D8%AD%D9%84%D9%88"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-bold text-emerald-600 hover:underline"
              >
                واتساب
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="tel:+201222281651" className="flex items-center gap-1 font-bold text-blue-600 hover:underline">
                01222281651
              </a>
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-background border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 bg-muted/60 border border-border rounded-full px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="grid size-9 place-items-center rounded-full bg-brand text-white shadow hover:bg-brand-deep disabled:opacity-40 transition-colors shrink-0"
              aria-label="إرسال"
            >
              <Send className="size-3.5 -scale-x-100" />
            </button>
          </form>
        </div>
      )}

      {/* ── Sticky Icons Stack ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-2.5">
        {/* 1. Chatbot Button */}
        <div className="group relative flex items-center">
          <button
            type="button"
            onClick={() => setIsChatOpen((prev) => !prev)}
            aria-label={isChatOpen ? "إغلاق المساعد الذكي" : "فتح المساعد الذكي لوزير الحلو"}
            className="relative grid size-12 place-items-center rounded-full bg-gradient-to-tr from-brand via-brand to-primary text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 ring-2 ring-white/80"
          >
            {isChatOpen ? (
              <ChevronDown className="size-6 text-white" />
            ) : (
              <>
                <Bot className="size-6 text-gold" />
                <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </>
            )}
          </button>
          {/* Tooltip to the right */}
          <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white shadow-xl whitespace-nowrap border border-white/10 z-50">
            {isChatOpen ? "إغلاق المحادثة" : "المساعد الذكي لوزير الحلو"}
          </span>
        </div>

        {/* 2. Direct Phone Call Button */}
        <div className="group relative flex items-center">
          <a
            href="tel:+201222281651"
            aria-label="اتصل بنا عبر الهاتف 01222281651"
            className="grid size-12 place-items-center rounded-full bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 ring-2 ring-white/80"
          >
            <PhoneCall className="size-5 text-white animate-pulse" />
          </a>
          {/* Tooltip to the right */}
          <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white shadow-xl whitespace-nowrap border border-white/10 z-50">
            <span>اتصل بنا:</span>
            <span dir="ltr">01222281651</span>
          </span>
        </div>

        {/* 3. WhatsApp Direct Button */}
        <div className="group relative flex items-center">
          <a
            href="https://wa.me/201222281651?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D8%B2%D9%8A%D8%B1%20%D8%A7%D9%84%D8%AD%D9%84%D9%88%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86..."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل معنا عبر واتساب"
            className="relative grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] hover:scale-110 active:scale-95 transition-all duration-300 ring-2 ring-white/80"
          >
            {/* WhatsApp SVG Icon */}
            <svg
              className="size-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
          {/* Tooltip to the right */}
          <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white shadow-xl whitespace-nowrap border border-white/10 z-50">
            تواصل عبر واتساب
          </span>
        </div>
      </div>
    </aside>
  );
}
