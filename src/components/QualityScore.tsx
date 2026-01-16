import { motion } from 'framer-motion';
import { Smartphone, Lock, Zap, Accessibility, Info, Check, AlertTriangle } from 'lucide-react';

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

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const metrics = [
    { icon: Lock, label: 'HTTPS', active: meta.isHttps, points: 15, description: 'Secure connection' },
    { icon: Smartphone, label: 'Mobile Ready', active: meta.hasViewport, points: 20, description: 'Viewport meta tag' },
    { icon: Zap, label: 'Performance', active: meta.hasPreload || meta.hasPreconnect, points: 15, description: 'Resource hints' },
    { icon: Accessibility, label: 'Responsive', active: meta.hasResponsiveImages, points: 20, description: 'Responsive images' },
  ];

  // Generate score breakdown
  const getScoreBreakdown = () => {
    const breakdown: string[] = [];
    const issues: string[] = [];
    
    // Positive factors
    if (meta.isHttps) breakdown.push('Secure HTTPS connection (+15)');
    else issues.push('Missing HTTPS security (-15)');
    
    if (meta.hasViewport) breakdown.push('Mobile-optimized viewport (+20)');
    else issues.push('No mobile viewport meta (-20)');
    
    if (meta.hasPreload || meta.hasPreconnect) breakdown.push('Performance optimizations (+15)');
    else issues.push('No resource preloading (-15)');
    
    if (meta.hasResponsiveImages) breakdown.push('Responsive image implementation (+20)');
    else issues.push('Missing responsive images (-20)');
    
    if (meta.imageCount > 0 && meta.imageCount <= 50) breakdown.push(`Optimized image count: ${meta.imageCount}`);
    else if (meta.imageCount > 50) issues.push(`High image count: ${meta.imageCount} (may slow performance)`);
    
    return { breakdown, issues };
  };

  const { breakdown, issues } = getScoreBreakdown();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Design Score</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-[76px] h-[76px]">
          <svg className="w-[76px] h-[76px] -rotate-90" viewBox="0 0 76 76">
            <circle
              cx="38"
              cy="38"
              r="36"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            <motion.circle
              cx="38"
              cy="38"
              r="36"
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="4"
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
              className="text-xl font-semibold"
            >
              {score}
            </motion.span>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium">{getScoreLabel()}</p>
          <p className="text-xs text-muted-foreground">{meta.imageCount} images found</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
              metric.active 
                ? 'bg-success/10 text-success border border-success/20' 
                : 'bg-muted/30 text-muted-foreground border border-transparent'
            }`}
          >
            <metric.icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{metric.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Score Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-4 border-t border-border/50"
      >
        <div className="flex items-center gap-1.5 mb-3">
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Score Analysis</span>
        </div>
        
        {breakdown.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {breakdown.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-tight">{item}</span>
              </div>
            ))}
          </div>
        )}
        
        {issues.length > 0 && (
          <div className="space-y-1.5">
            {issues.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-tight">{item}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
