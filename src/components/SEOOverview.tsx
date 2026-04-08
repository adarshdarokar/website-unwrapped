import { motion } from 'framer-motion';
import { 
  FileText, Search, Link2, Globe2, AlertCircle, CheckCircle2, Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from 'recharts';

interface SEOOverviewProps {
  url: string;
  meta: {
    hasViewport: boolean;
    hasPreload: boolean;
    hasPreconnect: boolean;
    isHttps: boolean;
    imageCount: number;
    hasResponsiveImages: boolean;
  };
  images: { src: string; alt: string }[];
}

interface SEOFactor {
  id: string;
  label: string;
  status: 'good' | 'warning' | 'bad';
  importance: 'high' | 'medium' | 'low';
  tip: string;
  score: number;
}

const FACTOR_COLORS = {
  good: 'hsl(160, 45%, 50%)',
  warning: 'hsl(40, 60%, 55%)',
  bad: 'hsl(0, 55%, 55%)',
};

const ChartTip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    const d = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-medium text-foreground">{d.label}</p>
        <p className="text-muted-foreground">{d.status === 'good' ? 'Passed' : d.status === 'warning' ? 'Warning' : 'Failed'}</p>
      </div>
    );
  }
  return null;
};

export function SEOOverview({ url, meta, images }: SEOOverviewProps) {
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
  
  const factors: SEOFactor[] = [
    { id: 'https', label: 'HTTPS', status: meta.isHttps ? 'good' : 'bad', importance: 'high', score: meta.isHttps ? 100 : 0, tip: meta.isHttps ? 'Site uses secure HTTPS connection' : 'Switch to HTTPS for better SEO' },
    { id: 'mobile', label: 'Mobile', status: meta.hasViewport ? 'good' : 'bad', importance: 'high', score: meta.hasViewport ? 100 : 0, tip: meta.hasViewport ? 'Mobile viewport configured' : 'Add viewport meta tag' },
    { id: 'images', label: 'Alt Text', status: images.length === 0 || imagesWithAlt / images.length >= 0.8 ? 'good' : imagesWithAlt / images.length >= 0.5 ? 'warning' : 'bad', importance: 'medium', score: images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100, tip: images.length > 0 ? `${imagesWithAlt}/${images.length} images have alt text` : 'No images detected' },
    { id: 'performance', label: 'Hints', status: meta.hasPreload || meta.hasPreconnect ? 'good' : 'warning', importance: 'medium', score: meta.hasPreload || meta.hasPreconnect ? 100 : 40, tip: meta.hasPreload || meta.hasPreconnect ? 'Resource hints detected' : 'Add preload/preconnect hints' },
    { id: 'responsive', label: 'Resp.', status: meta.hasResponsiveImages ? 'good' : 'warning', importance: 'low', score: meta.hasResponsiveImages ? 100 : 40, tip: meta.hasResponsiveImages ? 'Using responsive images' : 'Consider using srcset' },
  ];

  const goodCount = factors.filter(f => f.status === 'good').length;
  const seoScore = Math.round((goodCount / factors.length) * 100);

  const barData = factors.map(f => ({
    label: f.label,
    value: f.score,
    status: f.status,
    color: FACTOR_COLORS[f.status],
  }));

  const domain = (() => {
    try { return new URL(url).hostname; }
    catch { return url; }
  })();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-sky-500/10 rounded-lg">
          <Search className="w-5 h-5 text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium">SEO Overview</h3>
          <p className="text-xs text-muted-foreground truncate">{domain}</p>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          seoScore >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
          seoScore >= 60 ? 'bg-amber-500/10 text-amber-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {seoScore}%
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="h-[100px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <RechartsTooltip content={<ChartTip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Factors List */}
      <div className="space-y-2">
        {factors.map((factor, index) => {
          const StatusIcon = factor.status === 'good' ? CheckCircle2 : AlertCircle;
          const statusColor = factor.status === 'good' ? 'text-emerald-400' : factor.status === 'warning' ? 'text-amber-400' : 'text-red-400';
          return (
            <Tooltip key={factor.id}>
              <TooltipTrigger asChild>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-help transition-colors">
                  <StatusIcon className={`w-3.5 h-3.5 flex-shrink-0 ${statusColor}`} />
                  <span className="text-xs flex-1">{factor.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                    factor.importance === 'high' ? 'bg-red-500/10 text-red-400' :
                    factor.importance === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-sky-500/10 text-sky-400'
                  }`}>
                    {factor.importance}
                  </span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs"><p>{factor.tip}</p></TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-muted/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {seoScore >= 80 ? 'Good SEO foundation! Focus on content quality and backlinks.'
            : seoScore >= 60 ? 'Decent SEO basics. Address warnings to improve rankings.'
            : 'SEO needs attention. Fix high-priority issues first.'}
        </p>
      </div>
    </motion.div>
  );
}
