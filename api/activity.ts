import type { Request, Response } from "express";
import { parseCookies } from "./_cookie";
import { getUserBySessionId } from "./_authDb";

interface ActivityLog {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  action: "sent_message" | "created_journal_entry" | "uploaded_photo" | "initiated_video_call" | "scheduled_event" | "updated_profile";
  relatedId?: string;
  timestamp: string;
}

// Mock activity data (replace with database in production)
const mockActivity: ActivityLog[] = [
  {
    id: "a1",
    userId: "1",
    actorId: "2",
    actorName: "Jackson",
    action: "sent_message",
    relatedId: "msg_123",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "a2",
    userId: "1",
    actorId: "3",
    actorName: "Jude",
    action: "uploaded_photo",
    relatedId: "photo_456",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "a3",
    userId: "1",
    actorId: "1",
    actorName: "You",
    action: "created_journal_entry",
    relatedId: "journal_789",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "a4",
    userId: "1",
    actorId: "2",
    actorName: "Jackson",
    action: "initiated_video_call",
    relatedId: "call_321",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "a5",
    userId: "1",
    actorId: "1",
    actorName: "You",
    action: "sent_message",
    relatedId: "msg_654",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "a6",
    userId: "1",
    actorId: "3",
    actorName: "Jude",
    action: "scheduled_event",
    relatedId: "event_987",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "a7",
    userId: "1",
    actorId: "1",
    actorName: "You",
    action: "uploaded_photo",
    relatedId: "photo_111",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "a8",
    userId: "1",
    actorId: "2",
    actorName: "Jackson",
    action: "created_journal_entry",
    relatedId: "journal_222",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "a9",
    userId: "1",
    actorId: "3",
    actorName: "Jude",
    action: "sent_message",
    relatedId: "msg_333",
    timestamp: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "a10",
    userId: "1",
    actorId: "1",
    actorName: "You",
    action: "updated_profile",
    timestamp: new Date(Date.now() - 604800000).toISOString(),
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

    // Filter activity for the current user
    const userActivity = mockActivity.filter((a) => a.userId === user.id);

    return res.status(200).json(userActivity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
