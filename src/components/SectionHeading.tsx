export function SectionHeading({
  title,
  subtitle,
  light = false,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-8 text-center">
      <h2
        className={`heading-underline text-2xl md:text-4xl ${light ? "text-brand-foreground" : "text-brand"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm md:text-base ${light ? "text-brand-foreground/75" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
