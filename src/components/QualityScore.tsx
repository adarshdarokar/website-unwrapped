import { motion } from 'framer-motion';
import { Smartphone, Lock, Zap, Accessibility } from 'lucide-react';

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
    if (score >= 80) return 'hsl(var(--success))';
    if (score >= 60) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const metrics = [
    { icon: Lock, label: 'HTTPS', active: meta.isHttps },
    { icon: Smartphone, label: 'Mobile', active: meta.hasViewport },
    { icon: Zap, label: 'Perf', active: meta.hasPreload || meta.hasPreconnect },
    { icon: Accessibility, label: 'Responsive', active: meta.hasResponsiveImages },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Design Score</h3>
      
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="40"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="5"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="40"
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-semibold"
            >
              {score}
            </motion.span>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium">{getScoreLabel()}</p>
          <p className="text-xs text-muted-foreground">{meta.imageCount} images</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`flex items-center gap-2 p-2 rounded-lg ${
              metric.active 
                ? 'bg-success/10 text-success' 
                : 'bg-muted/30 text-muted-foreground'
            }`}
          >
            <metric.icon className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{metric.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
