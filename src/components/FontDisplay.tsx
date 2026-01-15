import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, ExternalLink, Sparkles, Download, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface FontDisplayProps {
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
}

export function FontDisplay({ fonts }: FontDisplayProps) {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [copiedFont, setCopiedFont] = useState<string | null>(null);

  const allFonts = fonts.detected.filter(f => 
    !['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans'].includes(f.toLowerCase()) &&
    !f.includes('var(')
  );

  // Extract font names from Google Font URLs
  const googleFontNames = fonts.googleFonts.map(url => {
    const match = url.match(/family=([^&:]+)/);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  }).filter(Boolean) as string[];

  const uniqueGoogleFonts = [...new Set(googleFontNames)];

  // Load Google Fonts dynamically
  useEffect(() => {
    uniqueGoogleFonts.forEach(font => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      link.onload = () => {
        setLoadedFonts(prev => new Set([...prev, font]));
      };
      document.head.appendChild(link);
    });
  }, [uniqueGoogleFonts.join(',')]);

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

  if (allFonts.length === 0 && uniqueGoogleFonts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Type className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        </motion.div>
        <p className="text-muted-foreground">No custom fonts detected</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          The website might be using system fonts
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium">Typography</h3>
          <p className="text-xs text-muted-foreground">{allFonts.length + uniqueGoogleFonts.length} fonts</p>
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
              className="p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{font}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyFontName(font)}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                  >
                    {copiedFont === font ? (
                      <Check className="w-3.5 h-3.5 text-success" />
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
              
              <div style={{ fontFamily: loadedFonts.has(font) ? `"${font}", sans-serif` : 'inherit' }}>
                <p className="text-lg font-medium">{font}</p>
                <p className="text-sm text-muted-foreground">The quick brown fox jumps over the lazy dog</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CSS Fonts */}
      {allFonts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allFonts.slice(0, 8).map((font, index) => (
            <motion.button
              key={font}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              onClick={() => copyFontName(font)}
              className="px-3 py-1.5 bg-muted/50 rounded-full text-xs font-medium hover:bg-muted transition-colors"
            >
              {font}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
