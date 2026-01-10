import { motion } from 'framer-motion';
import { Star, Shield, Zap, Eye, Smartphone, Lock, Gauge, Accessibility } from 'lucide-react';

interface QualityScoreProps {
  score: number;
  meta: {
    hasViewport: boolean;
    hasPreload: boolean;
    hasPreconnect: boolean;
    isHttps: boolean;
    imageCount: number;
    hasResponsiveImages: boolean;
  };
}

export function QualityScore({ score, meta }: QualityScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-amber-400 to-yellow-500';
    if (score >= 40) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  const getScoreGlow = () => {
    if (score >= 80) return 'shadow-emerald-500/30';
    if (score >= 60) return 'shadow-amber-500/30';
    if (score >= 40) return 'shadow-orange-500/30';
    return 'shadow-red-500/30';
  };

  const getScoreLabel = () => {
    if (score >= 80) return { label: 'Excellent', emoji: '🚀' };
    if (score >= 60) return { label: 'Good', emoji: '👍' };
    if (score >= 40) return { label: 'Fair', emoji: '🔧' };
    return { label: 'Needs Work', emoji: '⚠️' };
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const metrics = [
    { icon: Lock, label: 'HTTPS Secure', active: meta.isHttps, description: 'SSL encrypted' },
    { icon: Smartphone, label: 'Mobile Ready', active: meta.hasViewport, description: 'Viewport meta' },
    { icon: Zap, label: 'Performance', active: meta.hasPreload || meta.hasPreconnect, description: 'Preload hints' },
    { icon: Accessibility, label: 'Responsive', active: meta.hasResponsiveImages, description: 'Srcset images' },
  ];

  const { label, emoji } = getScoreLabel();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card-elevated p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
          whileHover={{ scale: 1.05, rotate: 10 }}
        >
          <Gauge className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Quality Score</h3>
          <p className="text-sm text-muted-foreground">Overall website rating</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          {/* Background glow */}
          <motion.div 
            className={`absolute inset-0 rounded-full blur-xl opacity-50 bg-gradient-to-br ${getScoreColor()}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <svg className="w-full h-full transform -rotate-90 relative z-10">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r="54"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
              className="opacity-30"
            />
            {/* Score circle */}
            <motion.circle
              cx="72"
              cy="72"
              r="54"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : score >= 40 ? '#fb923c' : '#f87171'} />
                <stop offset="100%" stopColor={score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444'} />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-4xl font-bold font-display"
            >
              {score}
            </motion.span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`mt-4 px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor()} shadow-lg ${getScoreGlow()}`}
        >
          <span className="text-white font-semibold text-sm flex items-center gap-2">
            {emoji} {label}
          </span>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-xl transition-all duration-300 ${
              metric.active 
                ? 'bg-gradient-to-br from-accent/50 to-accent/30 border border-primary/20' 
                : 'bg-muted/30 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <metric.icon className={`w-4 h-4 ${metric.active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-medium ${metric.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {metric.label}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 bg-muted/30 rounded-xl text-center"
      >
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{meta.imageCount}</span> images found on page
        </p>
      </motion.div>
    </motion.div>
  );
}
