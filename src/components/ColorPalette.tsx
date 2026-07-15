import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, Droplets, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLazyList } from '@/hooks/useLazyList';

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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const uniqueColors = [...new Set(colors)];
  const { visible: visibleColors, hasMore, loadMore, nextChunk, remaining, total } = useLazyList(uniqueColors, 30, 30);



  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success(`Copied ${color}`);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const downloadPalette = () => {
    const cssContent = `:root {
${uniqueColors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}
}`;
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.css';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded palette');
  };

  if (uniqueColors.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <Droplets className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No colors detected</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium">Colors</h3>
          <p className="text-xs text-muted-foreground">Showing {visibleColors.length} of {total}</p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={downloadPalette}
          className="h-8 gap-1.5 text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4">
        {visibleColors.map((color, index) => (
          <motion.button
            key={`${color}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(index % 30, 12) * 0.02 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(color)}
            onMouseEnter={() => setSelectedColor(color)}
            onMouseLeave={() => setSelectedColor(null)}
            className="aspect-square rounded-lg relative overflow-hidden ring-1 ring-border/20 hover:ring-primary/50 transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: color }}
          >
            {copiedColor === color && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {hasMore && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Show {nextChunk} more ({remaining} left)
          </button>
        </div>
      )}

      {/* Color Details */}
      {selectedColor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 bg-muted/30 rounded-lg flex items-center gap-3"
        >
          <div 
            className="w-10 h-10 rounded-lg ring-1 ring-border/20 flex-shrink-0" 
            style={{ backgroundColor: selectedColor }} 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-mono truncate">{selectedColor}</p>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {hexToRgb(selectedColor)}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(selectedColor)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>
      )}

      {/* Color Labels */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {uniqueColors.slice(0, 6).map((color, index) => (
          <button
            key={`label-${color}-${index}`}
            onClick={() => copyToClipboard(color)}
            className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md text-xs font-mono hover:bg-muted transition-colors"
          >
            <div
              className="w-2.5 h-2.5 rounded-full ring-1 ring-border/30"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">{color}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
