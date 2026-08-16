import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        'group relative w-11 h-11 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0',
        'bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur-md',
        'border border-border/40 hover:border-primary/30',
        'shadow-[var(--shadow-neu-sm)] hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.08),var(--shadow-neu-sm)]',
        'transition-all duration-300 ease-out active:scale-95',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, hsl(var(--primary)/0.18), transparent 70%)' }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 340, damping: 24 }}
            className="relative"
          >
            <Moon className="w-[18px] h-[18px] text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 340, damping: 24 }}
            className="relative"
          >
            <Sun className="w-[18px] h-[18px] text-amber-500 drop-shadow-[0_0_6px_hsl(45_95%_55%/0.45)]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
