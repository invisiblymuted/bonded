export * from "./models/auth";
import { pgTable, text, serial, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

// Parent-child relationships
export const relationships = pgTable("relationships", {
  id: serial("id").primaryKey(),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  childId: varchar("child_id").notNull().references(() => users.id),
  childName: text("child_name").notNull(), // nickname for the child
  status: text("status").notNull().default("pending"), // pending, accepted
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages between parent and child
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  relationshipId: integer("relationship_id").notNull().references(() => relationships.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shared journal entries
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  relationshipId: integer("relationship_id").notNull().references(() => relationships.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood"), // happy, sad, excited, thoughtful, etc.
  mediaUrl: text("media_url"), // optional attached media
  mediaType: text("media_type"), // photo, drawing, video, audio
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media uploads (photos, drawings, videos, audio)
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  relationshipId: integer("relationship_id").notNull().references(() => relationships.id),
  uploaderId: varchar("uploader_id").notNull().references(() => users.id),
  type: text("type").notNull(), // photo, drawing, video, audio
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertRelationshipSchema = createInsertSchema(relationships).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

// Types
export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
