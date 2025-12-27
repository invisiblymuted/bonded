import { useRoute } from "wouter";
import { useChild } from "@/hooks/use-children";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Share2, Flag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function ChildDetails() {
  const [match, params] = useRoute("/child/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: child, isLoading, error } = useChild(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">The profile you are looking for does not exist or has been removed.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    missing: "bg-red-100 text-red-700 border-red-200",
    found: "bg-green-100 text-green-700 border-green-200",
    reunited: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const statusLabel = {
    missing: "Missing",
    found: "Found",
    reunited: "Reunited",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search
        </Link>

        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-muted aspect-[3/4] relative">
              {child.photoUrl ? (
                <img src={child.photoUrl} alt={child.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" variant="outline">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button className="flex-1" variant="outline">
                <Flag className="h-4 w-4 mr-2" /> Report Info
              </Button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge className={`px-4 py-1.5 text-sm font-semibold border ${statusColors[child.status as keyof typeof statusColors]}`}>
                  {statusLabel[child.status as keyof typeof statusLabel] || child.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Case ID: #{child.id.toString().padStart(6, '0')}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold font-display text-foreground mb-4">
                {child.name}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-base text-muted-foreground">
                <div className="flex items-center">
                  <span className="font-semibold text-foreground mr-2">Age:</span> {child.age} years
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {child.lastSeenLocation}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  {child.createdAt ? format(new Date(child.createdAt), 'MMMM d, yyyy') : 'Unknown'}
                </div>
              </div>
            </div>

            <Card className="border-border/60 shadow-sm bg-card/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {child.description}
                </p>
              </CardContent>
            </Card>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-6">
              <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-2">Have you seen this child?</h3>
              <p className="text-amber-700 dark:text-amber-300/80 text-sm mb-4">
                If you have any information regarding the whereabouts of {child.name}, please contact local authorities immediately or use the report button.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white border-none w-full sm:w-auto">
                Contact Authorities
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
