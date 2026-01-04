import { User, UpsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { createHash } from "crypto";

const MemoryStore = createMemoryStore(session);

export type StoredUser = User & {
  username?: string;
  pinHash?: string | null;
  birthday?: string | null;
  displayName?: string | null;
};

export function hashPin(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

export function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}

export class MemStorage {
  private users: Map<string, StoredUser> = new Map();
  private relationships: Map<number, any> = new Map();
  private messages: Map<number, any> = new Map();
  private journalEntries: Map<number, any> = new Map();
  private mediaItems: Map<number, any> = new Map();
  private events: Map<number, any> = new Map();
  private currentId: number = 5; // Starting at 5 since we seed 1-4
  private bondingCodes = new Map<string, { userId: string, expires: number }>();
  
  // FIXED: This now uses the proper MemoryStore to prevent the crash
  public sessionStore: session.Store = new MemoryStore({
    checkPeriod: 86400000 
  });

  constructor() {
    // 1. YOUR ACCOUNT
    this.users.set("1", { 
      id: "1", 
      email: "daddy@bonded.com",
      username: "daddy",
      displayName: "Daddy",
      birthday: null,
      firstName: "Daddy", 
      lastName: "", 
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daddy",
      password: null,
      pinHash: hashPin("0524"),
      createdAt: new Date(),
      updatedAt: new Date()
    } as StoredUser);

    // 2. SEED USERS
    this.seedDirectory();
  }

  private seedDirectory() {
    const seedData = [
      { id: "2", firstName: "Jackson", lastName: "Bonded", email: "jackson@bonded.com" },
      { id: "3", firstName: "Jude", lastName: "Bonded", email: "jude@bonded.com" }
    ];

    let relId = 1;
    seedData.forEach(u => {
      this.users.set(u.id, { 
        id: u.id,
        email: u.email,
        username: u.firstName.toLowerCase(),
        displayName: u.firstName,
        firstName: u.firstName,
        lastName: u.lastName,
        birthday: null,
        profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}`,
        password: null,
        pinHash: hashPin("1234"),
        createdAt: new Date(),
        updatedAt: new Date()
      } as StoredUser);
      
      // Create relationship from user 1 to this user
      this.relationships.set(relId++, { 
        id: relId, 
        userId: 1, 
        targetId: parseInt(u.id), 
        status: "connected" 
      });
    });
  }

  async getUser(id: string) { return this.users.get(id); }
  async getUserByUsername(username: string) { 
    return Array.from(this.users.values()).find(u => u.username === username || u.email === username); 
  }
  
  async getUsers() {
    return Array.from(this.users.values());
  }

  async getRelationships(userId: number) { 
    return Array.from(this.relationships.values()).filter(r => r.userId === userId); 
  }

  // Messages
  async getMessagesForRelationship(relationshipId: number) {
    return Array.from(this.messages.values()).filter(m => Number(m.relationshipId) === Number(relationshipId));
  }

  async createMessage(relationshipId: number, senderId: string | number, content: string) {
    const id = this.currentId++;
    const msg = { id: String(id), relationshipId: Number(relationshipId), senderId: String(senderId), content, timestamp: new Date().toISOString(), read: false };
    this.messages.set(id, msg);
    return msg;
  }

  // Journal
  async getJournalEntriesForRelationship(relationshipId: number) {
    return Array.from(this.journalEntries.values()).filter(j => Number(j.relationshipId) === Number(relationshipId));
  }

  async createJournalEntry(relationshipId: number, authorId: string | number, data: { title: string; content: string }) {
    const id = this.currentId++;
    const entry = { id: String(id), relationshipId: Number(relationshipId), authorId: String(authorId), title: data.title, content: data.content, createdAt: new Date().toISOString() };
    this.journalEntries.set(id, entry);
    return entry;
  }

  // Media
  async getMediaForRelationship(relationshipId: number) {
    return Array.from(this.mediaItems.values()).filter(m => Number(m.relationshipId) === Number(relationshipId));
  }

  async createMediaForRelationship(relationshipId: number, data: { type: string; url: string; filename: string; caption?: string }) {
    const id = this.currentId++;
    const item = { id: String(id), relationshipId: Number(relationshipId), type: data.type, url: data.url, filename: data.filename, caption: data.caption || null, uploadedAt: new Date().toISOString() };
    this.mediaItems.set(id, item);
    return item;
  }

  // Events
  async getEventsForRelationship(relationshipId: number) {
    return Array.from(this.events.values()).filter(e => Number(e.relationshipId) === Number(relationshipId));
  }

  async createEventForRelationship(relationshipId: number, creatorId: string | number, data: { title: string; eventDate: string; eventType?: string }) {
    const id = this.currentId++;
    const ev = { id: String(id), relationshipId: Number(relationshipId), creatorId: String(creatorId), title: data.title, date: data.eventDate, type: data.eventType || 'custom' };
    this.events.set(id, ev);
    return ev;
  }

  async createBondingCode(userId: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.bondingCodes.set(code, { 
      userId, 
      expires: Date.now() + (24 * 60 * 60 * 1000) 
    });
    return code;
  }

  async getUserByBondingCode(code: string): Promise<string | null> {
    const data = this.bondingCodes.get(code);
    if (!data || data.expires < Date.now()) return null;
    return data.userId;
  }

  // Backwards-compatible generic getters (not used directly)
  async getMessages() { return Array.from(this.messages.values()); }
  async getJournalEntries() { return Array.from(this.journalEntries.values()); }
  async getMedia() { return Array.from(this.mediaItems.values()); }
  async getJournal() { return Array.from(this.journalEntries.values()); }
  async getJournalEntry(id: number) { return this.journalEntries.get(id) ?? null; }
  async getNotifications() { return []; }
  async getEvents() { return Array.from(this.events.values()); }
  async getDashboardPreferences() { return null; }
  async getNotificationSettings() { return null; }
  
  async createUser(user: UpsertUser & Partial<StoredUser>): Promise<StoredUser> {
    const id = (this.currentId++).toString();
    const newUser = { ...user, id, createdAt: new Date(), updatedAt: new Date() } as StoredUser;
    this.users.set(id, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();