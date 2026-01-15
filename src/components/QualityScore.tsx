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
      className="glass-card-elevated p-4 sm:p-5"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-1.5 bg-gradient-to-br from-primary/15 to-accent/15 rounded-lg">
          <Gauge className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Quality Score</h3>
          <p className="text-[10px] text-muted-foreground">Overall rating</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          {/* Background glow */}
          <motion.div 
            className={`absolute inset-2 rounded-full blur-lg opacity-30 bg-gradient-to-br ${getScoreColor()}`}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          
          <svg className="w-full h-full transform -rotate-90 relative z-10">
            <circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
              className="opacity-20"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
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
              className="text-2xl sm:text-3xl font-bold font-display"
            >
              {score}
            </motion.span>
            <span className="text-[9px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-2 px-2.5 py-1 rounded-full bg-gradient-to-r ${getScoreColor()}`}
        >
          <span className="text-white font-medium text-[10px] flex items-center gap-1">
            {emoji} {label}
          </span>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.08 }}
            className={`p-2 rounded-lg transition-colors ${
              metric.active 
                ? 'bg-primary/5 border border-primary/10' 
                : 'bg-muted/10'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <metric.icon className={`w-3 h-3 ${metric.active ? 'text-primary' : 'text-muted-foreground/40'}`} />
              <span className={`text-[10px] font-medium ${metric.active ? 'text-foreground' : 'text-muted-foreground/40'}`}>
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
        className="mt-2 p-1.5 bg-muted/10 rounded-lg text-center"
      >
        <p className="text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground">{meta.imageCount}</span> images found
        </p>
      </motion.div>
    </motion.div>
  );
}
