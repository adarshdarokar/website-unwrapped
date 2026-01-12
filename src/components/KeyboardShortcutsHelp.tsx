import { motion } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { shortcuts } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 mt-4">
          {shortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded border bg-background px-2 font-mono text-xs font-medium text-muted-foreground shadow-sm">
                {shortcut.key}
              </kbd>
            </motion.div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Esc</kbd> to close this dialog
        </p>
      </DialogContent>
    </Dialog>
  );
}
