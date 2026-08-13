import logo64 from "@/assets/logo-vision-64.webp";
import logo128 from "@/assets/logo-vision-128.webp";
import logo256 from "@/assets/logo-vision-256.webp";
import logoFallback from "@/assets/logo-vision.jpg";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Rendered CSS pixel size (square). Used for width/height attrs to enable crisp rendering. */
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * Crisp, retina-aware WebVision logo.
 * Uses srcset with density descriptors so the browser picks the sharpest variant
 * for the device pixel ratio (1x / 2x / 3x) without blurring on high-DPI screens.
 */
export function Logo({ size = 32, className, alt = "WebVision logo", priority = false }: LogoProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${logo64} 1x, ${logo128} 2x, ${logo256} 3x`}
      />
      <img
        src={logoFallback}
        srcSet={`${logo64} 1x, ${logo128} 2x, ${logo256} 3x`}
        width={size}
        height={size}
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        // @ts-expect-error fetchpriority is a valid HTML attribute
        fetchpriority={priority ? "high" : "auto"}
        draggable={false}
        className={cn("w-full h-full object-cover select-none", className)}
        style={{ imageRendering: "auto" }}
      />
    </picture>
  );
}
