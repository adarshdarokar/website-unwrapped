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
        <div className="relative w-8 h-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-1 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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

      {/* Skeleton: Result header */}
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      {/* Skeleton: Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-1 bg-muted/30 p-1 rounded-xl">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 sm:w-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Skeleton: Overview grid */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {/* Summary card */}
          <motion.div
            className="bg-card border border-border rounded-xl p-5 space-y-4"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-muted/20 rounded-lg p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance & Accessibility */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                className="bg-card border border-border rounded-xl p-5 space-y-3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
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
              </motion.div>
            ))}
          </div>

          {/* Design Insights */}
          <motion.div
            className="bg-card border border-border rounded-xl p-5 space-y-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          >
            <Skeleton className="h-4 w-32" />
            <div className="grid sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-muted/20 rounded-lg p-3 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <motion.div
            className="bg-card border border-border rounded-xl p-5 space-y-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
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
          </motion.div>

          <motion.div
            className="bg-card border border-border rounded-xl p-5 space-y-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
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
