import { motion } from 'framer-motion';
import {
  Palette, Type, Shapes, Zap, Search, Gauge, Accessibility, Image,
  CheckCircle2, AlertTriangle, XCircle, Lightbulb, TrendingUp,
  BarChart3, ClipboardList, ChevronDown, ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { AnimatedNumber } from '@/components/AnimatedNumber';

interface ScoreBreakdownProps {
  score: number;
  scoreBreakdown?: Record<string, number>;
  scoreReasons?: string[];
  suggestions?: string[];
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; maxPoints: number; color: string; chartColor: string }> = {
  typography: { label: 'Typography', icon: Type, maxPoints: 12, color: 'text-sky-400 dark:text-sky-300', chartColor: 'hsl(200, 60%, 58%)' },
  colors: { label: 'Colors', icon: Palette, maxPoints: 12, color: 'text-violet-400 dark:text-violet-300', chartColor: 'hsl(262, 55%, 62%)' },
  icons: { label: 'Icons', icon: Shapes, maxPoints: 8, color: 'text-emerald-400 dark:text-emerald-300', chartColor: 'hsl(160, 50%, 50%)' },
  animations: { label: 'Motion', icon: Zap, maxPoints: 8, color: 'text-amber-400 dark:text-amber-300', chartColor: 'hsl(40, 65%, 55%)' },
  seo: { label: 'SEO', icon: Search, maxPoints: 20, color: 'text-cyan-400 dark:text-cyan-300', chartColor: 'hsl(185, 55%, 50%)' },
  performance: { label: 'Perf', icon: Gauge, maxPoints: 15, color: 'text-orange-400 dark:text-orange-300', chartColor: 'hsl(25, 60%, 55%)' },
  accessibility: { label: 'A11y', icon: Accessibility, maxPoints: 15, color: 'text-pink-400 dark:text-pink-300', chartColor: 'hsl(330, 50%, 58%)' },
  images: { label: 'Images', icon: Image, maxPoints: 10, color: 'text-teal-400 dark:text-teal-300', chartColor: 'hsl(170, 50%, 48%)' },
};

function getScoreLevel(score: number) {
  if (score >= 80) return { label: 'Excellent', color: 'text-success', bg: 'bg-success/10' };
  if (score >= 60) return { label: 'Good', color: 'text-primary', bg: 'bg-primary/10' };
  if (score >= 40) return { label: 'Fair', color: 'text-warning', bg: 'bg-warning/10' };
  return { label: 'Needs Work', color: 'text-destructive', bg: 'bg-destructive/10' };
}

function getReasonIcon(reason: string) {
  if (reason.includes('+0)') || reason.includes('+1)') || reason.includes('+2)'))
    return <XCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />;
  if (reason.includes('+3)') || reason.includes('+4)') || reason.includes('+5)'))
    return <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />;
}

const ChartTooltipContent = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    const d = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-medium text-foreground">{d.fullLabel}</p>
        <p className="text-muted-foreground">{d.points}/{d.max} points ({d.pct}%)</p>
      </div>
    );
  }
  return null;
};

export function ScoreBreakdown({ score, scoreBreakdown, scoreReasons, suggestions }: ScoreBreakdownProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const level = getScoreLevel(score);

  if (!scoreBreakdown && !scoreReasons) return null;

  const barData = scoreBreakdown ? Object.entries(categoryConfig).map(([key, config]) => {
    const points = scoreBreakdown[key] ?? 0;
    const pct = Math.round((points / config.maxPoints) * 100);
    return { name: config.label, fullLabel: config.label, points, max: config.maxPoints, pct, color: config.chartColor };
  }) : [];

  const radarData = scoreBreakdown ? Object.entries(categoryConfig).map(([key, config]) => {
    const points = scoreBreakdown[key] ?? 0;
    return { subject: config.label, value: Math.round((points / config.maxPoints) * 100), fullMark: 100 };
  }) : [];

  return (
    <div className="space-y-4">
      {/* Overall Score Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card hover-lift shimmer p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 group">
            <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0 icon-pop">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-display">Detailed Score Analysis</h3>
              <p className="text-xs text-muted-foreground">Transparent breakdown of how we evaluated your website</p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${level.color} ${level.bg} self-start sm:self-auto whitespace-nowrap tabular-nums`}>
            <AnimatedNumber value={score} duration={1100} />/100 · {level.label}
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      {scoreBreakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card overflow-hidden hover-lift shimmer">
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold font-display">Category Scores</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Points earned per area</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                    <Bar dataKey="pct" radius={[0, 6, 6, 0]} barSize={14}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card overflow-hidden hover-lift shimmer">
            <div className="p-4 border-b border-border bg-gradient-to-r from-violet-500/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-violet-500/10 rounded-lg">
                  <ClipboardList className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold font-display">Score Radar</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Visual strength map</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detailed category list + evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {scoreBreakdown && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden hover-lift shimmer">
            <div className="p-4 border-b border-border">
              <h4 className="text-xs font-semibold font-display">Point Details</h4>
            </div>
            <div className="p-3 sm:p-4 space-y-2">
              {Object.entries(categoryConfig).map(([key, config], idx) => {
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
                  <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.03 }}
                    className="p-2.5 sm:p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                    <button onClick={() => setExpandedCategory(expandedCategory === key ? null : key)} className="w-full text-left">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <config.icon className={`w-3.5 h-3.5 ${config.color}`} />
                          <span className="text-xs font-medium">{config.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold tabular-nums ${percentage >= 70 ? 'text-emerald-400' : percentage >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                            <AnimatedNumber value={points} duration={900} />/{config.maxPoints}
                          </span>
                          <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${expandedCategory === key ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + idx * 0.05 }}
                          className="h-full rounded-full" style={{ backgroundColor: config.chartColor }} />
                      </div>
                    </button>
                    {expandedCategory === key && matchingReason && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        className="mt-2.5 p-2.5 bg-background/50 rounded-lg border border-border/50">
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

        {scoreReasons && scoreReasons.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card overflow-hidden hover-lift shimmer">
            <div className="p-4 border-b border-border">
              <h4 className="text-xs font-semibold font-display">Evaluation Details</h4>
            </div>
            <div className="p-3 sm:p-4 space-y-1">
              {scoreReasons.map((reason, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.03 }}
                  className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  {getReasonIcon(reason)}
                  <span className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{reason}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card overflow-hidden hover-lift shimmer">
          <div className="p-4 border-b border-border bg-gradient-to-r from-warning/5 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-warning/10 rounded-lg">
                <Lightbulb className="w-4 h-4 text-warning" />
              </div>
              <div>
                <h4 className="text-xs font-semibold font-display">Suggestions to Improve</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Actionable steps to boost your score</p>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {suggestions.map((suggestion, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-3 p-3 sm:p-3.5 bg-warning/5 border border-warning/10 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/15 text-warning text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground/80 leading-relaxed">{suggestion}</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-warning/50 flex-shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
