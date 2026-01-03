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

  async getMessages() { return []; }
  async getJournalEntries() { return []; }
  async getMedia() { return []; }
  async getJournal() { return []; }
  async getJournalEntry(id: number) { return null; }
  async getNotifications() { return []; }
  async getEvents() { return []; }
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