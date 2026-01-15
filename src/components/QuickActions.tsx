import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const popularSites = [
  { name: 'Apple', url: 'https://apple.com' },
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'Linear', url: 'https://linear.app' },
  { name: 'Vercel', url: 'https://vercel.com' },
  { name: 'Notion', url: 'https://notion.so' },
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
      className="mt-16"
    >
      <p className="text-xs text-muted-foreground mb-4">
        Try analyzing
      </p>
      
      <div className="flex flex-wrap justify-center gap-2">
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
              className="rounded-full px-4 h-8 text-xs font-medium border-border/50 bg-transparent hover:bg-muted/50 transition-colors"
            >
              {site.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
