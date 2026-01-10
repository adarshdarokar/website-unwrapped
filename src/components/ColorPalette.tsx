import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, Droplets } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPaletteProps {
  colors: string[];
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success(`Copied ${color} to clipboard!`, {
      icon: <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
    });
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const uniqueColors = [...new Set(colors)].slice(0, 24);

  if (uniqueColors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Droplets className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        </motion.div>
        <p className="text-muted-foreground text-lg">No colors detected</p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Colors might be defined in external CSS files
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
          whileHover={{ scale: 1.05, rotate: -5 }}
        >
          <Palette className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Color Palette</h3>
          <p className="text-sm text-muted-foreground">{uniqueColors.length} colors extracted</p>
        </div>
      </div>

      {/* Main color grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
        {uniqueColors.map((color, index) => (
          <motion.button
            key={`${color}-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(color)}
            onMouseEnter={() => setHoveredColor(color)}
            onMouseLeave={() => setHoveredColor(null)}
            className="group relative aspect-square rounded-xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 ring-2 ring-transparent hover:ring-primary/30"
            style={{ backgroundColor: color }}
            title={color}
          >
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
              animate={{ opacity: hoveredColor === color ? 1 : 0 }}
            >
              {copiedColor === color ? (
                <Check className="w-5 h-5 text-white drop-shadow-lg" />
              ) : (
                <Copy className="w-5 h-5 text-white drop-shadow-lg" />
              )}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Color details */}
      <motion.div 
        layout
        className="p-4 bg-muted/30 rounded-xl space-y-3"
      >
        <p className="text-sm font-medium">Color Values</p>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.slice(0, 6).map((color, index) => (
            <motion.button
              key={`label-${color}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => copyToClipboard(color)}
              className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg text-xs font-mono hover:bg-muted transition-colors cursor-pointer group"
            >
              <div 
                className="w-3 h-3 rounded-full ring-1 ring-border" 
                style={{ backgroundColor: color }} 
              />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {color}
              </span>
            </motion.button>
          ))}
          {uniqueColors.length > 6 && (
            <span className="text-xs px-3 py-1.5 text-muted-foreground">
              +{uniqueColors.length - 6} more
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
