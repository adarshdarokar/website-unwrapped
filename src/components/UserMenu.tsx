import { motion } from 'framer-motion';
import { User, LogOut, History, Settings, ChevronDown } from 'lucide-react';
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
    return (
      <div className="w-10 h-10 rounded-xl bg-muted/50 animate-pulse" />
    );
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
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-medium">
            {initials}
          </div>
          <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
            {displayName}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card border-border rounded-xl p-2 z-50"
        sideOffset={8}
      >
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          onClick={() => navigate('/history')}
          className="rounded-lg cursor-pointer"
        >
          <History className="w-4 h-4 mr-2" />
          My Analyses
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/settings')}
          className="rounded-lg cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
