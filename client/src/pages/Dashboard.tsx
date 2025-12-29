import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRelationships, useCreateRelationship, useDeleteRelationship } from "@/hooks/use-relationships";
import { useDashboardPreferences, useUpdateDashboardPreferences, type WidgetType } from "@/hooks/use-dashboard-preferences";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Link, useLocation } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { MessageSquare, BookOpen, Share2, Loader2, ArrowRight, Heart, Copy, Check, Settings, ChevronUp, ChevronDown, Image, PenLine, Plus, Trash2, Users } from "lucide-react";
import { GradientIcon } from "@/components/GradientIcon";
import { NotificationBell } from "@/components/NotificationBell";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Message, Relationship } from "@shared/schema";

const WIDGET_INFO: Record<WidgetType, { title: string; description: string; icon: typeof Heart }> = {
  connections: { title: "Connections", description: "Your family connections", icon: Heart },
  recentMessages: { title: "Recent Messages", description: "Latest messages across connections", icon: MessageSquare },
  quickActions: { title: "Quick Actions", description: "Frequently used actions", icon: Plus },
};

function ConnectionsWidget({ relationships, isLoading, user, onOpenCreate }: { 
  relationships: Relationship[] | undefined; 
  isLoading: boolean;
  user: any;
  onOpenCreate: () => void;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GradientIcon icon={<Heart className="h-5 w-5" />} />
            Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!relationships || relationships.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-8 pb-8 text-center">
          <GradientIcon icon={<Heart className="h-12 w-12 opacity-30" />} className="mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first family connection to start sharing.
          </p>
          <Button onClick={onOpenCreate} className="gap-2 btn-gradient" size="sm">
            Create Connection <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {relationships.map((rel, i) => (
        <motion.div
          key={rel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link href={`/connection/${rel.id}`}>
            <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <GradientIcon icon={<Heart className="h-4 w-4" />} />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {(rel as any).otherUserName || rel.childName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Connected since {rel.createdAt ? new Date(rel.createdAt).toLocaleDateString() : "Today"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GradientIcon icon={<MessageSquare className="h-3 w-3" />} />
                    <span>Chat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GradientIcon icon={<BookOpen className="h-3 w-3" />} />
                    <span>Journal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GradientIcon icon={<Share2 className="h-3 w-3" />} />
                    <span>Media</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function RecentMessagesWidget({ relationships }: { relationships: Relationship[] | undefined }) {
  const { data: allMessages, isLoading } = useQuery<{ relationshipId: number; messages: Message[]; connectionName: string }[]>({
    queryKey: ["/api/recent-messages"],
    queryFn: async () => {
      if (!relationships || relationships.length === 0) return [];
      const results = await Promise.all(
        relationships.slice(0, 5).map(async (rel) => {
          try {
            const res = await fetch(`/api/relationships/${rel.id}/messages`);
            if (!res.ok) return { relationshipId: rel.id, messages: [], connectionName: (rel as any).otherUserName || rel.childName };
            const msgs = await res.json();
            return { 
              relationshipId: rel.id, 
              messages: msgs.slice(0, 3),
              connectionName: (rel as any).otherUserName || rel.childName
            };
          } catch {
            return { relationshipId: rel.id, messages: [], connectionName: (rel as any).otherUserName || rel.childName };
          }
        })
      );
      return results.filter(r => r.messages.length > 0);
    },
    enabled: !!relationships && relationships.length > 0,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GradientIcon icon={<MessageSquare className="h-5 w-5" />} />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!allMessages || allMessages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GradientIcon icon={<MessageSquare className="h-5 w-5" />} />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">
            No messages yet. Start a conversation with your connections!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GradientIcon icon={<MessageSquare className="h-5 w-5" />} />
          Recent Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {allMessages.map(({ relationshipId, messages, connectionName }) => (
          <Link key={relationshipId} href={`/connection/${relationshipId}`}>
            <div className="p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{connectionName}</span>
                <span className="text-xs text-muted-foreground">
                  {messages[0]?.createdAt ? new Date(messages[0].createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {messages[0]?.content || "No messages"}
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function QuickActionsWidget({ relationships, onOpenCreate }: { 
  relationships: Relationship[] | undefined;
  onOpenCreate: () => void;
}) {
  const hasConnections = relationships && relationships.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GradientIcon icon={<Plus className="h-5 w-5" />} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onOpenCreate} className="flex-col h-auto py-4 gap-2">
            <GradientIcon icon={<Heart className="h-5 w-5" />} />
            <span className="text-xs">New Connection</span>
          </Button>
          {hasConnections && (
            <>
              <Link href={`/connection/${relationships[0].id}`}>
                <Button variant="outline" className="w-full flex-col h-auto py-4 gap-2">
                  <GradientIcon icon={<MessageSquare className="h-5 w-5" />} />
                  <span className="text-xs">Send Message</span>
                </Button>
              </Link>
              <Link href={`/connection/${relationships[0].id}`}>
                <Button variant="outline" className="w-full flex-col h-auto py-4 gap-2">
                  <GradientIcon icon={<PenLine className="h-5 w-5" />} />
                  <span className="text-xs">Write Journal</span>
                </Button>
              </Link>
              <Link href={`/connection/${relationships[0].id}`}>
                <Button variant="outline" className="w-full flex-col h-auto py-4 gap-2">
                  <GradientIcon icon={<Image className="h-5 w-5" />} />
                  <span className="text-xs">Share Photo</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsPanel({ 
  preferences, 
  onUpdate 
}: { 
  preferences: { widgetOrder: WidgetType[]; hiddenWidgets: WidgetType[]; layoutDensity: "compact" | "spacious" };
  onUpdate: (prefs: Partial<typeof preferences>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const moveWidget = (widgetId: WidgetType, direction: "up" | "down") => {
    const newOrder = [...preferences.widgetOrder];
    const currentIndex = newOrder.indexOf(widgetId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    onUpdate({ widgetOrder: newOrder });
  };

  const toggleWidget = (widgetId: WidgetType) => {
    const isHidden = preferences.hiddenWidgets.includes(widgetId);
    if (isHidden) {
      onUpdate({ hiddenWidgets: preferences.hiddenWidgets.filter(w => w !== widgetId) });
    } else {
      onUpdate({ hiddenWidgets: [...preferences.hiddenWidgets, widgetId] });
    }
  };

  const toggleDensity = () => {
    onUpdate({ layoutDensity: preferences.layoutDensity === "compact" ? "spacious" : "compact" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-dashboard-settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Dashboard</DialogTitle>
          <DialogDescription>Arrange and toggle widgets to personalize your view</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Widget Order</h4>
            <div className="space-y-2">
              {preferences.widgetOrder.map((widgetId, index) => {
                const info = WIDGET_INFO[widgetId];
                const isHidden = preferences.hiddenWidgets.includes(widgetId);
                const Icon = info.icon;
                return (
                  <div key={widgetId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <div>
                        <span className="font-medium text-sm">{info.title}</span>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={!isHidden} 
                        onCheckedChange={() => toggleWidget(widgetId)}
                        data-testid={`switch-widget-${widgetId}`}
                      />
                      <div className="flex flex-col">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={() => moveWidget(widgetId, "up")}
                          data-testid={`button-move-up-${widgetId}`}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          disabled={index === preferences.widgetOrder.length - 1}
                          onClick={() => moveWidget(widgetId, "down")}
                          data-testid={`button-move-down-${widgetId}`}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div>
              <span className="font-medium text-sm">Compact Layout</span>
              <p className="text-xs text-muted-foreground">Use tighter spacing between elements</p>
            </div>
            <Switch 
              checked={preferences.layoutDensity === "compact"} 
              onCheckedChange={toggleDensity}
              data-testid="switch-layout-density"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ManageConnectionsPanel({ 
  relationships, 
  onDelete 
}: { 
  relationships: Relationship[] | undefined;
  onDelete: (id: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); setConfirmDelete(null); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-manage-connections">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Connections</DialogTitle>
          <DialogDescription>View and remove your family connections</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {relationships && relationships.length > 0 ? (
            relationships.map((rel) => (
              <div key={rel.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div className="flex items-center gap-3">
                  <GradientIcon icon={<Heart className="h-4 w-4" />} />
                  <div>
                    <span className="font-medium text-sm">{(rel as any).otherUserName || rel.childName}</span>
                    <p className="text-xs text-muted-foreground">
                      Connected {rel.createdAt ? new Date(rel.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
                {confirmDelete === rel.id ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => { onDelete(rel.id); setConfirmDelete(null); }}
                      data-testid={`button-confirm-delete-${rel.id}`}
                    >
                      Confirm
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setConfirmDelete(null)}
                      data-testid={`button-cancel-delete-${rel.id}`}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setConfirmDelete(rel.id)}
                    className="text-muted-foreground hover:text-destructive"
                    data-testid={`button-delete-connection-${rel.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No connections yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: relationships, isLoading } = useRelationships();
  const { preferences, isLoading: prefsLoading } = useDashboardPreferences();
  const updatePreferences = useUpdateDashboardPreferences();
  const createRelationship = useCreateRelationship();
  const deleteRelationship = useDeleteRelationship();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [childName, setChildName] = useState("");
  const [childId, setChildId] = useState("");
  const [copied, setCopied] = useState(false);

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "Your User ID has been copied to clipboard" });
    }
  };

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

  const handleUpdatePreferences = (prefs: Partial<typeof preferences>) => {
    updatePreferences.mutate(prefs);
  };

  const handleDeleteConnection = (id: number) => {
    deleteRelationship.mutate(id, {
      onSuccess: () => {
        toast({ title: "Removed", description: "Connection has been removed" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to remove connection", variant: "destructive" });
      },
    });
  };

  if (authLoading || isLoading || prefsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your connections...</p>
        </div>
      </div>
    );
  }

  const isCompact = preferences.layoutDensity === "compact";
  const spacing = isCompact ? "space-y-4" : "space-y-6";
  const containerPadding = isCompact ? "py-8" : "py-12";

  const renderWidget = (widgetId: WidgetType) => {
    if (preferences.hiddenWidgets.includes(widgetId)) return null;
    
    switch (widgetId) {
      case "connections":
        return (
          <ConnectionsWidget 
            key={widgetId}
            relationships={relationships} 
            isLoading={isLoading} 
            user={user}
            onOpenCreate={() => setIsOpen(true)}
          />
        );
      case "recentMessages":
        return <RecentMessagesWidget key={widgetId} relationships={relationships} />;
      case "quickActions":
        return (
          <QuickActionsWidget 
            key={widgetId}
            relationships={relationships}
            onOpenCreate={() => setIsOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      {/* Main Content */}
      <div className={`container mx-auto px-4 max-w-5xl ${containerPadding}`}>
        <div className="flex justify-end mb-4 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span><ManageConnectionsPanel relationships={relationships} onDelete={handleDeleteConnection} /></span>
            </TooltipTrigger>
            <TooltipContent>Manage Connections</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span><SettingsPanel preferences={preferences} onUpdate={handleUpdatePreferences} /></span>
            </TooltipTrigger>
            <TooltipContent>Dashboard Settings</TooltipContent>
          </Tooltip>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={isCompact ? "mb-6" : "mb-8"}
        >
          <h1 className={`font-bold mb-2 ${isCompact ? "text-3xl" : "text-4xl"}`}>Welcome back, {user?.firstName}!</h1>
          <p className={`text-muted-foreground mb-4 ${isCompact ? "text-base" : "text-lg"}`}>
            Stay connected with your loved ones
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Your User ID:</span>
            <code className="bg-muted px-3 py-1 rounded text-sm font-mono" data-testid="text-user-id">{user?.id}</code>
            <Button variant="ghost" size="sm" onClick={copyUserId} className="gap-1" data-testid="button-copy-user-id">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <span className="text-xs text-muted-foreground">(Share this with family to connect)</span>
          </div>
        </motion.div>

        <div className={spacing}>
          {preferences.widgetOrder.map(widgetId => renderWidget(widgetId))}
        </div>
      </div>

      {/* Create Connection Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Connection</DialogTitle>
            <DialogDescription>Connect with your loved one by entering their information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Their Name</label>
              <Input placeholder="e.g., Emma, Alex, etc." value={childName} onChange={(e) => setChildName(e.target.value)} data-testid="input-child-name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Their User ID</label>
              <Input placeholder="Ask them to share their user ID from their profile" value={childId} onChange={(e) => setChildId(e.target.value)} data-testid="input-child-id" />
            </div>
            <Button onClick={handleCreateConnection} disabled={createRelationship.isPending} className="w-full btn-gradient" data-testid="button-create-connection">
              {createRelationship.isPending ? "Creating..." : "Create Connection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
