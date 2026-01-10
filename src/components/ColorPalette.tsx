import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPaletteProps {
  colors: string[];
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success(`Copied ${color} to clipboard`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Filter out duplicates and very similar colors
  const uniqueColors = [...new Set(colors)].slice(0, 20);

  if (uniqueColors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No colors detected</p>
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
          <Palette className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Color Palette</h3>
          <p className="text-sm text-muted-foreground">{uniqueColors.length} colors found</p>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {uniqueColors.map((color, index) => (
          <motion.button
            key={`${color}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => copyToClipboard(color)}
            className="group relative aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
            style={{ backgroundColor: color }}
            title={color}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
              {copiedColor === color ? (
                <Check className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {uniqueColors.slice(0, 8).map((color, index) => (
          <motion.span
            key={`label-${color}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="text-xs px-2 py-1 bg-muted rounded-md font-mono"
          >
            {color}
          </motion.span>
        ))}
        {uniqueColors.length > 8 && (
          <span className="text-xs px-2 py-1 text-muted-foreground">
            +{uniqueColors.length - 8} more
          </span>
        )}
      </div>
    </motion.div>
  );
}
