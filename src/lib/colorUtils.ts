// Color utility functions for analysis and conversions

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function formatHsl(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return '';
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function formatRgb(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '';
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

export function getColorName(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return 'Unknown';

  const { h, s, l } = hsl;

  // Check for achromatic colors first
  if (s < 10) {
    if (l < 15) return 'Black';
    if (l < 30) return 'Dark Gray';
    if (l < 70) return 'Gray';
    if (l < 90) return 'Light Gray';
    return 'White';
  }

  // Color names based on hue
  let colorName = '';
  if (h < 15 || h >= 345) colorName = 'Red';
  else if (h < 45) colorName = 'Orange';
  else if (h < 75) colorName = 'Yellow';
  else if (h < 150) colorName = 'Green';
  else if (h < 210) colorName = 'Cyan';
  else if (h < 270) colorName = 'Blue';
  else if (h < 315) colorName = 'Purple';
  else colorName = 'Pink';

  // Add modifiers based on saturation and lightness
  if (l < 25) return `Dark ${colorName}`;
  if (l > 80) return `Light ${colorName}`;
  if (s < 40) return `Muted ${colorName}`;
  if (s > 80) return `Vivid ${colorName}`;

  return colorName;
}

export function groupColorsByHue(colors: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {
    'Reds': [],
    'Oranges': [],
    'Yellows': [],
    'Greens': [],
    'Cyans': [],
    'Blues': [],
    'Purples': [],
    'Pinks': [],
    'Neutrals': [],
  };

  colors.forEach((hex) => {
    const hsl = hexToHsl(hex);
    if (!hsl) return;

    if (hsl.s < 10) {
      groups['Neutrals'].push(hex);
      return;
    }

    const { h } = hsl;
    if (h < 15 || h >= 345) groups['Reds'].push(hex);
    else if (h < 45) groups['Oranges'].push(hex);
    else if (h < 75) groups['Yellows'].push(hex);
    else if (h < 150) groups['Greens'].push(hex);
    else if (h < 210) groups['Cyans'].push(hex);
    else if (h < 270) groups['Blues'].push(hex);
    else if (h < 315) groups['Purples'].push(hex);
    else groups['Pinks'].push(hex);
  });

  // Filter out empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, colors]) => colors.length > 0)
  );
}
