import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import LoadingScreen from "@/components/LoadingScreen";
import Leaderboard from "@/pages/leaderboard";
import Milestones from "@/pages/milestones";
import Challenges from "@/pages/challenges";
import FreeSpins from "@/pages/free-spins";
import Referral from "@/pages/referral";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { Menu } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Leaderboard} />
      <Route path="/milestones" component={Milestones} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/free-spins" component={FreeSpins} />
      <Route path="/referral" component={Referral} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingScreen />
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur sticky top-0 z-50" role="banner">
                <div className="flex items-center gap-4">
                  <SidebarTrigger 
                    data-testid="button-sidebar-toggle" 
                    className="hover-elevate" 
                    aria-label="Toggle navigation menu"
                  >
                    <Menu className="w-5 h-5" />
                  </SidebarTrigger>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-600 blur-lg opacity-30 rounded-full" aria-hidden="true"></div>
                      <img 
                        src="https://files.kick.com/images/user/565379/profile_image/conversion/6165ea43-dffd-419e-b4ea-b3ebde51a45e-fullsize.webp" 
                        alt="MojoTX Profile Picture" 
                        className="relative w-10 h-10 rounded-full border-2 border-red-600/30"
                      />
                    </div>
                    <div>
                      <h1 className="text-lg font-black text-white">
                        Mojo<span className="text-red-600">TX</span>
                      </h1>
                      <p className="text-xs text-zinc-500">Rewards Hub</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://gamdom.com/r/mojokick" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover-elevate active-elevate-2 transition-all shadow-lg shadow-red-600/20"
                    aria-label="Play on Gamdom casino"
                  >
                    Play on Gamdom
                  </a>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto" role="main">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
