import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="وزير الحلو">
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl text-lg font-extrabold shadow-[var(--shadow-card)]",
          light ? "bg-gold text-gold-foreground" : "bg-brand text-brand-foreground",
        )}
      >
        و
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block text-lg font-extrabold",
            light ? "text-brand-foreground" : "text-brand",
          )}
        >
          وزير الحلو
        </span>
        <span
          className={cn(
            "block text-[10px] font-semibold tracking-[0.2em]",
            light ? "text-gold" : "text-primary",
          )}
        >
          WAZEER ELHELW
        </span>
      </span>
    </Link>
  );
}
