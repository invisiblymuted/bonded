import { z } from "zod";
import {
  insertRelationshipSchema,
  insertMessageSchema,
  insertJournalEntrySchema,
  insertMediaSchema,
  relationships,
  messages,
  journalEntries,
  media,
  notifications,
} from "./schema";
import { users } from "./models/auth";

export const api = {
  users: {
    search: {
      method: "GET" as const,
      path: "/api/users/search",
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
  },
  relationships: {
    list: {
      method: "GET" as const,
      path: "/api/relationships",
      responses: {
        200: z.array(z.custom<typeof relationships.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/relationships",
      input: insertRelationshipSchema,
      responses: {
        201: z.custom<typeof relationships.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    accept: {
      method: "PATCH" as const,
      path: "/api/relationships/:id/accept",
      responses: {
        200: z.custom<typeof relationships.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
  },
  messages: {
    list: {
      method: "GET" as const,
      path: "/api/relationships/:relationshipId/messages",
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/relationships/:relationshipId/messages",
      input: insertMessageSchema.omit({ relationshipId: true, senderId: true }),
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
  },
  journal: {
    list: {
      method: "GET" as const,
      path: "/api/relationships/:relationshipId/journal",
      responses: {
        200: z.array(z.custom<typeof journalEntries.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/relationships/:relationshipId/journal",
      input: insertJournalEntrySchema.omit({ relationshipId: true, authorId: true }),
      responses: {
        201: z.custom<typeof journalEntries.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/journal/:entryId",
      input: insertJournalEntrySchema.partial().omit({ relationshipId: true, authorId: true }),
      responses: {
        200: z.custom<typeof journalEntries.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
  },
  media: {
    list: {
      method: "GET" as const,
      path: "/api/relationships/:relationshipId/media",
      responses: {
        200: z.array(z.custom<typeof media.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/relationships/:relationshipId/media",
      input: z.object({
        type: z.enum(["photo", "drawing", "video", "audio"]),
        url: z.string(),
        filename: z.string(),
        caption: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof media.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/relationships/:relationshipId/media/:mediaId",
      responses: {
        200: z.object({ success: z.boolean() }),
        401: z.object({ message: z.string() }),
      },
    },
  },
  notifications: {
    list: {
      method: "GET" as const,
      path: "/api/notifications",
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    markRead: {
      method: "PATCH" as const,
      path: "/api/notifications/:notificationId/read",
      responses: {
        200: z.object({ success: z.boolean() }),
        401: z.object({ message: z.string() }),
      },
    },
    markAllRead: {
      method: "PATCH" as const,
      path: "/api/notifications/read-all",
      responses: {
        200: z.object({ success: z.boolean() }),
        401: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
