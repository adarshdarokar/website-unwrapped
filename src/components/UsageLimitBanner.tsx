import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUsageLimits } from '@/hooks/useUsageLimits';

export function UsageLimitBanner() {
  const navigate = useNavigate();
  const { hasReachedLimit, remaining, limit, isLoggedIn, isPaidUser } = useUsageLimits();

  if (isPaidUser) return null;

  // Show warning when 1-2 remaining
  const showWarning = !hasReachedLimit && remaining <= 2 && remaining > 0;

  if (!hasReachedLimit && !showWarning) return null;

  if (hasReachedLimit) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-6 px-4"
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent border border-destructive/20 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2 bg-destructive/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-0.5">
                {isLoggedIn ? 'Free analysis limit reached' : 'Guest limit reached'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isLoggedIn
                  ? 'You've used all 10 free analyses this month. Upgrade to Pro for unlimited access.'
                  : 'Sign in for 10 free analyses, or upgrade to Pro for unlimited access.'}
              </p>
            </div>
            <div className="flex gap-2">
              {!isLoggedIn && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              )}
              <Button
                size="sm"
                className="rounded-xl text-xs bg-gradient-to-r from-primary to-primary/80"
                onClick={() => navigate('/pricing')}
              >
                Upgrade <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Warning banner
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mb-4 px-4"
    >
      <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3">
        <Zap className="w-4 h-4 text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground flex-1">
          {remaining} of {limit} free {remaining === 1 ? 'analysis' : 'analyses'} remaining
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg text-xs text-primary h-7"
          onClick={() => navigate('/pricing')}
        >
          View Plans
        </Button>
      </div>
    </motion.div>
  );
}
