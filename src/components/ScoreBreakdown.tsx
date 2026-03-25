import { motion } from 'framer-motion';
import {
  Palette, Type, Shapes, Zap, Search, Gauge, Accessibility, Image,
  CheckCircle2, AlertTriangle, XCircle, Lightbulb, TrendingUp,
  BarChart3, ClipboardList, ChevronDown
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

interface ScoreBreakdownProps {
  score: number;
  scoreBreakdown?: Record<string, number>;
  scoreReasons?: string[];
  suggestions?: string[];
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; maxPoints: number; color: string }> = {
  typography: { label: 'Typography', icon: Type, maxPoints: 12, color: 'text-blue-500' },
  colors: { label: 'Color Palette', icon: Palette, maxPoints: 12, color: 'text-purple-500' },
  icons: { label: 'Icons & Assets', icon: Shapes, maxPoints: 8, color: 'text-emerald-500' },
  animations: { label: 'Motion Design', icon: Zap, maxPoints: 8, color: 'text-amber-500' },
  seo: { label: 'SEO & Discovery', icon: Search, maxPoints: 20, color: 'text-cyan-500' },
  performance: { label: 'Performance', icon: Gauge, maxPoints: 15, color: 'text-orange-500' },
  accessibility: { label: 'Accessibility', icon: Accessibility, maxPoints: 15, color: 'text-pink-500' },
  images: { label: 'Image Quality', icon: Image, maxPoints: 10, color: 'text-teal-500' },
};

function getScoreLevel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-success', bg: 'bg-success/10' };
  if (score >= 60) return { label: 'Good', color: 'text-primary', bg: 'bg-primary/10' };
  if (score >= 40) return { label: 'Fair', color: 'text-warning', bg: 'bg-warning/10' };
  return { label: 'Needs Work', color: 'text-destructive', bg: 'bg-destructive/10' };
}

function getReasonIcon(reason: string) {
  if (reason.includes('+0)') || reason.includes('+1)') || reason.includes('+2)')) {
    return <XCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />;
  }
  if (reason.includes('+3)') || reason.includes('+4)') || reason.includes('+5)')) {
    return <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />;
  }
  return <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />;
}

export function ScoreBreakdown({ score, scoreBreakdown, scoreReasons, suggestions }: ScoreBreakdownProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const level = getScoreLevel(score);

  if (!scoreBreakdown && !scoreReasons) return null;

  return (
    <div className="space-y-4">
      {/* Overall Score Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4 sm:p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-display">Detailed Score Analysis</h3>
              <p className="text-xs text-muted-foreground">How we evaluated your website</p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${level.color} ${level.bg}`}>
            {score}/100 · {level.label}
          </div>
        </div>
      </motion.div>

      {/* Side-by-side: Category Scores + Evaluation Details */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* LEFT: Category Scores */}
        {scoreBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-semibold font-display uppercase tracking-wider">Category Scores</h4>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Points earned in each evaluation area</p>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const points = scoreBreakdown[key] ?? 0;
                const percentage = Math.round((points / config.maxPoints) * 100);
                const matchingReason = scoreReasons?.find(r => {
                  const lower = r.toLowerCase();
                  if (key === 'typography') return lower.includes('font') || lower.includes('typograph');
                  if (key === 'colors') return lower.includes('color') || lower.includes('palette');
                  if (key === 'icons') return lower.includes('icon') || lower.includes('svg');
                  if (key === 'animations') return lower.includes('animation') || lower.includes('transition') || lower.includes('motion');
                  if (key === 'seo') return lower.includes('seo');
                  if (key === 'performance') return lower.includes('performance');
                  if (key === 'accessibility') return lower.includes('alt text') || lower.includes('aria') || lower.includes('semantic') || lower.includes('heading');
                  if (key === 'images') return lower.includes('image count') || lower.includes('image');
                  return false;
                });

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + Object.keys(categoryConfig).indexOf(key) * 0.04 }}
                    className="p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <config.icon className={`w-3.5 h-3.5 ${config.color}`} />
                          <span className="text-xs font-medium">{config.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${percentage >= 70 ? 'text-success' : percentage >= 40 ? 'text-warning' : 'text-destructive'}`}>
                            {points}/{config.maxPoints}
                          </span>
                          <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${expandedCategory === key ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </button>

                    {expandedCategory === key && matchingReason && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-2 p-2 bg-background/50 rounded-md border border-border/50"
                      >
                        <div className="flex items-start gap-2">
                          {getReasonIcon(matchingReason)}
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{matchingReason}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* RIGHT: Evaluation Details */}
        {scoreReasons && scoreReasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-semibold font-display uppercase tracking-wider">Evaluation Details</h4>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">What we found during analysis</p>
            </div>
            <div className="p-4 space-y-1.5">
              {scoreReasons.map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.03 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {getReasonIcon(reason)}
                  <span className="text-[11px] text-muted-foreground leading-relaxed">{reason}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Improvement Suggestions — full width below */}
      {suggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-border bg-warning/5">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-warning" />
              <h4 className="text-xs font-semibold font-display uppercase tracking-wider">Suggestions to Improve</h4>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Actionable steps to boost your score</p>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-2.5">
            {suggestions.map((suggestion, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-2.5 p-3 bg-warning/5 border border-warning/10 rounded-lg"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-warning/15 text-warning text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-foreground/80 leading-relaxed">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
