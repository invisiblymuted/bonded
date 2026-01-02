import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, BookOpen, Image, Video, 
  Calendar, CheckSquare, HelpCircle, ChevronDown, Plus, X, Users
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedBond, setSelectedBond] = useState<number | null>(null);

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

  // Filter data by selected bond
  const filteredMessages = selectedBond 
    ? messages?.filter(m => String(m.senderId) === String(selectedBond)) || []
    : messages || [];
  const filteredJournals = selectedBond
    ? journals?.filter(j => String((j as any).bondId) === String(selectedBond)) || []
    : journals || [];
  const filteredMedia = selectedBond
    ? media?.filter(m => String((m as any).bondId) === String(selectedBond)) || []
    : media || [];
  const filteredEvents = selectedBond
    ? events?.filter(e => String((e as any).bondId) === String(selectedBond)) || []
    : events || [];

  const recentMessages = filteredMessages.slice(0, 3);
  const unreadCount = filteredMessages.filter(m => !m.read).length || 0;
  const recentJournals = filteredJournals.slice(0, 3);
  const recentMedia = filteredMedia.slice(0, 6);
  const upcomingEvents = filteredEvents.slice(0, 3);

  const sections = [
    {
      id: "messages",
      icon: MessageSquare,
      title: "Messages",
      color: "from-blue-500 to-blue-600",
      badge: unreadCount > 0 ? `${unreadCount} new` : null,
      count: filteredMessages?.length || 0,
      preview: recentMessages.length > 0 ? (
        <div className="space-y-2">
          {recentMessages.map((msg) => (
            <div key={msg.id} className="p-2 bg-[#f5f1e8] rounded-lg">
              <p className="text-xs font-bold text-[#4a453e] truncate">{msg.content}</p>
              <p className="text-[10px] text-[#4a453e] opacity-60 mt-1">
                {format(new Date(msg.timestamp), "MMM d, h:mm a")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#4a453e] opacity-60">{selectedBond ? 'No messages with this bond' : 'No messages yet. Start a conversation!'}</p>
      ),
      fullContent: filteredMessages && filteredMessages.length > 0 ? (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="p-4 bg-[#f5f1e8] rounded-xl border border-[#dcd7ca]">
              <div className="flex items-start justify-between mb-2">
                <p className="font-black text-[#4a453e]">Message from User {msg.senderId}</p>
                {!msg.read && <Badge className="bg-[#f26522] text-white text-[8px]">Unread</Badge>}
              </div>
              <p className="text-sm text-[#4a453e] mb-2">{msg.content}</p>
              <p className="text-[10px] text-[#4a453e] opacity-60">
                {format(new Date(msg.timestamp), "MMM d, h:mm a")}
              </p>
            </div>
          ))}
        </div>
      ) : null,
    },
    {
      id: "journal",
      icon: BookOpen,
      title: "Journal",
      color: "from-amber-500 to-amber-600",
      count: filteredJournals?.length || 0,
      preview: recentJournals.length > 0 ? (
        <div className="space-y-2">
          {recentJournals.map((entry) => (
            <div key={entry.id} className="p-2 bg-[#f5f1e8] rounded-lg">
              <p className="text-xs font-bold text-[#4a453e]">{entry.title}</p>
              <p className="text-[10px] text-[#4a453e] opacity-60 mt-1">
                {format(new Date(entry.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#4a453e] opacity-60">{selectedBond ? 'No journal entries with this bond' : 'Create your first journal entry'}</p>
      ),
      fullContent: filteredJournals && filteredJournals.length > 0 ? (
        <div className="space-y-3">
          {filteredJournals.map((entry) => (
            <div key={entry.id} className="p-4 bg-[#f5f1e8] rounded-xl border border-[#dcd7ca]">
              <h4 className="font-black text-[#4a453e] mb-2">{entry.title}</h4>
              <p className="text-sm text-[#4a453e] mb-2">{entry.content}</p>
              <p className="text-[10px] text-[#4a453e] opacity-60">
                {format(new Date(entry.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          ))}
        </div>
      ) : null,
    },
    {
      id: "media",
      icon: Image,
      title: "Media",
      color: "from-pink-500 to-pink-600",
      count: filteredMedia?.length || 0,
      preview: recentMedia.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {recentMedia.map((item) => (
            <div key={item.id} className="aspect-square bg-[#f5f1e8] rounded-lg overflow-hidden">
              <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#4a453e] opacity-60">{selectedBond ? 'No media with this bond' : 'Upload photos and videos to share'}</p>
      ),
      fullContent: filteredMedia && filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl">
              <img src={item.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-[10px] text-white font-black uppercase">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null,
    },
    {
      id: "video",
      icon: Video,
      title: "Video",
      color: "from-green-500 to-green-600",
      count: 1,
      preview: (
        <div className="text-center py-4">
          <Video className="h-8 w-8 text-[#2458a0] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#4a453e]">Start a video call</p>
        </div>
      ),
      fullContent: (
        <div className="text-center py-8">
          <div className="bg-[#f5f1e8] rounded-3xl p-8 border border-[#dcd7ca] inline-block">
            <Video className="h-12 w-12 text-[#2458a0] mx-auto mb-4" />
            <h4 className="text-lg font-black text-[#4a453e] mb-2">Ready for a video call?</h4>
            <p className="text-sm text-[#4a453e] opacity-70 mb-4 max-w-xs">
              Connect face-to-face with your loved one for real-time conversation.
            </p>
            <Button className="bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white font-black">
              Start Video Call
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "calendar",
      icon: Calendar,
      title: "Calendar",
      color: "from-orange-500 to-orange-600",
      count: filteredEvents?.length || 0,
      preview: upcomingEvents.length > 0 ? (
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-2 bg-[#f5f1e8] rounded-lg">
              <p className="text-xs font-bold text-[#4a453e]">{event.title}</p>
              <p className="text-[10px] text-[#4a453e] opacity-60 mt-1">
                {format(new Date(event.date), "MMM d, h:mm a")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#4a453e] opacity-60">{selectedBond ? 'No calendar events with this bond' : 'Schedule your next connection'}</p>
      ),
      fullContent: filteredEvents && filteredEvents.length > 0 ? (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4 bg-[#f5f1e8] rounded-xl border border-[#dcd7ca]">
              <h4 className="font-black text-[#4a453e] mb-2">{event.title}</h4>
              <p className="text-[10px] font-bold uppercase text-[#2458a0] mb-2">{event.type}</p>
              <p className="text-[10px] text-[#4a453e] opacity-60">
                {format(new Date(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          ))}
        </div>
      ) : null,
    },
    {
      id: "connections",
      icon: Users,
      title: "Bonds",
      color: "from-blue-500 to-blue-600",
      count: relationships?.length || 0,
      preview: relationships && relationships.length > 0 ? (
        <div className="space-y-2">
          {relationships.slice(0, 2).map((rel) => {
            const connectedUser = allUsers?.find((u: any) => String(u.id) === String(rel.targetId));
            return (
              <div 
                key={rel.id} 
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  selectedBond === rel.targetId
                    ? 'bg-[#2458a0] text-white'
                    : 'bg-[#f5f1e8] hover:bg-[#e8e1d0]'
                }`}
                onClick={() => setSelectedBond(selectedBond === rel.targetId ? null : rel.targetId)}
              >
                <p className={`text-xs font-bold ${selectedBond === rel.targetId ? 'text-white' : 'text-[#4a453e]'}`}>
                  {connectedUser?.firstName}
                </p>
              </div>
            );
          })}
          {(relationships?.length || 0) > 2 && (
            <p className="text-[10px] text-[#4a453e] opacity-60 pt-1">
              +{(relationships?.length || 0) - 2} more
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-[#4a453e] opacity-60">No bonds yet</p>
      ),
      fullContent: relationships && relationships.length > 0 ? (
        <div className="space-y-3">
          {relationships.map((rel) => {
            const connectedUser = allUsers?.find((u: any) => String(u.id) === String(rel.targetId));
            return (
              <button
                key={rel.id}
                onClick={() => setSelectedBond(selectedBond === rel.targetId ? null : rel.targetId)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedBond === rel.targetId
                    ? 'bg-[#2458a0] border-[#2458a0]'
                    : 'bg-[#f5f1e8] border-[#dcd7ca] hover:border-[#2458a0]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    selectedBond === rel.targetId
                      ? 'bg-white text-[#2458a0]'
                      : 'bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white'
                  }`}>
                    {connectedUser?.firstName?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black ${selectedBond === rel.targetId ? 'text-white' : 'text-[#4a453e]'}`}>
                      {connectedUser?.firstName}
                    </h4>
                    <p className={`text-[10px] font-bold capitalize mt-1 ${
                      selectedBond === rel.targetId ? 'text-white/80' : 'text-[#2458a0]'
                    }`}>
                      {rel.status}
                    </p>
                    {connectedUser?.email && (
                      <p className={`text-[10px] mt-1 ${
                        selectedBond === rel.targetId ? 'text-white/60' : 'text-[#4a453e] opacity-60'
                      }`}>
                        {connectedUser.email}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex flex-col">
      <Header />
      
      <main className="pt-24 pb-20 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          {/* User Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-white border-[#dcd7ca]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#2458a0] to-[#f26522] flex items-center justify-center text-white text-2xl font-black">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-black text-[#4a453e]">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      {selectedBond && (
                        <p className="text-sm text-[#2458a0] font-bold mt-1">
                          Viewing bond: {allUsers?.find((u: any) => String(u.id) === String(selectedBond))?.firstName}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedBond && (
                    <button
                      onClick={() => setSelectedBond(null)}
                      className="px-4 py-2 bg-[#f5f1e8] hover:bg-[#e8e1d0] text-[#4a453e] rounded-lg font-bold text-sm transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isExpanded = expandedSection === section.id;
              
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer h-full flex flex-col ${
                    isExpanded
                      ? 'border-[#2458a0] bg-gradient-to-br from-[#2458a0] to-[#1e46a0] text-white scale-105'
                      : 'border-[#dcd7ca] bg-white hover:border-[#2458a0] hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${isExpanded ? 'bg-white/20' : 'bg-[#f5f1e8]'}`}>
                        <Icon className={`h-6 w-6 ${isExpanded ? 'text-white' : 'text-[#2458a0]'}`} />
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-black uppercase tracking-tight ${isExpanded ? 'text-white' : 'text-[#4a453e]'}`}>
                          {section.title}
                        </p>
                        <p className={`text-xs font-bold mt-1 ${isExpanded ? 'text-white/70' : 'text-[#4a453e] opacity-60'}`}>
                          {section.count} items
                        </p>
                      </div>
                    </div>
                    {section.badge && (
                      <Badge className="bg-white text-[#f26522] text-[8px] font-black">
                        {section.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Preview Content */}
                  {!isExpanded && section.preview && (
                    <div className="flex-1 text-left min-h-24">
                      <div className="text-xs text-[#4a453e] opacity-70">
                        {section.preview}
                      </div>
                    </div>
                  )}

                  {/* Expand Button */}
                  <div className={`mt-4 flex items-center justify-between pt-4 border-t ${isExpanded ? 'border-white/30' : 'border-[#dcd7ca]'}`}>
                    <span className={`text-xs font-black uppercase tracking-widest ${isExpanded ? 'text-white/80' : 'text-[#2458a0]'}`}>
                      {isExpanded ? 'View Full' : 'Expand'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180 text-white' : 'text-[#2458a0]'}`} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedSection && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white border-2 border-[#dcd7ca] rounded-3xl p-8 mb-8 shadow-lg"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const section = sections.find(s => s.id === expandedSection);
                      if (section) {
                        const Icon = section.icon;
                        return (
                          <>
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${section.color}`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-3xl font-black text-[#4a453e]">{section.title}</h2>
                              <p className="text-sm text-[#4a453e] opacity-60 font-bold mt-1">
                                {(() => {
                                  const s = sections.find(sec => sec.id === expandedSection);
                                  return s ? `${s.count} total` : '';
                                })()}
                              </p>
                            </div>
                          </>
                        );
                      }
                    })()}
                  </div>
                  <button
                    onClick={() => setExpandedSection(null)}
                    className="p-3 hover:bg-[#f5f1e8] rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-[#4a453e]" />
                  </button>
                </div>

                {(() => {
                  const section = sections.find(s => s.id === expandedSection);
                  const pageLinks: { [key: string]: string } = {
                    messages: "/messages",
                    journal: "/journal",
                    media: "/gallery",
                    calendar: "/calendar",
                    video: "/videocall"
                  };
                  
                  if (section?.fullContent) {
                    return (
                      <div>
                        <div className="max-h-96 overflow-y-auto pr-4">
                          {section.fullContent}
                        </div>
                        {section.id !== 'video' && (
                          <Link href={pageLinks[section.id] || "#"}>
                            <button className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
                              <Plus className="h-5 w-5" />
                              Go to {section.title}
                            </button>
                          </Link>
                        )}
                        {section.id === 'video' && (
                          <button className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
                            <Plus className="h-5 w-5" />
                            Start Video Call
                          </button>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
