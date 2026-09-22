export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="brand-gradient text-brand-foreground">
      <div className="container-page py-12 text-center md:py-16">
        <h1 className="text-2xl md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-sm text-brand-foreground/80 md:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
