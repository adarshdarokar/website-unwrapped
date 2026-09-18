import { motion } from 'framer-motion';
import { 
  Bookmark, ArrowRight, Sparkles, Palette, Type, Image, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

const CHART_COLORS = [
  'hsl(340, 65%, 60%)',  // soft rose
  'hsl(262, 55%, 62%)',  // soft violet
  'hsl(210, 60%, 58%)',  // soft blue
  'hsl(40, 70%, 55%)',   // soft amber
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-medium text-foreground">{payload[0].name}</p>
        <p className="text-muted-foreground">{payload[0].value} found</p>
      </div>
    );
  }
  return null;
};

export function AnalysisSummary({ 
  url, score, colorCount, fontCount, imageCount, animationCount, onExport,
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
    { label: 'Colors', value: colorCount, icon: Palette, color: 'text-rose-400 dark:text-rose-300 bg-rose-500/10' },
    { label: 'Fonts', value: fontCount, icon: Type, color: 'text-violet-400 dark:text-violet-300 bg-violet-500/10' },
    { label: 'Images', value: imageCount, icon: Image, color: 'text-sky-400 dark:text-sky-300 bg-sky-500/10' },
    { label: 'Animations', value: animationCount, icon: Zap, color: 'text-amber-400 dark:text-amber-300 bg-amber-500/10' },
  ];

  const chartData = [
    { name: 'Colors', value: colorCount || 1 },
    { name: 'Fonts', value: fontCount || 1 },
    { name: 'Images', value: imageCount || 1 },
    { name: 'Animations', value: animationCount || 1 },
  ];

  const total = colorCount + fontCount + imageCount + animationCount;

  const domain = (() => {
    try { return new URL(url).hostname.replace('www.', ''); }
    catch { return url; }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated overflow-hidden"
    >
      <div className="surface-header p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
               <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">Analysis Complete</p>
               <h2 className="text-lg sm:text-xl tracking-tight font-semibold font-display">{domain}</h2>
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

      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4 sm:mb-5">
          {/* Donut Chart */}
          <div className="relative w-[138px] h-[138px] flex-shrink-0 chart-well p-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold tabular-nums text-foreground">{total}</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Assets</span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 w-full">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-3 sm:p-4 chart-well"
              >
                <div className={`p-1.5 rounded-lg ${stat.color} w-fit mx-auto mb-2`}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
                 <p className="text-2xl font-display font-bold tabular-nums">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Percentage bars */}
        <div className="space-y-2 mb-4">
          {stats.map((stat, i) => {
            const pct = total > 0 ? Math.round((stat.value / total) * 100) : 25;
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-16 text-right">{stat.label}</span>
                <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i] }}
                  />
                </div>
                <span className="text-[10px] font-medium tabular-nums w-8">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} className="flex-1 gap-2 h-9">
              <Bookmark className="w-4 h-4" />
              Export Report
            </Button>
          )}
          <Button variant="default" size="sm" asChild className="flex-1 gap-2 h-9">
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
