import { motion } from 'framer-motion';
import { Palette, Type, Image, Shapes, Zap, Code } from 'lucide-react';

const features = [
  { icon: Palette, label: 'Colors', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { icon: Type, label: 'Fonts', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  { icon: Image, label: 'Images', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { icon: Shapes, label: 'Icons', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { icon: Zap, label: 'Motion', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { icon: Code, label: 'Stack', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
];

export function FeatureRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-16"
    >
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl cursor-default"
          >
            <div className={`p-1.5 rounded-lg ${feature.color}`}>
              <feature.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{feature.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
