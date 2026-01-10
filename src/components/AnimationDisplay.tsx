import { motion } from 'framer-motion';
import { Sparkles, Zap, Play } from 'lucide-react';

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
        <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No animations detected</p>
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
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Animations</h3>
          <p className="text-sm text-muted-foreground">{totalAnimations} animations found</p>
        </div>
      </div>

      <div className="space-y-4">
        {animations.keyframes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Keyframe Animations
            </p>
            <div className="flex flex-wrap gap-2">
              {animations.keyframes.map((keyframe, index) => (
                <motion.span
                  key={keyframe}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm font-mono"
                >
                  @{keyframe}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {animations.cssAnimations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              CSS Animations
            </p>
            <div className="space-y-2">
              {animations.cssAnimations.slice(0, 5).map((anim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="p-3 bg-muted/50 rounded-lg text-sm font-mono text-muted-foreground truncate"
                >
                  {anim}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {animations.transitions.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              CSS Transitions
            </p>
            <div className="space-y-2">
              {animations.transitions.slice(0, 5).map((trans, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-3 bg-muted/50 rounded-lg text-sm font-mono text-muted-foreground truncate"
                >
                  {trans}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
