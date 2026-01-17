import { useMemo } from 'react';

export interface AnalysisResult {
  url: string;
  score: number;
  images: { src: string; alt: string }[];
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
  colors: string[];
  icons: {
    svgCount: number;
    svgs: string[];
    libraries: string[];
  };
  animations: {
    cssAnimations: string[];
    transitions: string[];
    keyframes: string[];
  };
  meta: {
    hasViewport: boolean;
    hasPreload: boolean;
    hasPreconnect: boolean;
    isHttps: boolean;
    imageCount: number;
    hasResponsiveImages: boolean;
  };
}

interface AnalysisStats {
  colorCount: number;
  uniqueColors: string[];
  fontCount: number;
  imageCount: number;
  imagesWithAlt: number;
  altTextPercentage: number;
  animationCount: number;
  iconCount: number;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
}

export function useAnalysisStats(result: AnalysisResult | null): AnalysisStats | null {
  return useMemo(() => {
    if (!result) return null;

    const uniqueColors = [...new Set(result.colors)];
    const fontCount = result.fonts.detected.length + result.fonts.googleFonts.length;
    const imagesWithAlt = result.images.filter(img => img.alt && img.alt.trim() !== '').length;
    const altTextPercentage = result.images.length > 0 
      ? Math.round((imagesWithAlt / result.images.length) * 100) 
      : 100;
    const animationCount = result.animations.cssAnimations.length + 
      result.animations.transitions.length + 
      result.animations.keyframes.length;

    // Calculate performance score
    let perfScore = 50;
    if (result.meta.isHttps) perfScore += 15;
    if (result.meta.hasViewport) perfScore += 10;
    if (result.meta.hasPreload) perfScore += 10;
    if (result.meta.hasPreconnect) perfScore += 10;
    if (result.meta.hasResponsiveImages) perfScore += 5;
    perfScore = Math.min(100, perfScore);

    // Calculate accessibility score
    let a11yScore = 40;
    if (altTextPercentage >= 80) a11yScore += 25;
    else if (altTextPercentage >= 50) a11yScore += 15;
    if (result.meta.hasViewport) a11yScore += 20;
    if (fontCount > 0 && fontCount <= 3) a11yScore += 15;
    a11yScore = Math.min(100, a11yScore);

    // Calculate SEO score
    let seoScore = 30;
    if (result.meta.isHttps) seoScore += 25;
    if (result.meta.hasViewport) seoScore += 20;
    if (altTextPercentage >= 80) seoScore += 15;
    if (result.meta.hasPreload || result.meta.hasPreconnect) seoScore += 10;
    seoScore = Math.min(100, seoScore);

    return {
      colorCount: uniqueColors.length,
      uniqueColors,
      fontCount,
      imageCount: result.images.length,
      imagesWithAlt,
      altTextPercentage,
      animationCount,
      iconCount: result.icons.svgCount,
      performanceScore: perfScore,
      accessibilityScore: a11yScore,
      seoScore,
    };
  }, [result]);
}
