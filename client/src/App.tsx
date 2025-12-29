import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BondedLogo } from "@/components/BondedLogo";
import { NotificationBell } from "@/components/NotificationBell";
import { LogOut } from "lucide-react";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Connection from "@/pages/Connection";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/connection/:id" component={Connection} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  
  // Don't show header on home page (it has its own navigation)
  if (location === "/") return null;
  
  if (!isAuthenticated || !user) return null;
  
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo-home">
          <BondedLogo className="h-7 w-7" />
          <span className="font-semibold text-lg">Bonded</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-profile">
            <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all">
              <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:inline" data-testid="text-username">
              {user.firstName} {user.lastName}
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => logout()} data-testid="button-logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
