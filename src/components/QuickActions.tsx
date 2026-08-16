import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const popularSites = [
  { name: 'Apple', url: 'https://apple.com', emoji: '🍎' },
  { name: 'Stripe', url: 'https://stripe.com', emoji: '💳' },
  { name: 'Linear', url: 'https://linear.app', emoji: '⚡' },
  { name: 'Vercel', url: 'https://vercel.com', emoji: '▲' },
  { name: 'Notion', url: 'https://notion.so', emoji: '📝' },
];

interface QuickActionsProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function QuickActions({ onAnalyze, isLoading }: QuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mt-12 sm:mt-16"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Quick start — try these
      </p>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
        {popularSites.map((site, index) => (
          <motion.div
            key={site.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnalyze(site.url)}
              disabled={isLoading}
              className="rounded-full px-4 h-11 sm:h-10 text-[13px] sm:text-xs font-medium border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all gap-1.5 group"
            >
              <span>{site.emoji}</span>
              <span>{site.name}</span>
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
