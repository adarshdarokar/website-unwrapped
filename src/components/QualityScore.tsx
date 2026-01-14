import { motion } from 'framer-motion';
import { Smartphone, Lock, Zap, Accessibility, Gauge } from 'lucide-react';

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

  const getScoreLabel = () => {
    if (score >= 80) return { label: 'Excellent', emoji: '🚀' };
    if (score >= 60) return { label: 'Good', emoji: '👍' };
    if (score >= 40) return { label: 'Fair', emoji: '🔧' };
    return { label: 'Needs Work', emoji: '⚠️' };
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const metrics = [
    { icon: Lock, label: 'HTTPS', active: meta.isHttps },
    { icon: Smartphone, label: 'Mobile', active: meta.hasViewport },
    { icon: Zap, label: 'Performance', active: meta.hasPreload || meta.hasPreconnect },
    { icon: Accessibility, label: 'Responsive', active: meta.hasResponsiveImages },
  ];

  const { label, emoji } = getScoreLabel();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card-elevated p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
          <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Quality Score</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Overall rating</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          {/* Background glow */}
          <motion.div 
            className={`absolute inset-2 rounded-full blur-lg opacity-40 bg-gradient-to-br ${getScoreColor()}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          
          <svg className="w-full h-full transform -rotate-90 relative z-10">
            <circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              className="opacity-30"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
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
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-3xl sm:text-4xl font-bold font-display"
            >
              {score}
            </motion.span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-3 px-3 py-1.5 rounded-full bg-gradient-to-r ${getScoreColor()}`}
        >
          <span className="text-white font-medium text-xs flex items-center gap-1.5">
            {emoji} {label}
          </span>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.08 }}
            className={`p-2.5 rounded-lg transition-colors ${
              metric.active 
                ? 'bg-accent/30 border border-primary/20' 
                : 'bg-muted/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <metric.icon className={`w-3.5 h-3.5 ${metric.active ? 'text-primary' : 'text-muted-foreground/50'}`} />
              <span className={`text-xs font-medium ${metric.active ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                {metric.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 p-2 bg-muted/20 rounded-lg text-center"
      >
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{meta.imageCount}</span> images
        </p>
      </motion.div>
    </motion.div>
  );
}
