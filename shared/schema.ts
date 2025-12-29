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

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // connection, message, journal, media
  title: text("title").notNull(),
  message: text("message").notNull(),
  relationshipId: integer("relationship_id").references(() => relationships.id),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Calendar events for shared family calendar
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  relationshipId: integer("relationship_id").notNull().references(() => relationships.id),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  eventType: text("event_type").notNull().default("general"), // birthday, visit, call, reminder, general
  reminder: boolean("reminder").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

// Dashboard preferences for customizable layout
export const dashboardPreferences = pgTable("dashboard_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  widgetOrder: text("widget_order").notNull().default('["connections","recentMessages","quickActions"]'),
  hiddenWidgets: text("hidden_widgets").notNull().default('[]'),
  layoutDensity: text("layout_density").notNull().default('spacious'), // compact, spacious
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDashboardPreferencesSchema = createInsertSchema(dashboardPreferences).omit({
  id: true,
  updatedAt: true,
});

// Types
export type DashboardPreferences = typeof dashboardPreferences.$inferSelect;
export type InsertDashboardPreferences = z.infer<typeof insertDashboardPreferencesSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
