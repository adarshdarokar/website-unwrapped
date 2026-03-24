import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-6 pb-12"
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-3 py-4">
        <motion.div
          className="w-5 h-5 rounded-full border-2 border-transparent border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <span className="text-sm text-muted-foreground font-medium">Analyzing website…</span>
      </div>

      {/* Skeleton: Result header */}
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      {/* Skeleton: Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 sm:w-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Skeleton: Overview grid */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {/* Summary card */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Performance & Accessibility */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Design Insights */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Quality score */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center justify-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-28" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
