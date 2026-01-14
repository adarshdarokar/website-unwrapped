import { motion } from 'framer-motion';
import { Sparkles, Play, Timer, Waves, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AnimationDisplayProps {
  animations: {
    cssAnimations: string[];
    transitions: string[];
    keyframes: string[];
  };
}

export function AnimationDisplay({ animations }: AnimationDisplayProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  
  const totalAnimations = animations.cssAnimations.length + animations.transitions.length + animations.keyframes.length;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedItem(code);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (totalAnimations === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Waves className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        </motion.div>
        <p className="text-muted-foreground">No CSS animations detected</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Animations might be JavaScript-based
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Motion & Animations</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{totalAnimations} properties found</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Keyframes */}
        {animations.keyframes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Play className="w-4 h-4 text-green-500" />
              Keyframes
            </p>
            <div className="flex flex-wrap gap-2">
              {animations.keyframes.map((keyframe, index) => (
                <motion.button
                  key={keyframe}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => copyCode(`@keyframes ${keyframe}`)}
                  className="px-2.5 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-xs font-mono border border-green-500/20 hover:bg-green-500/20 transition-colors flex items-center gap-1.5"
                >
                  <span>@keyframes {keyframe}</span>
                  {copiedItem === `@keyframes ${keyframe}` ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-50" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* CSS Animations */}
        {animations.cssAnimations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Animation Properties
            </p>
            <div className="space-y-1.5">
              {animations.cssAnimations.slice(0, 4).map((anim, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => copyCode(`animation: ${anim}`)}
                  className="w-full p-2.5 bg-purple-500/10 rounded-lg text-xs font-mono text-muted-foreground border border-purple-500/20 truncate text-left hover:bg-purple-500/20 transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate">animation: {anim}</span>
                  {copiedItem === `animation: ${anim}` ? (
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-50 flex-shrink-0" />
                  )}
                </motion.button>
              ))}
              {animations.cssAnimations.length > 4 && (
                <p className="text-xs text-muted-foreground px-2">
                  +{animations.cssAnimations.length - 4} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Transitions */}
        {animations.transitions.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" />
              Transitions
            </p>
            <div className="space-y-1.5">
              {animations.transitions.slice(0, 4).map((trans, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onClick={() => copyCode(`transition: ${trans}`)}
                  className="w-full p-2.5 bg-blue-500/10 rounded-lg text-xs font-mono text-muted-foreground border border-blue-500/20 truncate text-left hover:bg-blue-500/20 transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate">transition: {trans}</span>
                  {copiedItem === `transition: ${trans}` ? (
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-50 flex-shrink-0" />
                  )}
                </motion.button>
              ))}
              {animations.transitions.length > 4 && (
                <p className="text-xs text-muted-foreground px-2">
                  +{animations.transitions.length - 4} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Minimal animation preview */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 p-3 bg-muted/20 rounded-lg"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
