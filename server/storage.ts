import { users, type User, type UpsertUser } from "@shared/models/auth";
import { children, type Child, type InsertChild } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  getChildren(): Promise<Child[]>;
  getChild(id: number): Promise<Child | undefined>;
  getChildrenByParent(parentId: string): Promise<Child[]>;
  createChild(child: InsertChild): Promise<Child>;
  updateChild(id: number, child: Partial<InsertChild>): Promise<Child>;
  deleteChild(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) { return authStorage.getUser(id); }
  async upsertUser(user: UpsertUser) { return authStorage.upsertUser(user); }

  async getChildren() {
    return await db.select().from(children).orderBy(desc(children.createdAt));
  }

  async getChild(id: number) {
    const [child] = await db.select().from(children).where(eq(children.id, id));
    return child;
  }

  async getChildrenByParent(parentId: string) {
    return await db.select().from(children).where(eq(children.parentId, parentId));
  }

  async createChild(insertChild: InsertChild) {
    const [child] = await db.insert(children).values(insertChild).returning();
    return child;
  }

  async updateChild(id: number, updates: Partial<InsertChild>) {
    const [child] = await db.update(children).set(updates).where(eq(children.id, id)).returning();
    return child;
  }

  async deleteChild(id: number) {
    await db.delete(children).where(eq(children.id, id));
  }
}

export const storage = new DatabaseStorage();
