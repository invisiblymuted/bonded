import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Bell, MessageSquare, BookOpen, Image, Video,
  Calendar, UserPlus, Check, Filter
} from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  type: "connection" | "message" | "journal" | "media" | "video" | "event";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  fromUserId?: string;
  fromUserName?: string;
}

const notificationIcons: Record<string, any> = {
  connection: UserPlus,
  message: MessageSquare,
  journal: BookOpen,
  media: Image,
  video: Video,
  event: Calendar,
};

const notificationColors: Record<string, string> = {
  connection: "text-purple-500 bg-purple-500/10",
  message: "text-blue-500 bg-blue-500/10",
  journal: "text-amber-500 bg-amber-500/10",
  media: "text-pink-500 bg-pink-500/10",
  video: "text-green-500 bg-green-500/10",
  event: "text-orange-500 bg-orange-500/10",
};

export default function Notifications() {
  const [filterType, setFilterType] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const filteredNotifications = notifications
    ?.filter((n) => !filterType || n.type === filterType)
    .sort((a, b) => {
      if (a.read === b.read) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return a.read ? 1 : -1;
    }) || [];

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Header />
      
      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black text-[#4a453e] mb-2">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-[#4a453e] opacity-60 font-bold">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  variant="outline"
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Mark All Read
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6 overflow-x-auto">
              <Filter className="h-4 w-4 text-[#4a453e] opacity-60 shrink-0" />
              <Button
                variant={filterType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(null)}
                className={filterType === null ? "bg-[#2458a0]" : ""}
              >
                All
              </Button>
              {Object.keys(notificationIcons).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? "bg-[#2458a0]" : ""}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="bg-white border-[#dcd7ca] p-12 text-center">
                <Bell className="h-12 w-12 text-[#4a453e] opacity-20 mx-auto mb-4" />
                <p className="text-[#4a453e] opacity-60 font-bold">
                  {filterType
                    ? `No ${filterType} notifications`
                    : "No notifications yet"}
                </p>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type];
                const colorClasses = notificationColors[notification.type];

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`bg-white border-[#dcd7ca] hover:border-[#2458a0] transition-all cursor-pointer ${
                        !notification.read ? "ring-2 ring-[#f26522]/20" : ""
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsReadMutation.mutate(notification.id);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-full ${colorClasses} flex items-center justify-center shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-black text-[#4a453e] text-sm">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <Badge className="bg-[#f26522] text-white shrink-0">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#4a453e] opacity-70 font-bold mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-[#4a453e] opacity-50">
                              <span className="font-bold">
                                {format(new Date(notification.timestamp), "MMM d, h:mm a")}
                              </span>
                              {notification.fromUserName && (
                                <>
                                  <span>•</span>
                                  <span className="font-bold">
                                    From {notification.fromUserName}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
