import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Printer } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart";
import { DELIVERY_FEE } from "@/data/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب | وزير الحلو" },
      { name: "description", content: "أكمل بيانات التوصيل واختر طريقة الدفع لإتمام طلبك من وزير الحلو." },
      { property: "og:title", content: "إتمام الطلب | وزير الحلو" },
      { property: "og:description", content: "بيانات التوصيل وطرق الدفع وتأكيد الطلب." },
    ],
  }),
  component: CheckoutPage,
});

const steps = ["بياناتك", "التوصيل", "الدفع", "التأكيد"];

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [type, setType] = useState("delivery");
  const [payment, setPayment] = useState("cod");
  const fee = type === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;
  const orderId = "WZ-10249";
  const [invoice, setInvoice] = useState<{
    items: typeof items;
    subtotal: number;
    fee: number;
    total: number;
    type: string;
    payment: string;
    date: string;
  } | null>(null);

  const next = () => {
    if (step === 2) {
      setInvoice({
        items,
        subtotal,
        fee,
        total,
        type,
        payment,
        date: new Date().toLocaleDateString("ar-EG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      });
      clear();
      toast.success("تم استلام طلبك بنجاح");
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const paymentLabel =
    invoice?.payment === "cod"
      ? "الدفع عند الاستلام"
      : invoice?.payment === "wallet"
        ? "محفظة إلكترونية"
        : "بطاقة بنكية";

  return (
    <>
      <PageHero title="إتمام الطلب" subtitle="خطوات بسيطة ويوصلك الحلو لباب البيت" />

      <section className="section-y">
        <div className="container-page">
          <ol className="mb-8 grid gap-2 sm:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s}
                className={`rounded-2xl border p-3 text-center text-sm font-bold ${
                  i <= step
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {i + 1}. {s}
              </li>
            ))}
          </ol>

          {step === 3 ? (
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex items-center justify-center gap-3 text-center">
                <CheckCircle2 className="size-8 text-fresh" />
                <div className="text-start">
                  <h2 className="text-xl font-bold text-brand">تم تأكيد طلبك بنجاح</h2>
                  <p className="text-sm text-muted-foreground">سنتواصل معك لتأكيد العنوان قبل التجهيز.</p>
                </div>
              </div>

              {/* Invoice */}
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
                {/* Invoice header */}
                <div className="brand-gradient px-6 py-5 text-primary-foreground">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emblemLight}
                        alt="وزير الحلو"
                        className="h-12 w-auto object-contain"
                        loading="eager"
                      />
                      <p className="text-xs opacity-80">فاتورة طلب</p>
                    </div>
                    <div className="text-end text-xs leading-5 opacity-90">
                      <p>
                        رقم الفاتورة: <span dir="ltr" className="font-bold">{orderId}</span>
                      </p>
                      <p>التاريخ: {invoice?.date}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Meta */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">طريقة الاستلام</p>
                      <p className="mt-1 text-sm font-bold text-brand">
                        {invoice?.type === "delivery" ? "توصيل للمنزل" : "استلام من الفرع"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">طريقة الدفع</p>
                      <p className="mt-1 text-sm font-bold text-brand">{paymentLabel}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">حالة الطلب</p>
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-0.5 text-xs font-bold text-gold-foreground">
                        قيد التجهيز
                      </p>
                    </div>
                  </div>

                  {/* Items table */}
                  <table className="mt-6 w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="pb-2 text-start font-semibold">الصنف</th>
                        <th className="pb-2 text-center font-semibold">الكمية</th>
                        <th className="pb-2 text-center font-semibold">السعر</th>
                        <th className="pb-2 text-end font-semibold">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice?.items.map((i) => (
                        <tr key={i.id} className="border-b border-dashed border-border">
                          <td className="py-3 font-semibold text-brand">{i.name}</td>
                          <td className="py-3 text-center text-muted-foreground">{i.qty}</td>
                          <td className="py-3 text-center text-muted-foreground">{i.price} ج.م</td>
                          <td className="py-3 text-end font-bold text-brand">{i.qty * i.price} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span className="font-semibold">{invoice?.subtotal} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رسوم التوصيل</span>
                      <span className="font-semibold">
                        {invoice?.fee ? `${invoice.fee} ج.م` : "مجانًا"}
                      </span>
                    </div>
                    <div className="flex justify-between rounded-2xl bg-primary/10 px-4 py-3 text-base font-extrabold text-primary">
                      <span>الإجمالي المستحق</span>
                      <span>{invoice?.total} ج.م</span>
                    </div>
                  </div>

                  <p className="mt-6 border-t border-dashed border-border pt-4 text-center text-xs text-muted-foreground">
                    شكرًا لطلبك من وزير الحلو — حلويات تليق بالوزرا 🍰
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  variant="hero"
                  onClick={() => navigate({ to: "/orders/$id", params: { id: orderId } })}
                >
                  تتبع الطلب
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="size-4" />
                  طباعة الفاتورة
                </Button>
                <Button asChild variant="outline">
                  <Link to="/menu">مواصلة التسوق</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                {step === 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cname">الاسم</Label>
                      <Input id="cname" placeholder="اكتب اسمك" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cphone">رقم الهاتف</Label>
                      <Input id="cphone" dir="ltr" placeholder="+20 1XX XXX XXXX" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cnotes">ملاحظات للطلب</Label>
                      <Textarea id="cnotes" placeholder="مثال: بدون مكسرات" />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <RadioGroup value={type} onValueChange={setType} className="grid gap-3 sm:grid-cols-2">
                      {[
                        { v: "delivery", t: "توصيل للمنزل", d: `رسوم ${DELIVERY_FEE} ج.م` },
                        { v: "pickup", t: "استلام من الفرع", d: "بدون رسوم" },
                      ].map((o) => (
                        <Label
                          key={o.v}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4"
                        >
                          <RadioGroupItem value={o.v} />
                          <span>
                            <span className="block font-bold text-brand">{o.t}</span>
                            <span className="block text-xs text-muted-foreground">{o.d}</span>
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                    {type === "delivery" ? (
                      <div className="space-y-2">
                        <Label htmlFor="addr">العنوان بالتفصيل</Label>
                        <Textarea id="addr" placeholder="المنطقة، الشارع، رقم العقار، الدور" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>اختر الفرع</Label>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {["الخصوص", "شبرا", "المرج"].map((b) => (
                            <span
                              key={b}
                              className="rounded-xl border border-border p-3 text-center text-sm font-semibold text-brand"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <RadioGroup value={payment} onValueChange={setPayment} className="grid gap-3">
                    {[
                      { v: "cod", t: "الدفع عند الاستلام" },
                      { v: "wallet", t: "محفظة إلكترونية" },
                      { v: "card", t: "بطاقة بنكية" },
                    ].map((o) => (
                      <Label
                        key={o.v}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 font-bold text-brand"
                      >
                        <RadioGroupItem value={o.v} />
                        {o.t}
                      </Label>
                    ))}
                  </RadioGroup>
                )}

                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="outline"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    السابق
                  </Button>
                  <Button variant="hero" onClick={next}>
                    {step === 2 ? "تأكيد الطلب" : "التالي"}
                  </Button>
                </div>
              </div>

              <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h2 className="font-bold text-brand">ملخص الطلب</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {items.length === 0 && <li className="text-muted-foreground">السلة فارغة</li>}
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-3">
                      <span className="text-muted-foreground">
                        {i.name} × {i.qty}
                      </span>
                      <span className="font-semibold text-brand">{i.qty * i.price} ج.م</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع</span>
                    <span className="font-semibold">{subtotal} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التوصيل</span>
                    <span className="font-semibold">{fee} ج.م</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-primary">
                    <span>الإجمالي</span>
                    <span>{total} ج.م</span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
