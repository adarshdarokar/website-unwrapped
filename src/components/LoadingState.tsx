import { motion } from 'framer-motion';
import { Globe, Palette, Type, Image, Zap } from 'lucide-react';

const steps = [
  { icon: Globe, label: 'Fetching website', delay: 0 },
  { icon: Palette, label: 'Extracting colors', delay: 0.5 },
  { icon: Type, label: 'Analyzing fonts', delay: 1 },
  { icon: Image, label: 'Processing images', delay: 1.5 },
  { icon: Zap, label: 'Detecting animations', delay: 2 },
];

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-8">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-muted"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary" />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-medium mb-6"
      >
        Analyzing website...
      </motion.p>

      {/* Progress steps */}
      <div className="flex flex-wrap justify-center gap-3 max-w-md">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: step.delay }}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full"
          >
            <step.icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
