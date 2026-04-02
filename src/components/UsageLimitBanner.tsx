import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUsageLimits } from '@/hooks/useUsageLimits';

export function UsageLimitBanner() {
  const navigate = useNavigate();
  const { hasReachedLimit, remaining, limit, isLoggedIn, isPaidUser } = useUsageLimits();

  if (isPaidUser) return null;

  const showWarning = !hasReachedLimit && remaining <= 2 && remaining > 0;

  if (!hasReachedLimit && !showWarning) return null;

  if (hasReachedLimit) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-6 px-4"
      >
        <div className="p-4 sm:p-5 bg-destructive/5 border border-destructive/20 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-2.5 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm mb-0.5">
                {isLoggedIn ? 'Free analysis limit reached' : 'Guest limit reached'}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isLoggedIn
                  ? "You've used all 10 free analyses this month. Upgrade to Pro for unlimited access."
                  : 'Sign in for 10 free analyses, or upgrade to Pro for unlimited access.'}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {!isLoggedIn && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs h-9 flex-1 sm:flex-none"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              )}
              <Button
                size="sm"
                className="rounded-lg text-xs h-9 bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                onClick={() => navigate('/pricing')}
              >
                Upgrade <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mb-4 px-4"
    >
      <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex items-center gap-3">
        <Zap className="w-4 h-4 text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground flex-1">
          {remaining} of {limit} free {remaining === 1 ? 'analysis' : 'analyses'} remaining
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg text-xs text-primary h-8"
          onClick={() => navigate('/pricing')}
        >
          View Plans
        </Button>
      </div>
    </motion.div>
  );
}
