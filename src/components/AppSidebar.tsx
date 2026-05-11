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
  ChevronLeft,
  ChevronRight,
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
  { title: "Command", icon: Command, event: "app:commandPalette" },
  { title: "Compare", icon: GitCompare, event: "app:compare" },
  { title: "Export", icon: Share2, event: "app:export" },
  { title: "Shortcuts", icon: Keyboard, event: "app:shortcuts" },
];

interface RailItemProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  expanded?: boolean;
  onClick: () => void;
}

function RailItem({ label, icon: Icon, active, expanded, onClick }: RailItemProps) {
  const button = (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "h-10 flex items-center rounded-xl transition-all duration-200 overflow-hidden",
        expanded ? "w-full px-3 gap-3 justify-start" : "w-10 justify-center",
        active
          ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.15)]"
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
      )}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {expanded && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}
    </button>
  );

  if (expanded) return button;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function RailContent({ expanded }: { expanded: boolean }) {
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
      <div className={cn("flex flex-col gap-1", expanded ? "items-stretch" : "items-center")}>
        {navItems.map((item) => (
          <RailItem
            key={item.title}
            label={item.title}
            icon={item.icon}
            expanded={expanded}
            active={location.pathname === item.url}
            onClick={() => navigate(item.url)}
          />
        ))}
      </div>

      <div className="my-3 h-px bg-border/60 mx-2" />

      <div className={cn("flex flex-col gap-1", expanded ? "items-stretch" : "items-center")}>
        {actionItems.map((item) => (
          <RailItem
            key={item.title}
            label={item.title}
            icon={item.icon}
            expanded={expanded}
            onClick={() => dispatchAppEvent(item.event)}
          />
        ))}
      </div>

      <div className={cn("mt-auto flex flex-col gap-2 pt-3", expanded ? "items-stretch" : "items-center")}>
        <div className="h-px bg-border/60 mx-2" />
        <div className={cn("flex", expanded ? "justify-start px-1" : "justify-center")}>
          <ThemeToggle />
        </div>
        <button
          onClick={handleUpgradeClick}
          aria-label={isPaidUser ? "Pro plan" : "Upgrade to Pro"}
          className={cn(
            "h-10 flex items-center rounded-xl transition-all duration-200 overflow-hidden bg-primary/10 text-primary hover:bg-primary/15",
            expanded ? "w-full px-3 gap-3 justify-start" : "w-10 justify-center"
          )}
        >
          <Crown className="w-[18px] h-[18px] shrink-0" />
          {expanded && (
            <span className="text-sm font-medium truncate">
              {isPaidUser ? "Pro" : "Upgrade"}
            </span>
          )}
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
  // collapsed = compact icon-only rail (default). expanded = wider with labels.
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("webvision_sidebar_collapsed") !== "0";
  });

  useEffect(() => {
    const open = () => setMobileOpen(true);
    const toggleDesktop = () => setCollapsed((c) => !c);
    window.addEventListener("app:toggleSidebar", open);
    window.addEventListener("app:toggleSidebarDesktop", toggleDesktop);
    return () => {
      window.removeEventListener("app:toggleSidebar", open);
      window.removeEventListener("app:toggleSidebarDesktop", toggleDesktop);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("webvision_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const railWidth = collapsed ? 56 : 220;

  return (
    <>
      {/* Desktop floating rail — always visible */}
      <aside
        style={{ width: railWidth }}
        className={cn(
          "hidden md:flex fixed top-3 bottom-3 left-3 z-30 flex-col rounded-2xl bg-sidebar/85 backdrop-blur-xl border border-sidebar-border/40 shadow-[0_8px_30px_-10px_hsla(245,40%,40%,0.18)] overflow-hidden transition-[width] duration-300 ease-out",
          collapsed ? "px-2 py-3" : "px-3 py-3"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
          <RailContent expanded={!collapsed} />
        </div>
      </aside>

      {/* Floating collapse/expand toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{ left: railWidth + 6 }}
        className="hidden md:flex fixed top-6 z-40 w-6 h-6 items-center justify-center rounded-full bg-card border border-border/60 shadow-md text-muted-foreground hover:text-foreground hover:bg-card/95 transition-[left] duration-300 ease-out"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Spacer to reserve layout width on desktop */}
      <div
        style={{ width: railWidth + 18 }}
        className="hidden md:block flex-shrink-0 transition-[width] duration-300 ease-out"
        aria-hidden
      />

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[80px] p-3 bg-sidebar/95 backdrop-blur-xl border-sidebar-border/40 [&>button]:hidden overflow-hidden"
        >
          <div className="flex h-full flex-col items-stretch min-w-0 overflow-hidden">
            <RailContent expanded={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
