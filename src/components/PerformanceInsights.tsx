import { motion } from 'framer-motion';
import { 
  Gauge, Zap, Image, Shield, Globe2, Monitor,
  TrendingUp, TrendingDown, Minus, Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface PerformanceInsightsProps {
  meta: {
    hasViewport: boolean;
    hasPreload: boolean;
    hasPreconnect: boolean;
    isHttps: boolean;
    imageCount: number;
    hasResponsiveImages: boolean;
  };
  images: { src: string; alt: string }[];
  score: number;
}

interface InsightItem {
  label: string;
  status: 'good' | 'warning' | 'bad';
  value: string;
  tip: string;
}

const STATUS_COLORS = {
  good: 'hsl(160, 45%, 50%)',
  warning: 'hsl(40, 60%, 55%)',
  bad: 'hsl(0, 55%, 55%)',
};

const ChartTip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-medium text-foreground">{payload[0].name}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function PerformanceInsights({ meta, images, score }: PerformanceInsightsProps) {
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
  const altTextPercentage = images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100;

  const insights: InsightItem[] = [
    { label: 'HTTPS Security', status: meta.isHttps ? 'good' : 'bad', value: meta.isHttps ? 'Secure' : 'Insecure', tip: meta.isHttps ? 'Site uses HTTPS encryption' : 'Site should use HTTPS for security' },
    { label: 'Viewport Meta', status: meta.hasViewport ? 'good' : 'warning', value: meta.hasViewport ? 'Configured' : 'Missing', tip: meta.hasViewport ? 'Mobile viewport is properly configured' : 'Add viewport meta tag for mobile support' },
    { label: 'Resource Preloading', status: meta.hasPreload ? 'good' : 'warning', value: meta.hasPreload ? 'Enabled' : 'Not found', tip: meta.hasPreload ? 'Critical resources are preloaded' : 'Consider preloading critical assets' },
    { label: 'Connection Hints', status: meta.hasPreconnect ? 'good' : 'warning', value: meta.hasPreconnect ? 'Optimized' : 'None found', tip: meta.hasPreconnect ? 'Preconnect hints are used' : 'Add preconnect for faster third-party loads' },
    { label: 'Responsive Images', status: meta.hasResponsiveImages ? 'good' : 'warning', value: meta.hasResponsiveImages ? 'Yes' : 'No', tip: meta.hasResponsiveImages ? 'Images adapt to screen size' : 'Consider using srcset for images' },
    { label: 'Image Alt Text', status: altTextPercentage > 80 ? 'good' : altTextPercentage > 50 ? 'warning' : 'bad', value: `${altTextPercentage}%`, tip: `${imagesWithAlt} of ${images.length} images have alt text` },
  ];

  const goodCount = insights.filter(i => i.status === 'good').length;
  const warnCount = insights.filter(i => i.status === 'warning').length;
  const badCount = insights.filter(i => i.status === 'bad').length;
  const performanceScore = Math.round((goodCount / insights.length) * 100);

  const donutData = [
    { name: 'Passed', value: goodCount },
    { name: 'Warnings', value: warnCount },
    { name: 'Failed', value: badCount },
  ].filter(d => d.value > 0);

  const donutColors = [STATUS_COLORS.good, STATUS_COLORS.warning, STATUS_COLORS.bad];

  const getStatusColor = (status: InsightItem['status']) => {
    switch (status) {
      case 'good': return 'text-emerald-400 dark:text-emerald-300';
      case 'warning': return 'text-amber-400 dark:text-amber-300';
      case 'bad': return 'text-red-400 dark:text-red-300';
    }
  };

  const getStatusBg = (status: InsightItem['status']) => {
    switch (status) {
      case 'good': return 'bg-emerald-500/8 border-emerald-500/15';
      case 'warning': return 'bg-amber-500/8 border-amber-500/15';
      case 'bad': return 'bg-red-500/8 border-red-500/15';
    }
  };

  const getStatusIcon = (status: InsightItem['status']) => {
    switch (status) {
      case 'good': return TrendingUp;
      case 'warning': return Minus;
      case 'bad': return TrendingDown;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden h-full">
      <div className="surface-header p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Gauge className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Performance & SEO</h3>
            <p className="text-xs text-muted-foreground">{goodCount}/{insights.length} checks passed</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Donut chart + score */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-[98px] h-[98px] flex-shrink-0 chart-well p-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={28} outerRadius={40}
                  paddingAngle={3} dataKey="value" stroke="none">
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={donutColors[i]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-bold ${performanceScore >= 80 ? 'text-emerald-400' : performanceScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {performanceScore}%
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: donutColors[i] }} />
                <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
                <span className="text-xs font-semibold tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-2 gap-2">
          {insights.map((insight, index) => {
            const StatusIcon = getStatusIcon(insight.status);
            return (
              <Tooltip key={insight.label}>
                <TooltipTrigger asChild>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-xl border ${getStatusBg(insight.status)} cursor-help transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center justify-between mb-1.5">
                       <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{insight.label}</span>
                      <StatusIcon className={`w-3.5 h-3.5 ${getStatusColor(insight.status)}`} />
                    </div>
                    <p className={`text-xs font-bold ${getStatusColor(insight.status)}`}>{insight.value}</p>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs"><p>{insight.tip}</p></TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Images</span>
            </div>
            <span className="text-sm font-semibold">{meta.imageCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
