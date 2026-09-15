import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/Logo';

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
      {/* Branded analysis splash */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card/80 px-5 py-8 shadow-[var(--shadow-neu-sm)] sm:px-8 sm:py-10"
        aria-live="polite"
        aria-label="Web Vision is analyzing the website"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
        <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: [1, 1.015, 1] }}
            transition={{
              opacity: { duration: 0.35 },
              scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="flex w-full max-w-[220px] items-center justify-center sm:max-w-[260px]"
          >
            <Logo fitWidth priority alt="Web Vision" />
          </motion.div>

          <div className="mt-6 flex items-center gap-3">
            <div className="relative h-8 w-8 shrink-0" aria-hidden>
              <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground sm:text-base">Analyzing website…</p>
              <motion.p
                className="mt-0.5 text-xs text-muted-foreground sm:text-sm"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Extracting its design DNA
              </motion.p>
            </div>
          </div>

          <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted" aria-hidden>
            <motion.div
              className="h-full w-1/3 rounded-full bg-primary"
              animate={{ x: ['-110%', '310%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            Reviewing colors, typography, media, performance, and accessibility
          </p>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Tabs skeleton */}
        <div className="flex justify-center overflow-hidden">
          <div className="flex max-w-full gap-1 overflow-hidden rounded-xl p-1 neu-inset">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-10 shrink-0 rounded-lg sm:w-16" />
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
    </motion.div>
  );
}
