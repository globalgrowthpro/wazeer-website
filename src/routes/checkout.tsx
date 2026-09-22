import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
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

  const next = () => {
    if (step === 2) {
      clear();
      toast.success("تم استلام طلبك بنجاح");
    }
    setStep((s) => Math.min(s + 1, 3));
  };

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
            <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
              <CheckCircle2 className="mx-auto size-14 text-fresh" />
              <h2 className="mt-4 text-xl font-bold text-brand">تم تأكيد طلبك</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                رقم الطلب <span dir="ltr">{orderId}</span> — سنتواصل معك لتأكيد العنوان.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  variant="hero"
                  onClick={() => navigate({ to: "/orders/$id", params: { id: orderId } })}
                >
                  تتبع الطلب
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
