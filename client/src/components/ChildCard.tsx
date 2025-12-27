import { Link } from "wouter";
import { type Child } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChildCardProps {
  child: Child;
  className?: string;
}

export function ChildCard({ child, className }: ChildCardProps) {
  const statusColors = {
    missing: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
    found: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
    reunited: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  };

  const statusLabel = {
    missing: "Missing",
    found: "Found",
    reunited: "Reunited",
  };

  return (
    <Card className={cn(
      "group overflow-hidden rounded-2xl border-border bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300", 
      className
    )}>
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {child.photoUrl ? (
          <img 
            src={child.photoUrl} 
            alt={child.name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-secondary/30">
            <span className="text-4xl">👤</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className={cn("px-3 py-1 font-semibold shadow-sm border", statusColors[child.status as keyof typeof statusColors])}>
            {statusLabel[child.status as keyof typeof statusLabel] || child.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground font-display group-hover:text-primary transition-colors">
          {child.name}
        </h3>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium mr-2">Age:</span> {child.age} years old
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary/70" />
            <span className="truncate">{child.lastSeenLocation}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary/70" />
            <span>Last seen: {child.createdAt ? format(new Date(child.createdAt), 'MMM d, yyyy') : 'Unknown'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/child/${child.id}`} className="w-full">
          <div className="w-full py-2.5 rounded-lg border border-border bg-transparent text-center text-sm font-semibold text-foreground hover:bg-secondary/50 hover:text-primary transition-all flex items-center justify-center group/btn cursor-pointer">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
