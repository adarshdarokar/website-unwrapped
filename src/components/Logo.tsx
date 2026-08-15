import logoFull from "@/assets/logo-webvision-full@1x.png";
import logoFull2x from "@/assets/logo-webvision-full.png";
import { cn } from "@/lib/utils";

/** Intrinsic aspect ratio of the original, uncropped logo artwork (1010 x 636). */
const LOGO_ASPECT = 1010 / 636;

interface LogoProps {
  /**
   * Rendered height in CSS pixels. Width is derived from the artwork's intrinsic
   * aspect ratio so the whole image is always visible — never cropped or zoomed.
   */
  height?: number;
  /** Backwards-compatible alias for `height`. */
  size?: number;
  /** Fill the available width instead of locking to a fixed height (auto height). */
  fitWidth?: boolean;
  className?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * The complete, original WebVision logo artwork. Rendered edge-to-edge with
 * `object-contain` and its native aspect ratio: nothing is cropped, zoomed or
 * redrawn. The container adapts to the image, not the other way around.
 */
export function Logo({
  height,
  size,
  fitWidth = false,
  className,
  alt = "web-vision",
  priority = false,
}: LogoProps) {
  const h = height ?? size ?? 28;
  const w = Math.round(h * LOGO_ASPECT);

  return (
    <img
      src={logoFull}
      srcSet={`${logoFull} 1x, ${logoFull2x} 2x`}
      width={w}
      height={h}
      style={
        fitWidth
          ? { width: "100%", height: "auto", aspectRatio: `${LOGO_ASPECT}` }
          : { height: h, width: w, maxWidth: "100%", aspectRatio: `${LOGO_ASPECT}` }
      }
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
