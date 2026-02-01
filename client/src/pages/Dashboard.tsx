import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MessageSquare, BookOpen, Image, Video, 
  Calendar, CheckSquare, HelpCircle, Users
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Relationship {
  id: number;
  userId: number;
  targetId: number;
  status: string;
}

interface MediaItem {
  id: string;
  type: string;
  url: string;
  thumbnail: string;
  uploadedAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [expandedTile, setExpandedTile] = useState<string | null>(null);
  const [tileSelections, setTileSelections] = useState<{ [key: string]: number | null }>({});

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 10000,
  });

  const { data: journals } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journals"],
    refetchInterval: 10000,
  });

  const { data: media } = useQuery<MediaItem[]>({
    queryKey: ["/api/gallery"],
    refetchInterval: 10000,
  });

  const { data: events } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar"],
    refetchInterval: 10000,
  });

  const { data: relationships } = useQuery<Relationship[]>({
    queryKey: ["/api/relationships"],
    refetchInterval: 10000,
  });

  // Get the full user info for connections
  const { data: allUsers } = useQuery<any[]>({
    queryKey: ["/api/users"],
    refetchInterval: 10000,
  });

  // Filter data by selected bond per tile
  const filterDataByBond = (data: any[], bondField: string, tileId: string) => {
    const selectedBond = tileSelections[tileId];
    if (!selectedBond) return data || [];
    return data?.filter(item => String(item[bondField] || item.senderId) === String(selectedBond)) || [];
  };

  const getFilteredData = (tileId: string) => {
    const selectedBond = tileSelections[tileId];
    const msgs = selectedBond 
      ? messages?.filter(m => String(m.senderId) === String(selectedBond)) || []
      : messages || [];
    const jrnls = selectedBond
      ? journals?.filter(j => String((j as any).bondId) === String(selectedBond)) || []
      : journals || [];
    const med = selectedBond
      ? media?.filter(m => String((m as any).bondId) === String(selectedBond)) || []
      : media || [];
    const evts = selectedBond
      ? events?.filter(e => String((e as any).bondId) === String(selectedBond)) || []
      : events || [];
    
    return { msgs, jrnls, med, evts };
  };

  const getSectionPreview = (sectionId: string) => {
    const selectedBond = tileSelections[sectionId];
    
    switch (sectionId) {
      case "messages": {
        const msgs = selectedBond 
          ? messages?.filter(m => String(m.senderId) === String(selectedBond)) || []
          : messages || [];
        const recentMsgs = msgs.slice(0, 3);
        return {
          count: msgs.length,
          badge: msgs.filter(m => !m.read).length > 0 ? `${msgs.filter(m => !m.read).length} new` : null,
          preview: recentMsgs.length > 0 ? (
                        <div className="space-y-2">
              {recentMsgs.map((msg, idx) => (
                <div key={`${msg.senderId}-${idx}`} className="p-2 bg-[#f0ede4] rounded-lg">
                  <p className="text-sm font-bold text-[#2458a0] truncate">{msg.content}</p>
                  <p className="text-[10px] text-[#2458a0] opacity-60 mt-1">
                    {format(new Date(msg.timestamp), "MMM d, h:mm a")}
                  </p>
                </div>
              ))}
            </div>
            ) : (
            <p className="text-sm text-[#2458a0]">{selectedBond ? 'No messages with this bond' : 'No messages yet. Start a conversation!'}</p>
          ),
        };
      }
      case "journal": {
        const jrnls = selectedBond
          ? journals?.filter(j => String((j as any).bondId) === String(selectedBond)) || []
          : journals || [];
        const recentJrnls = jrnls.slice(0, 3);
        return {
          count: jrnls.length,
          preview: recentJrnls.length > 0 ? (
                <div className="space-y-2">
              {recentJrnls.map((entry) => (
                <div key={entry.id} className="p-2 bg-[#f0ede4] rounded-lg">
                  <p className="text-sm font-bold text-[#2458a0]">{entry.title}</p>
                  <p className="text-[10px] text-[#2458a0] opacity-60 mt-1">
                    {format(new Date(entry.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#2458a0]">{selectedBond ? 'No journal entries with this bond' : 'Create your first journal entry'}</p>
          ),
        };
      }
      case "media": {
        const med = selectedBond
          ? media?.filter(m => String((m as any).bondId) === String(selectedBond)) || []
          : media || [];
        const recentMed = med.slice(0, 6);
        return {
          count: med.length,
          preview: recentMed.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {recentMed.map((item) => (
                <div key={item.id} className="aspect-square bg-[#f0ede4] rounded-lg overflow-hidden">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#2458a0]">{selectedBond ? 'No media with this bond' : 'Upload photos and videos to share'}</p>
          ),
        };
      }
      case "video":
        return {
          count: 1,
          preview: (
            <p className="text-sm text-[#2458a0]">Join a private room</p>
          ),
        };
      case "calendar": {
        const evts = selectedBond
          ? events?.filter(e => String((e as any).bondId) === String(selectedBond)) || []
          : events || [];
        const upcomingEvts = evts.slice(0, 3);
        return {
          count: evts.length,
          preview: upcomingEvts.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvts.map((event) => (
                <div key={event.id} className="p-2 bg-[#f0ede4] rounded-lg">
                  <p className="text-sm font-bold text-[#2458a0]">{event.title}</p>
                  <p className="text-[10px] text-[#2458a0] opacity-60 mt-1">
                    {format(new Date(event.date), "MMM d, h:mm a")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#2458a0]">{selectedBond ? 'No calendar events with this bond' : 'Schedule your next connection'}</p>
          ),
        };
      }
      default:
        return { count: 0, preview: null };
    }
  };

  const queryClient = useQueryClient();

  const handleAddItem = async (sectionId: string, relationshipId: number | null) => {
    if (!relationshipId) {
      alert('Select a bond before adding an item');
      return;
    }

    try {
      switch (sectionId) {
        case 'messages': {
          const content = window.prompt('Enter message text');
          if (!content) return;
          await fetch(`/api/relationships/${relationshipId}/messages`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          });
          break;
        }
        case 'journal': {
          const title = window.prompt('Journal title');
          if (!title) return;
          const content = window.prompt('Journal content') || '';
          await fetch(`/api/relationships/${relationshipId}/journal`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
          });
          break;
        }
        case 'calendar': {
          const title = window.prompt('Event title');
          if (!title) return;
          const date = window.prompt('Event date (ISO or YYYY-MM-DD)');
          if (!date) return;
          await fetch(`/api/relationships/${relationshipId}/events`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, eventDate: date, eventType: 'custom' }),
          });
          break;
        }
        case 'media': {
          const url = window.prompt('Media URL (public image/video link)');
          if (!url) return;
          const filename = url.split('/').pop() || 'file';
          await fetch(`/api/relationships/${relationshipId}/media`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'photo', url, filename }),
          });
          break;
        }
        default:
          return;
      }

      // Refresh queries so the new item appears in the UI
      queryClient.invalidateQueries();
    } catch (err) {
      console.error('Add item failed', err);
      alert('Failed to add item');
    }
  };

  const sectionConfigs = [
    { id: "messages", icon: MessageSquare, title: "Messages", color: "from-blue-500 to-blue-600" },
    { id: "journal", icon: BookOpen, title: "Journal", color: "from-amber-500 to-amber-600" },
    { id: "media", icon: Image, title: "Media", color: "from-pink-500 to-pink-600" },
    { id: "video", icon: Video, title: "Video", color: "from-green-500 to-green-600" },
    { id: "calendar", icon: Calendar, title: "Calendar", color: "from-orange-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f0ede4] flex flex-col">
      <Header />
      
      <main className="pt-24 pb-20 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          {/* User Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-white border-[#f0ede4]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#2458a0] to-[#14532d] flex items-center justify-center text-white text-2xl font-black">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-black text-[#2458a0]">
                        {user?.firstName} {user?.lastName}
                      </h1>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bonds Section - Full Width */}
          {relationships && relationships.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-white border-[#dcd7ca]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-[#2458a0]">Your Bonds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relationships.map((rel) => {
                      const connectedUser = allUsers?.find((u: any) => String(u.id) === String(rel.targetId));
                      return (
                        <Link key={rel.id} href={`/connection/${rel.id}`}>
                          <div className="p-4 rounded-xl border-2 transition-all bg-[#f0ede4] border-[#f0ede4] hover:border-[#2458a0] hover:shadow-lg cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 bg-gradient-to-r from-[#2458a0] to-[#14532d] text-white">
                                {connectedUser?.firstName?.[0] || 'U'}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-black text-lg text-[#2c2c2c]">
                                  {connectedUser?.firstName}
                                </h4>
                                <p className="text-xs font-bold capitalize mt-1 text-[#2458a0]">
                                  {rel.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {sectionConfigs.map((config, index) => {
              const Icon = config.icon;
              const isExpanded = expandedTile === config.id;
              const sectionData = getSectionPreview(config.id);
              const selectedBond = tileSelections[config.id];
              
              return (
                <motion.div
                  key={config.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setExpandedTile(isExpanded ? null : config.id)}
                        className="relative p-6 rounded-3xl border-2 border-[#f0ede4] bg-white hover:border-[#14532d] hover:shadow-lg h-full flex flex-col cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-card icon-frame">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-tight text-[#2c2c2c]">
                          {config.title}
                        </p>
                          <p className="text-xs font-bold mt-1 text-[#2458a0] opacity-60">
                          {sectionData.count} items
                        </p>
                      </div>
                    </div>
                    {sectionData.badge && (
                      <Badge className="bg-white text-[#14532d] text-[8px] font-black">
                        {sectionData.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Bond Selector - Only show when expanded */}
                  {isExpanded && relationships && relationships.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-[#f0ede4]">
                      <div className="space-y-2">
                        {relationships.map((rel) => {
                          const connectedUser = allUsers?.find((u: any) => String(u.id) === String(rel.targetId));
                          return (
                            <button
                              key={rel.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setTileSelections({...tileSelections, [config.id]: rel.targetId});
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                                  selectedBond === rel.targetId
                                    ? 'bg-[#2458a0] text-white'
                                    : 'bg-[#f0ede4] text-[#2458a0] hover:bg-[#e8e1d0]'
                                }`}
                            >
                              {connectedUser?.firstName}
                            </button>
                          );
                        })}
                      </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAddItem(config.id, selectedBond ?? null); }}
                            className="px-3 py-2 bg-[#2458a0] text-white rounded-full text-xs font-black"
                          >
                            Add
                          </button>
                        </div>
                    </div>
                  )}

                  {/* Preview Content */}
                  {sectionData.preview && (
                    <div className="flex-1 text-left">
                      <div className="text-xs text-[#2458a0] opacity-70">
                        {sectionData.preview}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
