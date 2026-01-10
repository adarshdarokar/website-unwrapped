import { motion } from 'framer-motion';
import { Type, Link } from 'lucide-react';

interface FontDisplayProps {
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
}

export function FontDisplay({ fonts }: FontDisplayProps) {
  const allFonts = fonts.detected.filter(f => 
    !['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded'].includes(f.toLowerCase())
  );

  if (allFonts.length === 0 && fonts.googleFonts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <Type className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No custom fonts detected</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Type className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Typography</h3>
          <p className="text-sm text-muted-foreground">{allFonts.length} fonts detected</p>
        </div>
      </div>

      <div className="space-y-4">
        {allFonts.map((font, index) => (
          <motion.div
            key={font}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-muted/50 rounded-xl"
          >
            <p className="text-sm text-muted-foreground mb-1">Font Family</p>
            <p 
              className="text-2xl truncate" 
              style={{ fontFamily: font }}
            >
              {font}
            </p>
            <p 
              className="text-sm text-muted-foreground mt-2" 
              style={{ fontFamily: font }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </motion.div>
        ))}
      </div>

      {fonts.googleFonts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Link className="w-4 h-4" />
            Google Fonts
          </p>
          <div className="space-y-2">
            {fonts.googleFonts.map((url, index) => (
              <motion.a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="block text-xs text-primary hover:underline truncate"
              >
                {url}
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
