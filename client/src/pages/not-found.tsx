import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      
      <h1 className="text-4xl font-bold font-display text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link href="/app">
        <Button size="lg" className="font-semibold">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
