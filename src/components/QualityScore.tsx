import { motion } from 'framer-motion';
import { Star, Shield, Zap, Eye } from 'lucide-react';

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
    if (score >= 80) return 'hsl(150 60% 45%)';
    if (score >= 60) return 'hsl(45 90% 50%)';
    if (score >= 40) return 'hsl(30 90% 50%)';
    return 'hsl(0 70% 55%)';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const metrics = [
    { icon: Shield, label: 'HTTPS', active: meta.isHttps },
    { icon: Eye, label: 'Viewport', active: meta.hasViewport },
    { icon: Zap, label: 'Preload', active: meta.hasPreload || meta.hasPreconnect },
    { icon: Star, label: 'Responsive', active: meta.hasResponsiveImages },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card-elevated p-8"
    >
      <h3 className="text-xl font-semibold mb-6 text-center">Quality Score</h3>
      
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-4xl font-bold"
              style={{ color: getScoreColor() }}
            >
              {score}
            </motion.span>
            <span className="text-sm text-muted-foreground">out of 100</span>
          </div>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-lg font-medium"
          style={{ color: getScoreColor() }}
        >
          {getScoreLabel()}
        </motion.p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`flex items-center gap-2 p-3 rounded-xl ${
              metric.active 
                ? 'bg-accent text-accent-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <metric.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{metric.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
