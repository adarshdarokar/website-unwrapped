import { motion } from 'framer-motion';
import { Smartphone, Lock, Zap, Accessibility, Info, Check, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

const SCORE_COLORS = {
  excellent: 'hsl(160, 45%, 50%)',
  good: 'hsl(40, 60%, 55%)',
  poor: 'hsl(0, 55%, 55%)',
};

export function QualityScore({ score, meta }: QualityScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return SCORE_COLORS.excellent;
    if (score >= 60) return SCORE_COLORS.good;
    return SCORE_COLORS.poor;
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const scoreColor = getScoreColor();
  const remainColor = 'hsl(var(--muted))';

  const donutData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const metrics = [
    { icon: Lock, label: 'HTTPS', active: meta.isHttps },
    { icon: Smartphone, label: 'Mobile', active: meta.hasViewport },
    { icon: Zap, label: 'Perf', active: meta.hasPreload || meta.hasPreconnect },
    { icon: Accessibility, label: 'Responsive', active: meta.hasResponsiveImages },
  ];

  const getScoreBreakdown = () => {
    const breakdown: string[] = [];
    const issues: string[] = [];
    if (meta.isHttps) breakdown.push('Secure HTTPS connection (+15)');
    else issues.push('Missing HTTPS security (-15)');
    if (meta.hasViewport) breakdown.push('Mobile-optimized viewport (+20)');
    else issues.push('No mobile viewport meta (-20)');
    if (meta.hasPreload || meta.hasPreconnect) breakdown.push('Performance optimizations (+15)');
    else issues.push('No resource preloading (-15)');
    if (meta.hasResponsiveImages) breakdown.push('Responsive image implementation (+20)');
    else issues.push('Missing responsive images (-20)');
    if (meta.imageCount > 0 && meta.imageCount <= 50) breakdown.push(`Optimized image count: ${meta.imageCount}`);
    else if (meta.imageCount > 50) issues.push(`High image count: ${meta.imageCount}`);
    return { breakdown, issues };
  };

  const { breakdown, issues } = getScoreBreakdown();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Design Score</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-[80px] h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={28} outerRadius={36}
                startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                <Cell fill={scoreColor} />
                <Cell fill={remainColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-xl font-semibold">{score}</motion.span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{getScoreLabel()}</p>
          <p className="text-xs text-muted-foreground">{meta.imageCount} images found</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {metrics.map((metric, index) => (
          <motion.div key={metric.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
              metric.active 
                ? 'bg-emerald-500/8 text-emerald-400 dark:text-emerald-300 border border-emerald-500/15' 
                : 'bg-muted/30 text-muted-foreground border border-transparent'
            }`}>
            <metric.icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{metric.label}</span>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="pt-4 border-t border-border/50">
        <div className="flex items-center gap-1.5 mb-3">
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Score Analysis</span>
        </div>
        {breakdown.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {breakdown.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-tight">{item}</span>
              </div>
            ))}
          </div>
        )}
        {issues.length > 0 && (
          <div className="space-y-1.5">
            {issues.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-tight">{item}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
