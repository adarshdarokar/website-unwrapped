import { motion } from 'framer-motion';
import { 
  Gauge, 
  Zap, 
  Image, 
  Shield, 
  Globe2, 
  Monitor,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

export function PerformanceInsights({ meta, images, score }: PerformanceInsightsProps) {
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
  const altTextPercentage = images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100;

  const insights: InsightItem[] = [
    {
      label: 'HTTPS Security',
      status: meta.isHttps ? 'good' : 'bad',
      value: meta.isHttps ? 'Secure' : 'Insecure',
      tip: meta.isHttps ? 'Site uses HTTPS encryption' : 'Site should use HTTPS for security',
    },
    {
      label: 'Viewport Meta',
      status: meta.hasViewport ? 'good' : 'warning',
      value: meta.hasViewport ? 'Configured' : 'Missing',
      tip: meta.hasViewport ? 'Mobile viewport is properly configured' : 'Add viewport meta tag for mobile support',
    },
    {
      label: 'Resource Preloading',
      status: meta.hasPreload ? 'good' : 'warning',
      value: meta.hasPreload ? 'Enabled' : 'Not found',
      tip: meta.hasPreload ? 'Critical resources are preloaded' : 'Consider preloading critical assets',
    },
    {
      label: 'Connection Hints',
      status: meta.hasPreconnect ? 'good' : 'warning',
      value: meta.hasPreconnect ? 'Optimized' : 'None found',
      tip: meta.hasPreconnect ? 'Preconnect hints are used' : 'Add preconnect for faster third-party loads',
    },
    {
      label: 'Responsive Images',
      status: meta.hasResponsiveImages ? 'good' : 'warning',
      value: meta.hasResponsiveImages ? 'Yes' : 'No',
      tip: meta.hasResponsiveImages ? 'Images adapt to screen size' : 'Consider using srcset for images',
    },
    {
      label: 'Image Alt Text',
      status: altTextPercentage > 80 ? 'good' : altTextPercentage > 50 ? 'warning' : 'bad',
      value: `${altTextPercentage}%`,
      tip: `${imagesWithAlt} of ${images.length} images have alt text`,
    },
  ];

  const goodCount = insights.filter(i => i.status === 'good').length;
  const performanceScore = Math.round((goodCount / insights.length) * 100);

  const getStatusColor = (status: InsightItem['status']) => {
    switch (status) {
      case 'good': return 'text-emerald-500 dark:text-emerald-400';
      case 'warning': return 'text-amber-500 dark:text-amber-400';
      case 'bad': return 'text-red-500 dark:text-red-400';
    }
  };

  const getStatusBg = (status: InsightItem['status']) => {
    switch (status) {
      case 'good': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'bad': return 'bg-red-500/10 border-red-500/20';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Gauge className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium">Performance & SEO</h3>
          <p className="text-xs text-muted-foreground">
            {goodCount}/{insights.length} checks passed
          </p>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Health Score</span>
          <span className={`text-sm font-semibold ${
            performanceScore >= 80 ? 'text-emerald-500' : 
            performanceScore >= 50 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {performanceScore}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${performanceScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              performanceScore >= 80 ? 'bg-emerald-500' : 
              performanceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-2 gap-2">
        {insights.map((insight, index) => {
          const StatusIcon = getStatusIcon(insight.status);
          return (
            <Tooltip key={insight.label}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border ${getStatusBg(insight.status)} cursor-help transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate">{insight.label}</span>
                    <StatusIcon className={`w-3.5 h-3.5 ${getStatusColor(insight.status)}`} />
                  </div>
                  <p className={`text-sm font-semibold ${getStatusColor(insight.status)}`}>
                    {insight.value}
                  </p>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{insight.tip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Images</span>
          <span className="font-medium">{meta.imageCount}</span>
        </div>
      </div>
    </motion.div>
  );
}
