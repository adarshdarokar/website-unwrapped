import { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoVision from "@/assets/logo-vision.jpg";

import { UserMenu } from "@/components/UserMenu";
import { AppSidebar } from "@/components/AppSidebar";

function getTitle(pathname: string) {
  if (pathname === "/") return "Analyze";
  if (pathname === "/history") return "History";
  if (pathname === "/settings") return "Settings";
  if (pathname === "/pricing") return "Upgrade Plan";
  return "";
}

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitle(location.pathname);
  const isInnerPage = location.pathname !== "/";

  return (
    <div className="min-h-svh flex w-full">
      <AppSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg md:hidden"
                onClick={() => window.dispatchEvent(new CustomEvent("app:toggleSidebar"))}
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </Button>

              {isInnerPage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="h-8 w-8 rounded-lg -ml-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}

              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display font-semibold text-sm sm:text-base hidden xs:inline">
                  WebVision
                </span>
              </div>

              <div className="hidden md:flex items-center">
                <span className="mx-2 text-border">/</span>
                <span className="text-sm text-muted-foreground font-medium">{title}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
