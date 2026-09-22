import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import emblemAsset from "@/assets/wazeer-emblem.png.asset.json";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="وزير الحلو">
      <img
        src={emblemAsset.url}
        alt="وزير الحلو - Wazeer ElHelw"
        className="h-11 w-auto object-contain"
        loading="eager"
      />
      <span className="sr-only">وزير الحلو</span>
      {light ? null : null}
    </Link>
  );
}
