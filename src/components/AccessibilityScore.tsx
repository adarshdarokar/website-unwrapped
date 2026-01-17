import { motion } from 'framer-motion';
import { 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Contrast,
  Type,
  ImageIcon,
  MousePointer,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AccessibilityScoreProps {
  images: { src: string; alt: string }[];
  meta: {
    hasViewport: boolean;
    isHttps: boolean;
  };
  colors: string[];
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
}

interface A11yCheck {
  id: string;
  label: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  icon: typeof Eye;
}

// Helper function to check if a color might have sufficient contrast
function isLikelyReadable(hex: string): boolean {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return true;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Middle gray colors are hardest to use accessibly
  return luminance < 0.3 || luminance > 0.7;
}

export function AccessibilityScore({ images, meta, colors, fonts }: AccessibilityScoreProps) {
  // Calculate accessibility checks
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
  const altTextRatio = images.length > 0 ? imagesWithAlt / images.length : 1;
  
  const readableColors = colors.filter(isLikelyReadable);
  const colorContrastRatio = colors.length > 0 ? readableColors.length / colors.length : 1;
  
  const hasSystemFonts = fonts.detected.some(f => 
    ['Inter', 'Roboto', 'Open Sans', 'system-ui'].some(sf => f.includes(sf))
  );

  const checks: A11yCheck[] = [
    {
      id: 'alt-text',
      label: 'Image Alt Text',
      description: altTextRatio >= 0.8 
        ? `${Math.round(altTextRatio * 100)}% of images have alt text`
        : `Only ${Math.round(altTextRatio * 100)}% of images have alt text`,
      status: altTextRatio >= 0.8 ? 'pass' : altTextRatio >= 0.5 ? 'warning' : 'fail',
      icon: ImageIcon,
    },
    {
      id: 'viewport',
      label: 'Mobile Viewport',
      description: meta.hasViewport 
        ? 'Viewport meta tag is properly configured'
        : 'Missing viewport meta tag for mobile accessibility',
      status: meta.hasViewport ? 'pass' : 'fail',
      icon: MousePointer,
    },
    {
      id: 'color-contrast',
      label: 'Color Contrast',
      description: colorContrastRatio >= 0.7
        ? 'Most colors appear to have good contrast'
        : 'Some colors may have contrast issues',
      status: colorContrastRatio >= 0.7 ? 'pass' : colorContrastRatio >= 0.4 ? 'warning' : 'fail',
      icon: Contrast,
    },
    {
      id: 'typography',
      label: 'Readable Fonts',
      description: hasSystemFonts || fonts.googleFonts.length > 0
        ? 'Uses web-safe or Google Fonts'
        : 'Consider using established readable fonts',
      status: hasSystemFonts || fonts.googleFonts.length > 0 ? 'pass' : 'warning',
      icon: Type,
    },
  ];

  const passCount = checks.filter(c => c.status === 'pass').length;
  const a11yScore = Math.round((passCount / checks.length) * 100);

  const getStatusColor = (status: A11yCheck['status']) => {
    switch (status) {
      case 'pass': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'fail': return 'text-red-500';
    }
  };

  const getStatusBg = (status: A11yCheck['status']) => {
    switch (status) {
      case 'pass': return 'bg-emerald-500/10';
      case 'warning': return 'bg-amber-500/10';
      case 'fail': return 'bg-red-500/10';
    }
  };

  const getStatusIcon = (status: A11yCheck['status']) => {
    switch (status) {
      case 'pass': return CheckCircle2;
      case 'warning': return AlertCircle;
      case 'fail': return XCircle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <Eye className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Accessibility</h3>
            <p className="text-xs text-muted-foreground">{passCount}/{checks.length} checks passed</p>
          </div>
        </div>
        
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          a11yScore >= 75 ? 'bg-emerald-500/10 text-emerald-500' :
          a11yScore >= 50 ? 'bg-amber-500/10 text-amber-500' :
          'bg-red-500/10 text-red-500'
        }`}>
          {a11yScore}%
        </div>
      </div>

      {/* Checks */}
      <div className="space-y-2">
        {checks.map((check, index) => {
          const StatusIcon = getStatusIcon(check.status);
          return (
            <Tooltip key={check.id}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-2.5 rounded-lg ${getStatusBg(check.status)} cursor-help transition-all hover:scale-[1.01]`}
                >
                  <div className={`p-1.5 rounded-md bg-background/50`}>
                    <check.icon className={`w-4 h-4 ${getStatusColor(check.status)}`} />
                  </div>
                  <span className="text-sm font-medium flex-1">{check.label}</span>
                  <StatusIcon className={`w-4 h-4 ${getStatusColor(check.status)}`} />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>{check.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Tip */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          These are basic automated checks. For full accessibility audits, use tools like Lighthouse or axe.
        </p>
      </div>
    </motion.div>
  );
}
