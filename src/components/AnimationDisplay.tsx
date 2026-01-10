import { motion } from 'framer-motion';
import { Sparkles, Zap, Play, Timer, Waves } from 'lucide-react';

interface AnimationDisplayProps {
  animations: {
    cssAnimations: string[];
    transitions: string[];
    keyframes: string[];
  };
}

export function AnimationDisplay({ animations }: AnimationDisplayProps) {
  const totalAnimations = animations.cssAnimations.length + animations.transitions.length + animations.keyframes.length;

  if (totalAnimations === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Waves className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        </motion.div>
        <p className="text-muted-foreground text-lg">No CSS animations detected</p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Animations might be JavaScript-based or in external stylesheets
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Motion & Animations</h3>
          <p className="text-sm text-muted-foreground">{totalAnimations} animation properties found</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Keyframes */}
        {animations.keyframes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-green-500" />
              Keyframe Animations
            </p>
            <div className="flex flex-wrap gap-2">
              {animations.keyframes.map((keyframe, index) => (
                <motion.span
                  key={keyframe}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm font-mono border border-green-500/20"
                >
                  @keyframes {keyframe}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* CSS Animations */}
        {animations.cssAnimations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              CSS Animation Properties
            </p>
            <div className="space-y-2">
              {animations.cssAnimations.slice(0, 5).map((anim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl text-sm font-mono text-muted-foreground border border-purple-500/20 truncate"
                >
                  animation: {anim}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Transitions */}
        {animations.transitions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" />
              CSS Transitions
            </p>
            <div className="space-y-2">
              {animations.transitions.slice(0, 5).map((trans, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl text-sm font-mono text-muted-foreground border border-blue-500/20 truncate"
                >
                  transition: {trans}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Visual demo */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-muted/30 rounded-xl"
      >
        <p className="text-xs text-muted-foreground mb-3">Animation Preview</p>
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
