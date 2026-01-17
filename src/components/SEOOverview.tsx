import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Link2, 
  Globe2, 
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
}

export function SEOOverview({ url, meta, images }: SEOOverviewProps) {
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
  
  const factors: SEOFactor[] = [
    {
      id: 'https',
      label: 'HTTPS Secure',
      status: meta.isHttps ? 'good' : 'bad',
      importance: 'high',
      tip: meta.isHttps 
        ? 'Site uses secure HTTPS connection - great for SEO and user trust'
        : 'Switch to HTTPS - Google prioritizes secure sites in rankings',
    },
    {
      id: 'mobile',
      label: 'Mobile-Friendly',
      status: meta.hasViewport ? 'good' : 'bad',
      importance: 'high',
      tip: meta.hasViewport
        ? 'Mobile viewport configured - essential for mobile-first indexing'
        : 'Add viewport meta tag - mobile optimization is critical for SEO',
    },
    {
      id: 'images',
      label: 'Image Alt Text',
      status: images.length === 0 || imagesWithAlt / images.length >= 0.8 ? 'good' 
        : imagesWithAlt / images.length >= 0.5 ? 'warning' : 'bad',
      importance: 'medium',
      tip: images.length > 0 
        ? `${imagesWithAlt} of ${images.length} images have alt text. Alt text helps SEO and accessibility.`
        : 'No images detected on page',
    },
    {
      id: 'performance',
      label: 'Resource Hints',
      status: meta.hasPreload || meta.hasPreconnect ? 'good' : 'warning',
      importance: 'medium',
      tip: meta.hasPreload || meta.hasPreconnect
        ? 'Resource hints detected - helps with page speed'
        : 'Add preload/preconnect hints to improve Core Web Vitals',
    },
    {
      id: 'responsive-images',
      label: 'Responsive Images',
      status: meta.hasResponsiveImages ? 'good' : 'warning',
      importance: 'low',
      tip: meta.hasResponsiveImages
        ? 'Using responsive images with srcset - great for performance'
        : 'Consider using srcset for responsive images',
    },
  ];

  const goodCount = factors.filter(f => f.status === 'good').length;
  const seoScore = Math.round((goodCount / factors.length) * 100);

  const getStatusIcon = (status: SEOFactor['status']) => {
    switch (status) {
      case 'good': return CheckCircle2;
      case 'warning': return AlertCircle;
      case 'bad': return AlertCircle;
    }
  };

  const getStatusColor = (status: SEOFactor['status']) => {
    switch (status) {
      case 'good': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'bad': return 'text-red-500';
    }
  };

  const getImportanceBadge = (importance: SEOFactor['importance']) => {
    switch (importance) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-amber-500/10 text-amber-500';
      case 'low': return 'bg-blue-500/10 text-blue-500';
    }
  };

  // Extract domain from URL
  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Search className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium">SEO Overview</h3>
          <p className="text-xs text-muted-foreground truncate">{domain}</p>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          seoScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
          seoScore >= 60 ? 'bg-amber-500/10 text-amber-500' :
          'bg-red-500/10 text-red-500'
        }`}>
          {seoScore}%
        </div>
      </div>

      {/* Factors List */}
      <div className="space-y-2">
        {factors.map((factor, index) => {
          const StatusIcon = getStatusIcon(factor.status);
          return (
            <Tooltip key={factor.id}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-help transition-colors"
                >
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${getStatusColor(factor.status)}`} />
                  <span className="text-sm flex-1">{factor.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${getImportanceBadge(factor.importance)}`}>
                    {factor.importance}
                  </span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>{factor.tip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {seoScore >= 80 
            ? 'Good SEO foundation! Focus on content quality and backlinks.'
            : seoScore >= 60
            ? 'Decent SEO basics. Address warnings to improve rankings.'
            : 'SEO needs attention. Fix high-priority issues first.'}
        </p>
      </div>
    </motion.div>
  );
}
