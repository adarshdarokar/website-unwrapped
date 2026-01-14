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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
          <Type className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Typography</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {allFonts.length + uniqueGoogleFonts.length} fonts discovered
          </p>
        </div>
      </div>

      {/* Google Fonts with live preview */}
      {uniqueGoogleFonts.length > 0 && (
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Google Fonts
          </p>
          <div className="space-y-3">
            {uniqueGoogleFonts.map((font, index) => (
              <motion.div
                key={font}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{font}</span>
                    {loadedFonts.has(font) && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full">
                        Loaded
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyFontName(font)}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="Copy font name"
                    >
                      {copiedFont === font ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadFontCSS(font)}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="Download CSS"
                    >
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    </motion.button>
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
                
                {/* Font Preview - only show when loaded */}
                <div 
                  className="space-y-1"
                  style={{ 
                    fontFamily: loadedFonts.has(font) ? `"${font}", sans-serif` : 'inherit',
                    opacity: loadedFonts.has(font) ? 1 : 0.5
                  }}
                >
                  <p className="text-xl sm:text-2xl font-medium">
                    {font}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Detected fonts */}
      {allFonts.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium flex items-center gap-2">
            <Type className="w-4 h-4" />
            CSS Font Families
          </p>
          <div className="grid gap-2">
            {allFonts.slice(0, 6).map((font, index) => (
              <motion.button
                key={font}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => copyFontName(font)}
                className="p-3 bg-muted/30 rounded-lg text-left hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Font Family</p>
                    <p className="text-sm font-medium truncate">{font}</p>
                  </div>
                  {copiedFont === font ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {fonts.googleFonts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <p className="text-xs text-muted-foreground">
            {fonts.googleFonts.length} Google Font stylesheet{fonts.googleFonts.length > 1 ? 's' : ''} detected
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
