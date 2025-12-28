import { users, type User, type UpsertUser } from "@shared/models/auth";
import {
  relationships,
  messages,
  journalEntries,
  media,
  type Relationship,
  type InsertRelationship,
  type Message,
  type InsertMessage,
  type JournalEntry,
  type InsertJournalEntry,
  type Media,
  type InsertMedia,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  searchUsers(query: string): Promise<User[]>;

  getRelationships(userId: string): Promise<Relationship[]>;
  createRelationship(rel: InsertRelationship): Promise<Relationship>;
  acceptRelationship(id: number): Promise<Relationship>;

  getMessages(relationshipId: number): Promise<Message[]>;
  createMessage(msg: InsertMessage): Promise<Message>;

  getJournalEntries(relationshipId: number): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: number, updates: Partial<InsertJournalEntry>): Promise<JournalEntry>;

  getMedia(relationshipId: number): Promise<Media[]>;
  createMedia(m: InsertMedia): Promise<Media>;
  deleteMedia(mediaId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) {
    return authStorage.getUser(id);
  }
  async upsertUser(user: UpsertUser) {
    return authStorage.upsertUser(user);
  }
  async searchUsers(query: string) {
    return await db
      .select()
      .from(users)
      .where(
        or(
          like(users.firstName, `%${query}%`),
          like(users.lastName, `%${query}%`),
          like(users.email, `%${query}%`)
        )
      )
      .limit(10);
  }

  async getRelationships(userId: string) {
    return await db
      .select()
      .from(relationships)
      .where((t) => eq(t.parentId, userId) || eq(t.childId, userId))
      .orderBy(desc(relationships.createdAt));
  }

  async createRelationship(rel: InsertRelationship) {
    const [created] = await db.insert(relationships).values(rel).returning();
    return created;
  }

  async acceptRelationship(id: number) {
    const [updated] = await db
      .update(relationships)
      .set({ status: "accepted" })
      .where(eq(relationships.id, id))
      .returning();
    return updated;
  }

  async getMessages(relationshipId: number) {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.relationshipId, relationshipId))
      .orderBy(messages.createdAt);
  }

  async createMessage(msg: InsertMessage) {
    const [created] = await db.insert(messages).values(msg).returning();
    return created;
  }

  async getJournalEntries(relationshipId: number) {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.relationshipId, relationshipId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async createJournalEntry(entry: InsertJournalEntry) {
    const [created] = await db.insert(journalEntries).values(entry).returning();
    return created;
  }

  async updateJournalEntry(id: number, updates: Partial<InsertJournalEntry>) {
    const [updated] = await db
      .update(journalEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(journalEntries.id, id))
      .returning();
    return updated;
  }

  async getMedia(relationshipId: number) {
    return await db
      .select()
      .from(media)
      .where(eq(media.relationshipId, relationshipId))
      .orderBy(desc(media.createdAt));
  }

  async createMedia(m: InsertMedia) {
    const [created] = await db.insert(media).values(m).returning();
    return created;
  }

  async deleteMedia(mediaId: number) {
    const result = await db.delete(media).where(eq(media.id, mediaId));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
