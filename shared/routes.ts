import { z } from "zod";
import { insertChildSchema, children } from "./schema";

export const api = {
  children: {
    list: {
      method: "GET" as const,
      path: "/api/children",
      responses: {
        200: z.array(z.custom<typeof children.$inferSelect>()),
      },
    },
    listMine: {
      method: "GET" as const,
      path: "/api/children/mine",
      responses: {
        200: z.array(z.custom<typeof children.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/children/:id",
      responses: {
        200: z.custom<typeof children.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/children",
      input: insertChildSchema.omit({ parentId: true }), // parentId comes from auth
      responses: {
        201: z.custom<typeof children.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/children/:id",
      input: insertChildSchema.partial().omit({ parentId: true }),
      responses: {
        200: z.custom<typeof children.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/children/:id",
      responses: {
        204: z.void(),
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
