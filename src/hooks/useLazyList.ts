import { useEffect, useMemo, useState } from 'react';

/**
 * Manual pagination hook. Renders `initial` items, then loads `step` more
 * only when the user clicks the "Show more" button (no auto/IO loading).
 */
export function useLazyList<T>(items: T[], initial = 30, step = 30) {
  const [count, setCount] = useState(initial);

  // Reset when the underlying list length changes (avoid resetting when the
  // parent passes a new array reference on every render).
  useEffect(() => {
    setCount(initial);
  }, [items.length, initial]);

  const visible = useMemo(() => items.slice(0, count), [items, count]);
  const hasMore = count < items.length;
  const remaining = Math.max(items.length - count, 0);
  const nextChunk = Math.min(step, remaining);

  const loadMore = () => setCount((c) => Math.min(c + step, items.length));
  // sentinelRef kept for backward compat but unused
  const sentinelRef = { current: null } as { current: HTMLDivElement | null };

  return { visible, count, hasMore, sentinelRef, loadMore, total: items.length, remaining, nextChunk };
}
