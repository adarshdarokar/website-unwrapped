import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Palette, 
  Type, 
  Layout, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface DesignInsightsProps {
  colors: string[];
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
  animations: {
    cssAnimations: string[];
    transitions: string[];
    keyframes: string[];
  };
  score: number;
}

interface Insight {
  category: string;
  icon: typeof Palette;
  title: string;
  description: string;
  type: 'positive' | 'suggestion' | 'info';
}

export function DesignInsights({ colors, fonts, animations, score }: DesignInsightsProps) {
  const totalAnimations = animations.cssAnimations.length + animations.transitions.length + animations.keyframes.length;
  const uniqueColors = [...new Set(colors)];
  const fontCount = fonts.detected.length + fonts.googleFonts.length;

  // Generate contextual insights based on actual data
  const insights: Insight[] = [];

  // Color insights
  if (uniqueColors.length >= 3 && uniqueColors.length <= 7) {
    insights.push({
      category: 'Colors',
      icon: Palette,
      title: 'Well-balanced palette',
      description: `Using ${uniqueColors.length} colors creates visual harmony without overwhelming users.`,
      type: 'positive',
    });
  } else if (uniqueColors.length > 10) {
    insights.push({
      category: 'Colors',
      icon: Palette,
      title: 'Consider simplifying colors',
      description: `${uniqueColors.length} colors detected. A focused palette of 3-5 colors often works better.`,
      type: 'suggestion',
    });
  }

  // Font insights
  if (fontCount <= 3) {
    insights.push({
      category: 'Typography',
      icon: Type,
      title: 'Clean typography',
      description: `Using ${fontCount || 'minimal'} font families keeps the design cohesive and loads faster.`,
      type: 'positive',
    });
  } else if (fontCount > 4) {
    insights.push({
      category: 'Typography',
      icon: Type,
      title: 'Font variety',
      description: `${fontCount} fonts detected. Consider consolidating to 2-3 for better consistency.`,
      type: 'suggestion',
    });
  }

  // Animation insights
  if (totalAnimations > 0) {
    insights.push({
      category: 'Motion',
      icon: Sparkles,
      title: totalAnimations > 10 ? 'Rich animations' : 'Subtle motion',
      description: totalAnimations > 10 
        ? 'Heavy animation usage. Ensure performance on lower-end devices.'
        : `${totalAnimations} animation properties create engaging interactions.`,
      type: totalAnimations > 15 ? 'suggestion' : 'positive',
    });
  }

  // Score-based insights
  if (score >= 80) {
    insights.push({
      category: 'Overall',
      icon: CheckCircle2,
      title: 'Excellent design quality',
      description: 'This website demonstrates strong design principles and modern techniques.',
      type: 'positive',
    });
  } else if (score < 50) {
    insights.push({
      category: 'Overall',
      icon: Layout,
      title: 'Room for improvement',
      description: 'Consider adding more design polish like custom fonts, refined colors, and subtle animations.',
      type: 'suggestion',
    });
  }

  // Add a general tip
  insights.push({
    category: 'Tip',
    icon: Lightbulb,
    title: 'Design consistency',
    description: 'Great designs use consistent spacing, typography scales, and color application throughout.',
    type: 'info',
  });

  const getTypeStyles = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      case 'suggestion':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
    }
  };

  const getIconBg = (type: Insight['type']) => {
    switch (type) {
      case 'positive': return 'bg-emerald-500/20';
      case 'suggestion': return 'bg-amber-500/20';
      case 'info': return 'bg-blue-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Lightbulb className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium">Design Insights</h3>
          <p className="text-xs text-muted-foreground">AI-powered analysis</p>
        </div>
      </div>

      {/* Insights list */}
      <div className="space-y-3">
        {insights.slice(0, 4).map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${getTypeStyles(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-md ${getIconBg(insight.type)} flex-shrink-0`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium uppercase opacity-60">{insight.category}</span>
                </div>
                <p className="text-sm font-medium mb-0.5">{insight.title}</p>
                <p className="text-xs opacity-80">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
