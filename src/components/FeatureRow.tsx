import { motion } from 'framer-motion';
import { Palette, Type, Image, Shapes, Zap, Code, Search, Eye } from 'lucide-react';

const features = [
  { icon: Palette, label: 'Colors', desc: 'Full palette extraction', color: 'bg-rose-500/10 text-rose-500' },
  { icon: Type, label: 'Fonts', desc: 'Typography detection', color: 'bg-violet-500/10 text-violet-500' },
  { icon: Image, label: 'Images', desc: 'Asset inventory', color: 'bg-blue-500/10 text-blue-500' },
  { icon: Shapes, label: 'Icons', desc: 'SVG & icon sets', color: 'bg-amber-500/10 text-amber-500' },
  { icon: Zap, label: 'Motion', desc: 'Animation audit', color: 'bg-emerald-500/10 text-emerald-500' },
  { icon: Search, label: 'SEO', desc: 'Ranking analysis', color: 'bg-cyan-500/10 text-cyan-500' },
  { icon: Eye, label: 'A11y', desc: 'Accessibility check', color: 'bg-pink-500/10 text-pink-500' },
  { icon: Code, label: 'Stack', desc: 'Tech detection', color: 'bg-indigo-500/10 text-indigo-500' },
];

export function FeatureRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 sm:mt-16"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 sm:mb-5">
        What we analyze
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.04 }}
            whileHover={{ y: -3, scale: 1.03 }}
            className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-card border border-border/50 rounded-xl cursor-default transition-shadow hover:shadow-[var(--shadow-soft)]"
          >
            <div className={`p-2 rounded-lg ${feature.color}`}>
              <feature.icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">{feature.label}</span>
            <span className="text-[10px] text-muted-foreground leading-tight text-center">{feature.desc}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
