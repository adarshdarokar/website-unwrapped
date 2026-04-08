import { motion } from 'framer-motion';
import { 
  Eye, CheckCircle2, AlertCircle, XCircle,
  Contrast, Type, ImageIcon, MousePointer, Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface AccessibilityScoreProps {
  images: { src: string; alt: string }[];
  meta: { hasViewport: boolean; isHttps: boolean };
  colors: string[];
  fonts: { detected: string[]; googleFonts: string[] };
}

interface A11yCheck {
  id: string;
  label: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  icon: typeof Eye;
}

function isLikelyReadable(hex: string): boolean {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return true;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.3 || luminance > 0.7;
}

const STATUS_COLORS = {
  pass: 'hsl(160, 45%, 50%)',
  warning: 'hsl(40, 60%, 55%)',
  fail: 'hsl(0, 55%, 55%)',
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

export function AccessibilityScore({ images, meta, colors, fonts }: AccessibilityScoreProps) {
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
  const altTextRatio = images.length > 0 ? imagesWithAlt / images.length : 1;
  const readableColors = colors.filter(isLikelyReadable);
  const colorContrastRatio = colors.length > 0 ? readableColors.length / colors.length : 1;
  const hasSystemFonts = fonts.detected.some(f => ['Inter', 'Roboto', 'Open Sans', 'system-ui'].some(sf => f.includes(sf)));

  const checks: A11yCheck[] = [
    { id: 'alt-text', label: 'Image Alt Text', description: altTextRatio >= 0.8 ? `${Math.round(altTextRatio * 100)}% of images have alt text` : `Only ${Math.round(altTextRatio * 100)}% of images have alt text`, status: altTextRatio >= 0.8 ? 'pass' : altTextRatio >= 0.5 ? 'warning' : 'fail', icon: ImageIcon },
    { id: 'viewport', label: 'Mobile Viewport', description: meta.hasViewport ? 'Viewport meta tag is properly configured' : 'Missing viewport meta tag for mobile accessibility', status: meta.hasViewport ? 'pass' : 'fail', icon: MousePointer },
    { id: 'color-contrast', label: 'Color Contrast', description: colorContrastRatio >= 0.7 ? 'Most colors appear to have good contrast' : 'Some colors may have contrast issues', status: colorContrastRatio >= 0.7 ? 'pass' : colorContrastRatio >= 0.4 ? 'warning' : 'fail', icon: Contrast },
    { id: 'typography', label: 'Readable Fonts', description: hasSystemFonts || fonts.googleFonts.length > 0 ? 'Uses web-safe or Google Fonts' : 'Consider using established readable fonts', status: hasSystemFonts || fonts.googleFonts.length > 0 ? 'pass' : 'warning', icon: Type },
  ];

  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const a11yScore = Math.round((passCount / checks.length) * 100);

  const donutData = [
    { name: 'Passed', value: passCount },
    { name: 'Warnings', value: warnCount },
    { name: 'Failed', value: failCount },
  ].filter(d => d.value > 0);

  const donutColors = [STATUS_COLORS.pass, STATUS_COLORS.warning, STATUS_COLORS.fail];

  const getStatusColor = (status: A11yCheck['status']) => {
    switch (status) {
      case 'pass': return 'text-emerald-400 dark:text-emerald-300';
      case 'warning': return 'text-amber-400 dark:text-amber-300';
      case 'fail': return 'text-red-400 dark:text-red-300';
    }
  };

  const getStatusBg = (status: A11yCheck['status']) => {
    switch (status) {
      case 'pass': return 'bg-emerald-500/8';
      case 'warning': return 'bg-amber-500/8';
      case 'fail': return 'bg-red-500/8';
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-xl overflow-hidden h-full">
      <div className="p-4 border-b border-border bg-gradient-to-r from-violet-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-500/10 rounded-xl">
            <Eye className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Accessibility</h3>
            <p className="text-xs text-muted-foreground">{passCount}/{checks.length} checks passed</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Donut */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-[80px] h-[80px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={24} outerRadius={36}
                  paddingAngle={3} dataKey="value" stroke="none">
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={donutColors[i]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${a11yScore >= 75 ? 'text-emerald-400' : a11yScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {a11yScore}%
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: donutColors[i] }} />
                <span className="text-[10px] text-muted-foreground flex-1">{d.name}</span>
                <span className="text-[10px] font-semibold tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Checks */}
        <div className="space-y-2">
          {checks.map((check, index) => {
            const StatusIcon = getStatusIcon(check.status);
            return (
              <Tooltip key={check.id}>
                <TooltipTrigger asChild>
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${getStatusBg(check.status)} cursor-help transition-all hover:scale-[1.01]`}>
                    <div className="p-1.5 rounded-lg bg-background/60">
                      <check.icon className={`w-3.5 h-3.5 ${getStatusColor(check.status)}`} />
                    </div>
                    <span className="text-xs font-medium flex-1">{check.label}</span>
                    <StatusIcon className={`w-4 h-4 ${getStatusColor(check.status)}`} />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs"><p>{check.description}</p></TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-muted/40 rounded-xl flex gap-2 border border-border/50">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            These are basic automated checks. For full accessibility audits, use tools like Lighthouse or axe.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
