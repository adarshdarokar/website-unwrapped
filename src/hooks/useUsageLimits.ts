import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

const GUEST_LIMIT = 2;
const FREE_USER_LIMIT = 10;
const STORAGE_KEY = 'webvision_guest_usage';

export function useUsageLimits() {
  const { user } = useAuth();
  const [usageCount, setUsageCount] = useState(0);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const limit = user ? FREE_USER_LIMIT : GUEST_LIMIT;
  const remaining = Math.max(0, limit - usageCount);
  const hasReachedLimit = !isPaidUser && usageCount >= limit;

  useEffect(() => {
    if (user) {
      // For logged-in users, track usage in localStorage keyed by user id
      const stored = localStorage.getItem(`webvision_usage_${user.id}`);
      if (stored) {
        const data = JSON.parse(stored);
        // Reset monthly
        const now = new Date();
        const storedMonth = new Date(data.resetDate);
        if (now.getMonth() !== storedMonth.getMonth() || now.getFullYear() !== storedMonth.getFullYear()) {
          const reset = { count: 0, resetDate: now.toISOString() };
          localStorage.setItem(`webvision_usage_${user.id}`, JSON.stringify(reset));
          setUsageCount(0);
        } else {
          setUsageCount(data.count || 0);
        }
      }
      // Check paid status
      const paidStatus = localStorage.getItem(`webvision_paid_${user.id}`);
      setIsPaidUser(paidStatus === 'true');
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsageCount(parseInt(stored, 10) || 0);
      }
    }
  }, [user]);

  const incrementUsage = useCallback(() => {
    if (isPaidUser) return;

    const newCount = usageCount + 1;
    setUsageCount(newCount);

    if (user) {
      localStorage.setItem(`webvision_usage_${user.id}`, JSON.stringify({
        count: newCount,
        resetDate: new Date().toISOString(),
      }));
    } else {
      localStorage.setItem(STORAGE_KEY, String(newCount));
    }
  }, [usageCount, user, isPaidUser]);

  return {
    usageCount,
    limit,
    remaining,
    hasReachedLimit,
    isPaidUser,
    incrementUsage,
    isLoggedIn: !!user,
  };
}
