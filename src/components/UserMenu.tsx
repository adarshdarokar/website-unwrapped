import { motion } from 'framer-motion';
import { User, LogOut, History, Settings, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/auth');
    }
  };

  if (loading) {
    return <div className="w-10 h-10 rounded-xl bg-muted/50 animate-pulse" />;
  }

  if (!user) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => navigate('/auth')}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl px-5 shadow-lg shadow-primary/20 transition-all"
        >
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </motion.div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-md border border-border/40 hover:border-primary/30 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)] transition-all duration-300"
        >
          <span className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-[11px] font-semibold tracking-wide shadow-[inset_0_1px_0_hsl(0_0%_100%/0.25)]">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-success ring-2 ring-background" />
          </span>
          <span className="text-[13px] font-medium hidden sm:block max-w-[110px] truncate text-foreground/90">
            {displayName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 p-2 rounded-2xl border border-border/40 bg-popover/85 backdrop-blur-xl shadow-[0_20px_60px_-20px_hsla(245,40%,30%,0.35)] z-50"
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl px-3 py-3 mb-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10">
          <div className="flex items-center gap-3">
            <span className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-[inset_0_1px_0_hsl(0_0%_100%/0.25)]">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-tight truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground leading-tight truncate mt-0.5">{user.email}</p>
            </div>
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full"
            style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.18), transparent 70%)' }}
          />
        </div>

        <DropdownMenuItem
          onClick={() => navigate('/history')}
          className="rounded-lg cursor-pointer h-9 px-2.5 text-[13px] gap-2.5 focus:bg-primary/10 focus:text-foreground transition-colors"
        >
          <History className="w-4 h-4 text-muted-foreground" />
          My Analyses
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className="rounded-lg cursor-pointer h-9 px-2.5 text-[13px] gap-2.5 focus:bg-primary/10 focus:text-foreground transition-colors"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/pricing')}
          className="rounded-lg cursor-pointer h-9 px-2.5 text-[13px] gap-2.5 focus:bg-primary/10 focus:text-foreground transition-colors"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Upgrade to Pro</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-border/40" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="rounded-lg cursor-pointer h-9 px-2.5 text-[13px] gap-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
