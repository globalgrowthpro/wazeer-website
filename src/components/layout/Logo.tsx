import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import emblemDark from "@/assets/wazeer-emblem.png";
import emblemLight from "@/assets/wazeer-emblem-light.png";

interface LogoProps {
  light?: boolean;
  className?: string;
  imgClassName?: string;
}

export function Logo({ light = false, className, imgClassName }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center transition-opacity hover:opacity-90", className)}
      aria-label="وزير الحلو"
    >
      <img
        src={light ? emblemLight : emblemDark}
        alt={light ? "وزير الحلو" : "وزير الحلو - Wazeer ElHelw"}
        className={cn("h-11 w-auto object-contain", imgClassName)}
        loading="eager"
      />
    </Link>
  );
}
