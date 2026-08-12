import { useSafeNavigate } from '@/hooks/useSafeNavigate';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CreditsIndicatorProps {
  remaining: number;
  limit: number;
  isPaidUser: boolean;
  hasReachedLimit: boolean;
}

export function CreditsIndicator({ remaining, limit, isPaidUser, hasReachedLimit }: CreditsIndicatorProps) {
  const navigate = useSafeNavigate();

  if (isPaidUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-1.5 mt-3"
      >
        <Sparkles className="w-3 h-3 text-primary" />
        <span className="text-xs text-primary font-medium">Unlimited analyses</span>
      </motion.div>
    );
  }

  const percentage = Math.round((remaining / limit) * 100);
  const isLow = remaining <= 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex items-center justify-center gap-2.5 mt-3"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
        <div className="w-16 h-1.5 rounded-full bg-border/60 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hasReachedLimit
                ? 'bg-destructive'
                : isLow
                ? 'bg-yellow-500'
                : 'bg-primary'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          hasReachedLimit ? 'text-destructive' : isLow ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'
        }`}>
          {remaining}/{limit} left
        </span>
      </div>

      {hasReachedLimit && (
        <button
          onClick={() => navigate('/pricing')}
          className="text-xs font-medium text-primary hover:underline"
        >
          Upgrade
        </button>
      )}
    </motion.div>
  );
}
