import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, ExternalLink, Download, Check, Copy, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useLazyList } from '@/hooks/useLazyList';

interface FontDisplayProps {
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
}

const SYSTEM_FONTS = new Set(
  [
    // generic families
    'sans-serif',
    'serif',
    'monospace',
    'cursive',
    'fantasy',

    // css/system ui keywords
    'system-ui',
    'ui-sans-serif',
    'ui-serif',
    'ui-monospace',
    'ui-rounded',

    // common stacks
    '-apple-system',
    'blinkmacsystemfont',
    'segoe ui',
    'roboto',
    'helvetica',
    'helvetica neue',
    'arial',
    'noto sans',
    'ubuntu',
    'cantarell',
    'open sans',
    'verdana',
    'tahoma',
    'trebuchet ms',
    'georgia',
    'times',
    'times new roman',
    'courier',
    'courier new',

    // apple fonts frequently present but not “custom”
    'sf pro display',
    'sf pro text',
    'sf mono',
  ].map((s) => s.toLowerCase())
);

function normalizeFontName(input: string) {
  return input
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, ' ');
}

function isSystemOrGenericFont(font: string) {
  const f = normalizeFontName(font).toLowerCase();
  if (!f) return true;
  if (SYSTEM_FONTS.has(f)) return true;
  if (f.startsWith('var(')) return true;
  // ignore pure fallbacks like "inherit" etc.
  if (['inherit', 'initial', 'unset', 'auto'].includes(f)) return true;
  return false;
}

export function FontDisplay({ fonts }: FontDisplayProps) {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [copiedFont, setCopiedFont] = useState<string | null>(null);

  // Extract font names from Google Font URLs
  const uniqueGoogleFonts = useMemo(() => {
    const googleFontNames = fonts.googleFonts
      .map((url) => {
        const match = url.match(/family=([^&:]+)/);
        return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
      })
      .filter(Boolean) as string[];

    return [...new Set(googleFontNames.map(normalizeFontName))];
  }, [fonts.googleFonts]);

  // Keep only truly “custom” CSS fonts by filtering common system stacks.
  const customDetectedFonts = useMemo(() => {
    const cleaned = fonts.detected.map(normalizeFontName).filter(Boolean);
    const dedup = new Map<string, string>();

    for (const f of cleaned) {
      if (isSystemOrGenericFont(f)) continue;
      const key = f.toLowerCase();
      if (!dedup.has(key)) dedup.set(key, f);
    }

    return Array.from(dedup.values());
  }, [fonts.detected]);

  // Load Google Fonts dynamically
  useEffect(() => {
    uniqueGoogleFonts.forEach((font) => {
      if (!font) return;
      const id = `google-font-${font.toLowerCase().replace(/\s+/g, '-')}`;
      if (document.getElementById(id)) return;

      const link = document.createElement('link');
      link.id = id;
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      link.onload = () => setLoadedFonts((prev) => new Set([...prev, font]));
      document.head.appendChild(link);
    });
  }, [uniqueGoogleFonts]);

  const copyFontName = (font: string) => {
    navigator.clipboard.writeText(font);
    setCopiedFont(font);
    toast.success(`Copied "${font}" to clipboard`);
    setTimeout(() => setCopiedFont(null), 2000);
  };

  const downloadFontCSS = (font: string) => {
    const cssContent = `@import url('https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap');

/* Usage example */
.your-class {
  font-family: '${font}', sans-serif;
}`;

    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${font.toLowerCase().replace(/\s+/g, '-')}.css`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${font} CSS`);
  };

  if (customDetectedFonts.length === 0 && uniqueGoogleFonts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Type className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        </motion.div>
        <p className="text-muted-foreground">No custom fonts detected</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          System fonts and generic fallbacks are hidden
        </p>
      </motion.div>
    );
  }

  const total = customDetectedFonts.length + uniqueGoogleFonts.length;
  const gf = useLazyList(uniqueGoogleFonts, 30, 30);
  const cf = useLazyList(customDetectedFonts, 30, 30);



  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h3 className="text-sm font-medium">Typography</h3>
          <p className="text-xs text-muted-foreground">
            {total} custom font{total === 1 ? '' : 's'}
          </p>
        </div>
        <div className="text-[11px] text-muted-foreground bg-muted/30 border border-border rounded-full px-2 py-1">
          System stacks hidden
        </div>
      </div>

      {/* Google Fonts */}
      {uniqueGoogleFonts.length > 0 && (
        <div className="space-y-3 mb-5">
          {uniqueGoogleFonts.map((font, index) => (
            <motion.div
              key={font}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-muted/30 rounded-lg border border-border/60"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{font}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyFontName(font)}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                  >
                    {copiedFont === font ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => downloadFontCSS(font)}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <a
                    href={`https://fonts.google.com/specimen/${font.replace(/\s+/g, '+')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                </div>
              </div>

              <div
                style={{
                  fontFamily: loadedFonts.has(font)
                    ? `"${font}", sans-serif`
                    : 'inherit',
                }}
              >
                <p className="text-lg font-medium">The quick brown fox</p>
                <p className="text-sm text-muted-foreground">
                  Jumps over the lazy dog • 0123456789
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Custom CSS Fonts */}
      {customDetectedFonts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customDetectedFonts.slice(0, 10).map((font, index) => (
            <motion.button
              key={font}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              onClick={() => copyFontName(font)}
              className="px-3 py-1.5 bg-muted/50 rounded-full text-xs font-medium hover:bg-muted transition-colors border border-border/60"
            >
              {font}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

