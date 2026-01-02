import type { Request, Response } from "express";
import { parseCookies } from "./_cookie";
import { getUserBySessionId } from "./_authDb";

interface Notification {
  id: string;
  userId: string;
  type: "connection" | "message" | "journal" | "media" | "video" | "event";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  fromUserId?: string;
  fromUserName?: string;
}

// Mock notifications data (replace with database in production)
const mockNotifications: Notification[] = [
  {
    id: "n1",
    userId: "1",
    type: "connection",
    title: "New Connection Request",
    message: "Jackson wants to connect with you on Bonded",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    fromUserId: "2",
    fromUserName: "Jackson",
  },
  {
    id: "n2",
    userId: "1",
    type: "message",
    title: "New Message",
    message: "You have a new message from Jude",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    fromUserId: "3",
    fromUserName: "Jude",
  },
  {
    id: "n3",
    userId: "1",
    type: "journal",
    title: "Journal Entry Shared",
    message: "Jackson shared a new journal entry with you",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    fromUserId: "2",
    fromUserName: "Jackson",
  },
  {
    id: "n4",
    userId: "1",
    type: "media",
    title: "New Photo",
    message: "Jude uploaded a new photo to the gallery",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    fromUserId: "3",
    fromUserName: "Jude",
  },
  {
    id: "n5",
    userId: "1",
    type: "video",
    title: "Video Call Scheduled",
    message: "Your video call with Jackson is scheduled for tomorrow at 3 PM",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    read: true,
    fromUserId: "2",
    fromUserName: "Jackson",
  },
  {
    id: "n6",
    userId: "1",
    type: "event",
    title: "Calendar Reminder",
    message: "Visit scheduled with Jude in 2 days",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    read: true,
  },
  {
    id: "n7",
    userId: "1",
    type: "message",
    title: "New Message",
    message: "You have 3 unread messages from Jackson",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    read: true,
    fromUserId: "2",
    fromUserName: "Jackson",
  },
  {
    id: "n8",
    userId: "1",
    type: "journal",
    title: "Journal Entry",
    message: "Jude commented on your journal entry",
    timestamp: new Date(Date.now() - 518400000).toISOString(),
    read: true,
    fromUserId: "3",
    fromUserName: "Jude",
  },
];

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.bonded_session;

    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getUserBySessionId(sessionId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Filter notifications for the current user
    const userNotifications = mockNotifications.filter(
      (n) => n.userId === user.id
    );

    return res.status(200).json(userNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
