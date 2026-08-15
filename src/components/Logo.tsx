import logoWordmark from "@/assets/logo-webvision-wordmark.png";
import logoWordmark2x from "@/assets/logo-webvision-wordmark@2x.png";
import { cn } from "@/lib/utils";

/** Intrinsic aspect ratio of the full web-vision lockup (icon + wordmark). */
const LOGO_ASPECT = 167 / 40;

interface LogoProps {
  /**
   * Rendered height in CSS pixels. Width is derived from the logo's intrinsic
   * aspect ratio so the full lockup is never cropped, stretched or squashed.
   */
  height?: number;
  /** Backwards-compatible alias for `height`. */
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * The complete WebVision logo lockup: purple circular mark + "web-vision" text.
 * Always rendered whole (object-contain), retina-aware via srcSet, and sized by
 * height so it stays readable and undistorted at every breakpoint and DPR.
 */
export function Logo({
  height,
  size,
  className,
  alt = "web-vision",
  priority = false,
}: LogoProps) {
  const h = height ?? size ?? 28;
  const w = Math.round(h * LOGO_ASPECT);

  return (
    <img
      src={logoWordmark}
      srcSet={`${logoWordmark} 1x, ${logoWordmark2x} 3x`}
      width={w}
      height={h}
      style={{ height: h, width: "auto", maxWidth: "100%", aspectRatio: `${LOGO_ASPECT}` }}
      alt={alt}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      // @ts-expect-error fetchpriority is a valid HTML attribute
      fetchpriority={priority ? "high" : "auto"}
      draggable={false}
      className={cn("block object-contain select-none shrink-0", className)}
    />
  );
}
