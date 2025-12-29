import { useState } from "react";
import { Bell, MessageCircle, BookOpen, Image, Link, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "journal":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case "media":
        return <Image className="h-4 w-4 text-purple-500" />;
      case "connection":
        return <Link className="h-4 w-4 text-orange-500" />;
      case "video":
        return <Video className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markRead(notification.id);
    setOpen(false);
    if (notification.relationshipId) {
      if (notification.type === "video") {
        // Extract room URL from metadata if available
        let roomParam = "";
        if ((notification as any).metadata) {
          try {
            const metadata = JSON.parse((notification as any).metadata);
            if (metadata.roomUrl) {
              roomParam = `&room=${encodeURIComponent(metadata.roomUrl)}`;
            }
          } catch (e) {
            console.error("Failed to parse notification metadata:", e);
          }
        }
        setLocation(`/video?connection=${notification.relationshipId}${roomParam}`);
      } else {
        setLocation(`/connection/${notification.relationshipId}`);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between gap-2 border-b p-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllRead()}
              data-testid="button-mark-all-read"
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 20).map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex w-full items-start gap-3 p-3 text-left hover-elevate ${
                  !notification.read ? "bg-accent/50" : ""
                }`}
                data-testid={`notification-item-${notification.id}`}
              >
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.createdAt && formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
