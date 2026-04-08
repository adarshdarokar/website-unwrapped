import { motion } from 'framer-motion';
import { 
  Lightbulb, Palette, Type, Layout, Sparkles, CheckCircle2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DesignInsightsProps {
  colors: string[];
  fonts: { detected: string[]; googleFonts: string[] };
  animations: { cssAnimations: string[]; transitions: string[]; keyframes: string[] };
  score: number;
}

interface Insight {
  category: string;
  icon: typeof Palette;
  title: string;
  description: string;
  type: 'positive' | 'suggestion' | 'info';
}

const RING_COLORS = [
  'hsl(200, 55%, 55%)',   // blue
  'hsl(262, 50%, 58%)',   // violet
  'hsl(40, 60%, 55%)',    // amber
  'hsl(160, 45%, 50%)',   // green
];

const ChartTip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-medium text-foreground">{payload[0].name}</p>
        <p className="text-muted-foreground">{payload[0].value} detected</p>
      </div>
    );
  }
  return null;
};

export function DesignInsights({ colors, fonts, animations, score }: DesignInsightsProps) {
  const totalAnimations = animations.cssAnimations.length + animations.transitions.length + animations.keyframes.length;
  const uniqueColors = [...new Set(colors)];
  const fontCount = fonts.detected.length + fonts.googleFonts.length;

  const insights: Insight[] = [];

  if (uniqueColors.length >= 3 && uniqueColors.length <= 7) {
    insights.push({ category: 'Colors', icon: Palette, title: 'Well-balanced palette', description: `Using ${uniqueColors.length} colors creates visual harmony without overwhelming users.`, type: 'positive' });
  } else if (uniqueColors.length > 10) {
    insights.push({ category: 'Colors', icon: Palette, title: 'Consider simplifying colors', description: `${uniqueColors.length} colors detected. A focused palette of 3-5 colors often works better.`, type: 'suggestion' });
  }

  if (fontCount <= 3) {
    insights.push({ category: 'Typography', icon: Type, title: 'Clean typography', description: `Using ${fontCount || 'minimal'} font families keeps the design cohesive and loads faster.`, type: 'positive' });
  } else if (fontCount > 4) {
    insights.push({ category: 'Typography', icon: Type, title: 'Font variety', description: `${fontCount} fonts detected. Consider consolidating to 2-3 for better consistency.`, type: 'suggestion' });
  }

  if (totalAnimations > 0) {
    insights.push({ category: 'Motion', icon: Sparkles, title: totalAnimations > 10 ? 'Rich animations' : 'Subtle motion', description: totalAnimations > 10 ? 'Heavy animation usage. Ensure performance on lower-end devices.' : `${totalAnimations} animation properties create engaging interactions.`, type: totalAnimations > 15 ? 'suggestion' : 'positive' });
  }

  if (score >= 80) {
    insights.push({ category: 'Overall', icon: CheckCircle2, title: 'Excellent design quality', description: 'This website demonstrates strong design principles and modern techniques.', type: 'positive' });
  } else if (score < 50) {
    insights.push({ category: 'Overall', icon: Layout, title: 'Room for improvement', description: 'Consider adding more design polish like custom fonts, refined colors, and subtle animations.', type: 'suggestion' });
  }

  insights.push({ category: 'Tip', icon: Lightbulb, title: 'Design consistency', description: 'Great designs use consistent spacing, typography scales, and color application throughout.', type: 'info' });

  // Composition donut data
  const compositionData = [
    { name: 'Colors', value: uniqueColors.length || 1 },
    { name: 'Fonts', value: fontCount || 1 },
    { name: 'Animations', value: totalAnimations || 1 },
    { name: 'Score', value: Math.round(score / 10) || 1 },
  ];

  const getTypeStyles = (type: Insight['type']) => {
    switch (type) {
      case 'positive': return 'bg-emerald-500/8 border-emerald-500/15 text-emerald-500 dark:text-emerald-300';
      case 'suggestion': return 'bg-amber-500/8 border-amber-500/15 text-amber-500 dark:text-amber-300';
      case 'info': return 'bg-sky-500/8 border-sky-500/15 text-sky-500 dark:text-sky-300';
    }
  };

  const getIconBg = (type: Insight['type']) => {
    switch (type) {
      case 'positive': return 'bg-emerald-500/15';
      case 'suggestion': return 'bg-amber-500/15';
      case 'info': return 'bg-sky-500/15';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border bg-gradient-to-r from-amber-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Design Insights</h3>
            <p className="text-xs text-muted-foreground">AI-powered analysis & recommendations</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          {/* Mini composition donut */}
          <div className="relative w-[100px] h-[100px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={compositionData} cx="50%" cy="50%" innerRadius={30} outerRadius={44}
                  paddingAngle={3} dataKey="value" stroke="none">
                  {compositionData.map((_, i) => (
                    <Cell key={i} fill={RING_COLORS[i % RING_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-foreground">{score}</span>
              <span className="text-[8px] text-muted-foreground">SCORE</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {compositionData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RING_COLORS[i] }} />
                <span className="text-[10px] text-muted-foreground">{d.name}</span>
                <span className="text-[10px] font-semibold tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {insights.slice(0, 4).map((insight, index) => (
            <motion.div key={insight.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${getTypeStyles(insight.type)} h-full transition-all hover:scale-[1.02]`}>
              <div className="flex flex-col h-full">
                <div className={`p-2 rounded-lg ${getIconBg(insight.type)} w-fit mb-3`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">{insight.category}</span>
                <p className="text-sm font-semibold mb-2 leading-snug">{insight.title}</p>
                <p className="text-xs opacity-75 leading-relaxed flex-1">{insight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
