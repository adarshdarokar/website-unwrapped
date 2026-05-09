import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Settings,
  CreditCard,
  Command,
  GitCompare,
  Share2,
  Keyboard,
  Crown,
  Globe,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function dispatchAppEvent(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

const navItems = [
  { title: "Analyze", url: "/", icon: LayoutDashboard },
  { title: "History", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
];

const actionItems = [
  { title: "Command (⌘K)", icon: Command, event: "app:commandPalette" },
  { title: "Compare", icon: GitCompare, event: "app:compare" },
  { title: "Export", icon: Share2, event: "app:export" },
  { title: "Shortcuts", icon: Keyboard, event: "app:shortcuts" },
];

interface RailItemProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick: () => void;
}

function RailItem({ label, icon: Icon, active, onClick }: RailItemProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            aria-label={label}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
              active
                ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.15)]"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            )}
          >
            <Icon className="w-[18px] h-[18px]" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function RailContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPaidUser } = useUsageLimits();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleUpgradeClick = () => {
    if (!user) {
      toast.info("Please sign in first to upgrade.");
      navigate("/auth");
      return;
    }
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    if (user) localStorage.setItem(`webvision_paid_${user.id}`, "true");
    toast.success("🎉 Welcome to Pro! Unlimited analyses unlocked.");
    window.location.reload();
  };

  return (
    <>
      {/* Logo */}
      <div className="flex justify-center pt-1 pb-3">
        <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center shadow-md">
          <Globe className="w-[18px] h-[18px]" />
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-col items-center gap-1.5">
        {navItems.map((item) => (
          <RailItem
            key={item.title}
            label={item.title}
            icon={item.icon}
            active={location.pathname === item.url}
            onClick={() => navigate(item.url)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="my-3 mx-3 h-px bg-border/60" />

      {/* Actions */}
      <div className="flex flex-col items-center gap-1.5">
        {actionItems.map((item) => (
          <RailItem
            key={item.title}
            label={item.title}
            icon={item.icon}
            onClick={() => dispatchAppEvent(item.event)}
          />
        ))}
      </div>

      {/* Bottom: theme toggle + upgrade/pro */}
      <div className="mt-auto flex flex-col items-center gap-2 pt-3">
        <div className="my-1 mx-3 h-px bg-border/60 w-8" />
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        <button
          onClick={handleUpgradeClick}
          aria-label={isPaidUser ? "Pro plan" : "Upgrade to Pro"}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
            "bg-primary/10 text-primary hover:bg-primary/15"
          )}
        >
          <Crown className="w-[18px] h-[18px]" />
        </button>
      </div>

      <RazorpayCheckout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handlePaymentSuccess}
        amount={3}
        planName="Pro"
      />
    </>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const open = () => setMobileOpen(true);
    window.addEventListener("app:toggleSidebar", open);
    return () => window.removeEventListener("app:toggleSidebar", open);
  }, []);

  return (
    <>
      {/* Desktop floating rail */}
      <aside
        className="hidden md:flex fixed left-3 top-3 bottom-3 z-30 w-[60px] flex-col items-stretch py-3 px-2 rounded-2xl bg-sidebar/85 backdrop-blur-xl border border-sidebar-border/40 shadow-[0_8px_30px_-10px_hsla(245,40%,40%,0.18)]"
      >
        <RailContent />
      </aside>
      {/* Spacer to reserve layout width on desktop */}
      <div className="hidden md:block w-[76px] flex-shrink-0" aria-hidden />

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[80px] p-3 bg-sidebar/95 backdrop-blur-xl border-sidebar-border/40 [&>button]:hidden"
        >
          <div className="flex h-full flex-col items-stretch">
            <RailContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
