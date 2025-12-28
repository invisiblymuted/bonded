import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRelationships, useCreateRelationship } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useLocation } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { MessageSquare, BookOpen, Share2, Loader2, ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: relationships, isLoading } = useRelationships();
  const createRelationship = useCreateRelationship();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [childName, setChildName] = useState("");
  const [childId, setChildId] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  const handleCreateConnection = () => {
    if (!childName.trim() || !childId.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    createRelationship.mutate(
      { parentId: user!.id, childId, childName },
      {
        onSuccess: () => {
          setIsOpen(false);
          setChildName("");
          setChildId("");
          toast({ title: "Success", description: "Connection created!" });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create connection", variant: "destructive" });
        },
      }
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <BondedLogo className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Bonded</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </div>
            <a href="/api/logout">
              <Button variant="ghost" size="sm">
                Logout
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground text-lg">
            Stay connected with your loved ones
          </p>
        </motion.div>

        {relationships && relationships.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Heart className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No connections yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first family connection to start sharing moments and memories.
              </p>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    Create Connection <ArrowRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a Connection</DialogTitle>
                    <DialogDescription>Connect with your loved one by entering their information</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Child's ID" value={childId} onChange={(e) => setChildId(e.target.value)} />
                    <Input placeholder="Child's Name" value={childName} onChange={(e) => setChildName(e.target.value)} />
                    <Button onClick={handleCreateConnection} disabled={createRelationship.isPending} className="w-full">
                      {createRelationship.isPending ? "Creating..." : "Create Connection"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relationships?.map((rel, i) => (
              <motion.div
                key={rel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/connection/${rel.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Connected
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {rel.childName}
                      </CardTitle>
                      <CardDescription>
                        Connected since {new Date(rel.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span>Chat & Messages</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Shared Journal</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Share2 className="h-4 w-4" />
                          <span>Media Gallery</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
