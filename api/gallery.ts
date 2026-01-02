import type { Request, Response } from "express";
import { parseCookies } from "./_cookie";
import { getUserBySessionId } from "./_authDb";

interface MediaItem {
  id: string;
  userId: string;
  uploaderId: string;
  uploaderName: string;
  type: "photo" | "video" | "drawing" | "audio";
  url: string;
  thumbnail: string;
  title?: string;
  uploadedAt: string;
}

// Mock media data (replace with cloud storage in production)
const mockMedia: MediaItem[] = [
  {
    id: "m1",
    userId: "1",
    uploaderId: "2",
    uploaderName: "Jackson",
    type: "photo",
    url: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    thumbnail: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400",
    title: "Fun at the park",
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "m2",
    userId: "1",
    uploaderId: "3",
    uploaderName: "Jude",
    type: "photo",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    title: "My drawing",
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "m3",
    userId: "1",
    uploaderId: "1",
    uploaderName: "You",
    type: "photo",
    url: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    thumbnail: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=400",
    title: "Basketball game",
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "m4",
    userId: "1",
    uploaderId: "2",
    uploaderName: "Jackson",
    type: "photo",
    url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94",
    thumbnail: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400",
    title: "Fruit bowl",
    uploadedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "m5",
    userId: "1",
    uploaderId: "3",
    uploaderName: "Jude",
    type: "photo",
    url: "https://images.unsplash.com/photo-1464961968964-a80a9b51f3d9",
    thumbnail: "https://images.unsplash.com/photo-1464961968964-a80a9b51f3d9?w=400",
    title: "Sunset view",
    uploadedAt: new Date(Date.now() - 432000000).toISOString(),
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

    // Filter media for the current user
    const userMedia = mockMedia.filter((m) => m.userId === user.id);

    return res.status(200).json(userMedia);
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
