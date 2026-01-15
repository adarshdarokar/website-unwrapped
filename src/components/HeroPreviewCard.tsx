import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const sampleColors = ['#0066FF', '#FF6B35', '#00D4AA', '#8B5CF6', '#F59E0B'];
const sampleFonts = ['Inter', 'SF Pro', 'Geist'];

export function HeroPreviewCard() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-w-md mx-auto mt-12"
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 -z-10" />
      
      <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-warning/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">sample-analysis</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                fill="none"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                stroke="hsl(var(--success))"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 151" }}
                animate={{ strokeDasharray: "124 151" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
              82
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">Design Score</p>
            <p className="text-xs text-muted-foreground">Above average</p>
          </div>
        </div>

        {/* Colors */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2">Color Palette</p>
          <div className="flex gap-2">
            {sampleColors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyColor(color)}
                className="relative w-8 h-8 rounded-lg shadow-sm transition-shadow hover:shadow-md"
                style={{ backgroundColor: color }}
              >
                {copiedColor === color && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Typography</p>
          <div className="flex flex-wrap gap-2">
            {sampleFonts.map((font) => (
              <span
                key={font}
                className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium"
              >
                {font}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
