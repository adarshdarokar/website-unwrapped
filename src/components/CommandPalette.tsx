import { useSafeNavigate } from '@/hooks/useSafeNavigate';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Search,
  History,
  GitCompare,
  Share2,
  Moon,
  Sun,
  Globe,
  Keyboard,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCompare: () => void;
  onExport: () => void;
  onAnalyze: (url: string) => void;
  hasResult: boolean;
}

const quickAnalyzeUrls = [
  { name: 'Apple', url: 'apple.com', icon: '🍎' },
  { name: 'Google', url: 'google.com', icon: '🔍' },
  { name: 'GitHub', url: 'github.com', icon: '🐙' },
  { name: 'Dribbble', url: 'dribbble.com', icon: '🏀' },
  { name: 'Stripe', url: 'stripe.com', icon: '💳' },
];

export function CommandPalette({
  isOpen,
  onClose,
  onCompare,
  onExport,
  onAnalyze,
  hasResult,
}: CommandPaletteProps) {
  const navigate = useSafeNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, [isOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    onClose();
  };

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleAction(() => navigate('/history'))}>
            <History className="mr-2 h-4 w-4" />
            <span>View History</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              H
            </kbd>
          </CommandItem>
          
          <CommandItem onSelect={() => handleAction(onCompare)}>
            <GitCompare className="mr-2 h-4 w-4" />
            <span>Compare Websites</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              C
            </kbd>
          </CommandItem>
          
          {hasResult && (
            <CommandItem onSelect={() => handleAction(onExport)}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Export Analysis</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                E
              </kbd>
            </CommandItem>
          )}
          
          <CommandItem onSelect={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              T
            </kbd>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Quick Analyze">
          {quickAnalyzeUrls.map((site) => (
            <CommandItem
              key={site.url}
              onSelect={() => handleAction(() => onAnalyze(site.url))}
            >
              <span className="mr-2">{site.icon}</span>
              <span>Analyze {site.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{site.url}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Help">
          <CommandItem onSelect={() => handleAction(() => {})}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard Shortcuts</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => window.open('https://github.com', '_blank'))}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
