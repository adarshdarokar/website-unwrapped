import { motion } from 'framer-motion';
import { Check, Sparkles, TrendingUp, Eye, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const sampleColors = ['#0066FF', '#FF6B35', '#00D4AA', '#8B5CF6', '#F59E0B'];
const sampleFonts = ['Inter', 'SF Pro', 'Geist'];

const miniStats = [
  { label: 'Performance', value: 92, icon: Zap },
  { label: 'Accessibility', value: 88, icon: Eye },
  { label: 'SEO Score', value: 95, icon: TrendingUp },
];

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
      className="relative max-w-lg mx-auto mt-10 sm:mt-12"
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 -z-10" />
      
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-elevated)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">live-analysis</span>
          </div>
        </div>

        {/* Score + Mini Stats row */}
        <div className="flex items-center gap-4 sm:gap-5 mb-5">
          <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
              <circle cx="38" cy="38" r="32" stroke="hsl(var(--muted))" strokeWidth="5" fill="none" />
              <motion.circle
                cx="38" cy="38" r="32"
                stroke="hsl(var(--success))"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 201" }}
                animate={{ strokeDasharray: "165 201" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-base sm:text-lg font-bold">82</span>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            {miniStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="text-center p-2 bg-muted/30 rounded-lg"
              >
                <stat.icon className="w-3.5 h-3.5 mx-auto text-primary/70 mb-1" />
                <p className="text-sm font-bold leading-none">{stat.value}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Color Palette</p>
          <div className="flex gap-2">
            {sampleColors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyColor(color)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-sm transition-shadow hover:shadow-lg ring-1 ring-border/10"
                style={{ backgroundColor: color }}
              >
                {copiedColor === color && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl"
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
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Typography</p>
          <div className="flex flex-wrap gap-2">
            {sampleFonts.map((font) => (
              <span
                key={font}
                className="px-3 py-1.5 bg-muted/50 rounded-full text-xs font-medium border border-border/30"
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
