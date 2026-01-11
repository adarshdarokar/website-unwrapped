import { motion } from 'framer-motion';
import { Bookmark, Clock, Star, TrendingUp, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const popularSites = [
  { name: 'Apple', url: 'https://apple.com', icon: '🍎' },
  { name: 'Stripe', url: 'https://stripe.com', icon: '💳' },
  { name: 'Linear', url: 'https://linear.app', icon: '📐' },
  { name: 'Vercel', url: 'https://vercel.com', icon: '▲' },
  { name: 'Figma', url: 'https://figma.com', icon: '🎨' },
  { name: 'Notion', url: 'https://notion.so', icon: '📝' },
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
      transition={{ delay: 0.3 }}
      className="mt-8"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Quick analyze popular sites</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2">
        {popularSites.map((site, index) => (
          <motion.div
            key={site.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnalyze(site.url)}
              disabled={isLoading}
              className="rounded-full px-4 border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all"
            >
              <span className="mr-2">{site.icon}</span>
              {site.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
