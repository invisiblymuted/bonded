export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url"),
  status: text("status").notNull().default("missing"), // missing, found, reunited
  lastSeenLocation: text("last_seen_location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChildSchema = createInsertSchema(children).omit({
  id: true,
  createdAt: true
});

export type Child = typeof children.$inferSelect;
export type InsertChild = z.infer<typeof insertChildSchema>;
