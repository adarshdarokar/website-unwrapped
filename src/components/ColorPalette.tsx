import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, Droplets, Download } from 'lucide-react';
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

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success(`Copied ${color}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const downloadPalette = () => {
    const cssContent = `:root {
  /* Color Palette */
${uniqueColors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}
}

/* Tailwind CSS Classes */
${uniqueColors.map((color, i) => `.bg-palette-${i + 1} { background-color: ${color}; }`).join('\n')}
${uniqueColors.map((color, i) => `.text-palette-${i + 1} { color: ${color}; }`).join('\n')}
`;
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded color palette CSS');
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
          <Droplets className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        </motion.div>
        <p className="text-muted-foreground">No colors detected</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Colors might be in external CSS files
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Color Palette</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{uniqueColors.length} colors</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPalette}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSS</span>
        </motion.button>
      </div>

      {/* Main color grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 mb-4">
        {uniqueColors.map((color, index) => (
          <motion.button
            key={`${color}-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(color)}
            onMouseEnter={() => setHoveredColor(color)}
            onMouseLeave={() => setHoveredColor(null)}
            className="group relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ring-1 ring-border/20 hover:ring-primary/50"
            style={{ backgroundColor: color }}
            title={color}
          >
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
              animate={{ opacity: hoveredColor === color ? 1 : 0 }}
            >
              {copiedColor === color ? (
                <Check className="w-4 h-4 text-white drop-shadow-lg" />
              ) : (
                <Copy className="w-4 h-4 text-white drop-shadow-lg" />
              )}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Selected color details */}
      {hoveredColor && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-muted/30 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg ring-1 ring-border/30" 
              style={{ backgroundColor: hoveredColor }} 
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-mono">{hoveredColor}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{hexToRgb(hoveredColor)}</span>
                <span>{hexToHsl(hoveredColor)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick color list */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {uniqueColors.slice(0, 8).map((color, index) => (
          <motion.button
            key={`label-${color}-${index}`}
            whileHover={{ scale: 1.02 }}
            onClick={() => copyToClipboard(color)}
            className="flex items-center gap-1.5 px-2 py-1 bg-muted/30 rounded text-xs font-mono hover:bg-muted/50 transition-colors"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full ring-1 ring-border/30" 
              style={{ backgroundColor: color }} 
            />
            <span className="text-muted-foreground">{color}</span>
          </motion.button>
        ))}
        {uniqueColors.length > 8 && (
          <span className="px-2 py-1 text-xs text-muted-foreground">
            +{uniqueColors.length - 8}
          </span>
        )}
      </div>
    </motion.div>
  );
}
