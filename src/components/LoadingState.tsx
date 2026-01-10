import { motion } from 'framer-motion';
import { Sparkles, Globe, Palette, Type, Zap } from 'lucide-react';

export function LoadingState() {
  const loadingSteps = [
    { icon: Globe, label: 'Fetching website...' },
    { icon: Palette, label: 'Extracting colors...' },
    { icon: Type, label: 'Analyzing typography...' },
    { icon: Zap, label: 'Detecting animations...' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Main loader */}
      <div className="relative mb-8">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-glow"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        
        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3
            }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="absolute -top-2 left-1/2 w-3 h-3 rounded-full bg-primary/60"
              style={{ marginLeft: '-6px' }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-display font-semibold mb-2">Analyzing Website</h3>
        <p className="text-muted-foreground">
          Extracting design elements, this may take a moment...
        </p>
      </motion.div>

      {/* Progress steps */}
      <div className="grid grid-cols-2 gap-3 max-w-sm">
        {loadingSteps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.2 }}
            className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >
              <step.icon className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-xs text-muted-foreground">{step.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Animated dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -12, 0],
              backgroundColor: ['hsl(var(--primary) / 0.3)', 'hsl(var(--primary))', 'hsl(var(--primary) / 0.3)']
            }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15
            }}
            className="w-3 h-3 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
