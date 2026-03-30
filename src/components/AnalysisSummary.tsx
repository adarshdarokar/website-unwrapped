import { motion } from 'framer-motion';
import { 
  Bookmark,
  ArrowRight,
  Sparkles,
  Palette,
  Type,
  Image,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisSummaryProps {
  url: string;
  score: number;
  colorCount: number;
  fontCount: number;
  imageCount: number;
  animationCount: number;
  onExport?: () => void;
  onSave?: () => void;
}

export function AnalysisSummary({ 
  url, 
  score, 
  colorCount, 
  fontCount, 
  imageCount, 
  animationCount,
  onExport,
}: AnalysisSummaryProps) {
  const getScoreLabel = () => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Above Average';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    return 'Needs Work';
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = () => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const stats = [
    { label: 'Colors', value: colorCount, icon: Palette, color: 'text-rose-500 bg-rose-500/10' },
    { label: 'Fonts', value: fontCount, icon: Type, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Images', value: imageCount, icon: Image, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Animations', value: animationCount, icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const domain = (() => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Analysis Complete</p>
              <h2 className="text-base sm:text-lg font-semibold font-display">{domain}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`text-2xl font-bold tabular-nums ${getScoreColor()}`}>{score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${getScoreColor()} ${getScoreBg()}`}>
              {getScoreLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-3 sm:p-4 bg-muted/20 rounded-xl border border-border/30"
            >
              <div className={`p-1.5 rounded-lg ${stat.color} w-fit mx-auto mb-2`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg sm:text-xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          {onExport && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExport}
              className="flex-1 gap-2 h-9"
            >
              <Bookmark className="w-4 h-4" />
              Export Report
            </Button>
          )}
          <Button 
            variant="default" 
            size="sm" 
            asChild
            className="flex-1 gap-2 h-9"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              Visit Site
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
