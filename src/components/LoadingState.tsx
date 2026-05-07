import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const cardCls = "glass-card p-4 sm:p-5 space-y-4";

function ChartSkeleton({ kind, delay = 0 }: { kind: 'donut' | 'bar' | 'radar' | 'line'; delay?: number }) {
  return (
    <motion.div
      className={cardCls}
      animate={{ opacity: [0.55, 1, 0.55] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="h-[180px] flex items-center justify-center">
        {kind === 'donut' && (
          <div className="relative">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="absolute inset-4 rounded-full bg-card neu-inset" />
          </div>
        )}
        {kind === 'bar' && (
          <div className="w-full h-full flex items-end justify-around gap-2 px-2">
            {[60, 80, 45, 90, 65, 75].map((h, i) => (
              <Skeleton key={i} className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
            ))}
          </div>
        )}
        {kind === 'radar' && (
          <div className="relative w-40 h-40">
            <Skeleton className="absolute inset-0 rounded-full opacity-40" />
            <Skeleton className="absolute inset-4 rounded-full opacity-50" />
            <Skeleton className="absolute inset-8 rounded-full opacity-60" />
            <Skeleton className="absolute inset-12 rounded-full opacity-70" />
          </div>
        )}
        {kind === 'line' && (
          <div className="w-full h-full flex items-center">
            <Skeleton className="h-1 w-full rounded-full" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-full rounded-full" />
        ))}
      </div>
    </motion.div>
  );
}

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-12"
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div>
          <span className="text-sm font-medium text-foreground">Analyzing website…</span>
          <motion.span
            className="block text-xs text-muted-foreground"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Extracting design elements
          </motion.span>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex justify-center">
        <div className="flex gap-1 p-1 rounded-xl neu-inset">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-12 sm:w-16 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Mobile-first: single column, sidebar interleaved on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4 min-w-0">
          {/* Summary card */}
          <motion.div
            className={cardCls}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="neu-inset p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar charts on mobile only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <ChartSkeleton kind="donut" delay={0.1} />
            <ChartSkeleton kind="line" delay={0.15} />
          </div>

          {/* Performance & Accessibility */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ChartSkeleton kind="bar" delay={0.2} />
            <ChartSkeleton kind="bar" delay={0.3} />
          </div>

          {/* Score breakdown row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ChartSkeleton kind="bar" delay={0.4} />
            <ChartSkeleton kind="radar" delay={0.45} />
          </div>

          {/* Design insights */}
          <motion.div
            className={cardCls}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="neu-inset p-3 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar - hidden on mobile (already shown inline) */}
        <div className="hidden md:block space-y-4 md:sticky md:top-20 md:self-start">
          <ChartSkeleton kind="donut" delay={0.1} />
          <ChartSkeleton kind="radar" delay={0.2} />
          <motion.div
            className={cardCls}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            <Skeleton className="h-4 w-28" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
