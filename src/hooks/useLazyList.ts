import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Progressive rendering hook. Renders `initial` items, then loads
 * `step` more each time the returned sentinel scrolls into view.
 */
export function useLazyList<T>(items: T[], initial = 24, step = 24) {
  const [count, setCount] = useState(initial);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset when the underlying list changes
  useEffect(() => {
    setCount(initial);
  }, [items, initial]);

  const visible = useMemo(() => items.slice(0, count), [items, count]);
  const hasMore = count < items.length;

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCount((c) => Math.min(c + step, items.length));
        }
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, step, items.length]);

  const loadMore = () => setCount((c) => Math.min(c + step, items.length));

  return { visible, count, hasMore, sentinelRef, loadMore, total: items.length };
}
