import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import aboutStore from "@/assets/about-store.jpg";
import heroCake from "@/assets/hero-cake.jpg";
import { categories } from "@/data/menu";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "ألبوم الصور | وزير الحلو" },
      {
        name: "description",
        content: "شاهد صور أصنافنا من الحلويات والكيك والمشروبات وصور فروع وزير الحلو.",
      },
      { property: "og:title", content: "ألبوم الصور | وزير الحلو" },
      { property: "og:description", content: "صور أصناف وفروع وزير الحلو." },
    ],
  }),
  component: GalleryPage,
});

const filters = [
  { id: "all", name: "الكل" },
  { id: "sweets", name: "الحلويات" },
  { id: "cake", name: "الكيك" },
  { id: "drinks", name: "المشروبات" },
  { id: "branches", name: "الفروع" },
];

const images = [
  { src: heroCake, group: "sweets", alt: "كنافة بالشوكولاتة" },
  { src: categories[0].image, group: "sweets", alt: "قشطوطة" },
  { src: categories[1].image, group: "sweets", alt: "آيس كريم" },
  { src: categories[2].image, group: "cake", alt: "كيك شوكولاتة" },
  { src: categories[3].image, group: "sweets", alt: "حلويات شرقية" },
  { src: categories[4].image, group: "sweets", alt: "أطباق رئيسية" },
  { src: categories[5].image, group: "drinks", alt: "مشروبات" },
  { src: aboutStore, group: "branches", alt: "فرع وزير الحلو" },
  { src: heroCake, group: "cake", alt: "كيك مميز" },
];

function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const shown = images.filter((i) => filter === "all" || i.group === filter);

  return (
    <>
      <PageHero title="ألبوم الصور" subtitle="لمحة من أصنافنا وفروعنا" />

      <section className="section-y">
        <div className="container-page">
          <div className="no-scrollbar -mx-4 mb-7 flex justify-start gap-2 overflow-x-auto px-4 md:mx-0 md:justify-center md:px-0">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  filter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {shown.map((img, i) => (
              <button
                key={`${img.alt}-${i}`}
                onClick={() => setLightbox(img.src)}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-[var(--shadow-card)]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-brand/80 to-transparent p-3 text-sm font-bold text-brand-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {img.alt}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="إغلاق"
            className="absolute top-5 end-5 grid size-10 place-items-center rounded-full bg-white/15 text-white"
            onClick={() => setLightbox(null)}
          >
            <X />
          </button>
          <img
            src={lightbox}
            alt="عرض الصورة"
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </>
  );
}
