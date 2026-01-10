import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-2">Analyzing Website</h3>
        <p className="text-muted-foreground">
          Extracting design elements, colors, fonts, and more...
        </p>
      </motion.div>

      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-3 h-3 rounded-full bg-primary/50"
          />
        ))}
      </div>
    </motion.div>
  );
}
