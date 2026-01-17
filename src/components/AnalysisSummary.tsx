import { motion } from 'framer-motion';
import { 
  Bookmark,
  Star,
  Clock,
  ArrowRight,
  Sparkles
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
  onSave
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
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const stats = [
    { label: 'Colors', value: colorCount, suffix: '' },
    { label: 'Fonts', value: fontCount, suffix: '' },
    { label: 'Images', value: imageCount, suffix: '' },
    { label: 'Animations', value: animationCount, suffix: '' },
  ];

  // Extract domain for display
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
      className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-xl p-6 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Analysis Complete</span>
          </div>
          <h2 className="text-lg font-semibold truncate mb-1">{domain}</h2>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              score >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
              score >= 60 ? 'bg-amber-500/10 text-amber-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {getScoreLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="text-center p-3 bg-background/50 rounded-lg"
          >
            <p className="text-xl font-semibold">{stat.value}{stat.suffix}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onExport && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport}
            className="flex-1 gap-2"
          >
            <Bookmark className="w-4 h-4" />
            Export
          </Button>
        )}
        <Button 
          variant="default" 
          size="sm" 
          asChild
          className="flex-1 gap-2"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            Visit Site
            <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
