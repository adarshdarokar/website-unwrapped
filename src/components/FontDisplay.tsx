import { motion } from 'framer-motion';
import { Type, Link, ExternalLink, Sparkles } from 'lucide-react';

interface FontDisplayProps {
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
}

export function FontDisplay({ fonts }: FontDisplayProps) {
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
          <Type className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        </motion.div>
        <p className="text-muted-foreground text-lg">No custom fonts detected</p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          The website might be using system fonts
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <Type className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Typography</h3>
          <p className="text-sm text-muted-foreground">
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
          {uniqueGoogleFonts.map((font, index) => (
            <motion.div
              key={font}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-xl border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary">{font}</span>
                <a
                  href={`https://fonts.google.com/specimen/${font.replace(/\s+/g, '+')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <link href={`https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap`} rel="stylesheet" />
              <p 
                className="text-2xl mb-1" 
                style={{ fontFamily: `"${font}", sans-serif` }}
              >
                {font}
              </p>
              <p 
                className="text-sm text-muted-foreground" 
                style={{ fontFamily: `"${font}", sans-serif` }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detected fonts */}
      {allFonts.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium flex items-center gap-2">
            <Type className="w-4 h-4" />
            CSS Font Families
          </p>
          <div className="grid gap-3">
            {allFonts.slice(0, 6).map((font, index) => (
              <motion.div
                key={font}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-3 bg-muted/30 rounded-xl"
              >
                <p className="text-sm text-muted-foreground mb-1">Font Family</p>
                <p className="text-lg font-medium truncate">{font}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {fonts.googleFonts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-border/50"
        >
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Link className="w-3 h-3" />
            {fonts.googleFonts.length} Google Font stylesheet{fonts.googleFonts.length > 1 ? 's' : ''} detected
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
