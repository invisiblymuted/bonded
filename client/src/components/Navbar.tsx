import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Search, ShieldCheck, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const navLinks = [
    { href: "/", label: "Search" },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: "/dashboard", label: "Dashboard" });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <HeartHandshake className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary font-display hidden sm:block">
                Reunite
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                    location === link.href 
                      ? "text-foreground bg-muted" 
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                      <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && <p className="font-medium">{user.firstName} {user.lastName}</p>}
                      {user?.email && <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>My Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => window.location.href = "/api/login"} className="font-semibold shadow-lg shadow-primary/20">
                Log In
              </Button>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navLinks.map((link) => (
                    <DropdownMenuItem key={link.href} onClick={() => window.location.href = link.href}>
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
