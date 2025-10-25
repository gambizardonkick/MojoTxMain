import {
  type LeaderboardEntry,
  type InsertLeaderboardEntry,
  type LeaderboardSettings,
  type InsertLeaderboardSettings,
  type LevelMilestone,
  type InsertLevelMilestone,
  type Challenge,
  type InsertChallenge,
  type FreeSpinsOffer,
  type InsertFreeSpinsOffer,
} from "@shared/schema";
import { getDb } from "./firebase";

export interface IStorage {
  getLeaderboardEntries(): Promise<LeaderboardEntry[]>;
  getLeaderboardEntry(id: string): Promise<LeaderboardEntry | undefined>;
  createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  updateLeaderboardEntry(id: string, data: Partial<InsertLeaderboardEntry>): Promise<LeaderboardEntry>;
  deleteLeaderboardEntry(id: string): Promise<void>;

  getLeaderboardSettings(): Promise<LeaderboardSettings | undefined>;
  upsertLeaderboardSettings(settings: InsertLeaderboardSettings): Promise<LeaderboardSettings>;

  getLevelMilestones(): Promise<LevelMilestone[]>;
  getLevelMilestone(id: string): Promise<LevelMilestone | undefined>;
  createLevelMilestone(milestone: InsertLevelMilestone): Promise<LevelMilestone>;
  updateLevelMilestone(id: string, data: Partial<InsertLevelMilestone>): Promise<LevelMilestone>;
  deleteLevelMilestone(id: string): Promise<void>;

  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: string, data: Partial<InsertChallenge>): Promise<Challenge>;
  deleteChallenge(id: string): Promise<void>;
  claimChallenge(id: string, username: string, discordUsername: string): Promise<Challenge>;

  getFreeSpinsOffers(): Promise<FreeSpinsOffer[]>;
  getFreeSpinsOffer(id: string): Promise<FreeSpinsOffer | undefined>;
  createFreeSpinsOffer(offer: InsertFreeSpinsOffer): Promise<FreeSpinsOffer>;
  updateFreeSpinsOffer(id: string, data: Partial<InsertFreeSpinsOffer>): Promise<FreeSpinsOffer>;
  deleteFreeSpinsOffer(id: string): Promise<void>;
}

export class FirebaseStorage implements IStorage {
  private db = getDb();

  async getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    const snapshot = await this.db.ref('leaderboardEntries').get();
    if (!snapshot.exists()) return [];
    
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((child) => {
      entries.push({ id: child.key!, ...child.val() } as LeaderboardEntry);
    });
    
    return entries.sort((a, b) => (a.rank || 0) - (b.rank || 0));
  }

  async getLeaderboardEntry(id: string): Promise<LeaderboardEntry | undefined> {
    const snapshot = await this.db.ref(`leaderboardEntries/${id}`).get();
    if (!snapshot.exists()) return undefined;
    return { id: snapshot.key!, ...snapshot.val() } as LeaderboardEntry;
  }

  async createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const newRef = this.db.ref('leaderboardEntries').push();
    await newRef.set({
      ...entry,
      createdAt: new Date().toISOString(),
    });
    const snapshot = await newRef.get();
    return { id: snapshot.key!, ...snapshot.val() } as LeaderboardEntry;
  }

  async updateLeaderboardEntry(id: string, data: Partial<InsertLeaderboardEntry>): Promise<LeaderboardEntry> {
    await this.db.ref(`leaderboardEntries/${id}`).update(data);
    const snapshot = await this.db.ref(`leaderboardEntries/${id}`).get();
    return { id: snapshot.key!, ...snapshot.val() } as LeaderboardEntry;
  }

  async deleteLeaderboardEntry(id: string): Promise<void> {
    await this.db.ref(`leaderboardEntries/${id}`).remove();
  }

  async getLeaderboardSettings(): Promise<LeaderboardSettings | undefined> {
    const snapshot = await this.db.ref('leaderboardSettings').get();
    if (!snapshot.exists()) return undefined;
    
    let settings: LeaderboardSettings | undefined;
    snapshot.forEach((child) => {
      settings = { id: child.key!, ...child.val() } as LeaderboardSettings;
      return true;
    });
    
    return settings;
  }

  async upsertLeaderboardSettings(settings: InsertLeaderboardSettings): Promise<LeaderboardSettings> {
    const existing = await this.getLeaderboardSettings();
    
    const dataToSave = {
      totalPrizePool: settings.totalPrizePool,
      endDate: settings.endDate instanceof Date ? settings.endDate.toISOString() : settings.endDate,
    };
    
    if (existing) {
      await this.db.ref(`leaderboardSettings/${existing.id}`).update({
        ...dataToSave,
        updatedAt: new Date().toISOString(),
      });
      const snapshot = await this.db.ref(`leaderboardSettings/${existing.id}`).get();
      return { id: snapshot.key!, ...snapshot.val() } as LeaderboardSettings;
    } else {
      const newRef = this.db.ref('leaderboardSettings').push();
      await newRef.set({
        ...dataToSave,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const snapshot = await newRef.get();
      return { id: snapshot.key!, ...snapshot.val() } as LeaderboardSettings;
    }
  }

  async getLevelMilestones(): Promise<LevelMilestone[]> {
    const snapshot = await this.db.ref('levelMilestones').get();
    if (!snapshot.exists()) return [];
    
    const milestones: LevelMilestone[] = [];
    snapshot.forEach((child) => {
      milestones.push({ id: child.key!, ...child.val() } as LevelMilestone);
    });
    
    return milestones.sort((a, b) => (a.tier || 0) - (b.tier || 0));
  }

  async getLevelMilestone(id: string): Promise<LevelMilestone | undefined> {
    const snapshot = await this.db.ref(`levelMilestones/${id}`).get();
    if (!snapshot.exists()) return undefined;
    return { id: snapshot.key!, ...snapshot.val() } as LevelMilestone;
  }

  async createLevelMilestone(milestone: InsertLevelMilestone): Promise<LevelMilestone> {
    const newRef = this.db.ref('levelMilestones').push();
    await newRef.set({
      ...milestone,
      createdAt: new Date().toISOString(),
    });
    const snapshot = await newRef.get();
    return { id: snapshot.key!, ...snapshot.val() } as LevelMilestone;
  }

  async updateLevelMilestone(id: string, data: Partial<InsertLevelMilestone>): Promise<LevelMilestone> {
    await this.db.ref(`levelMilestones/${id}`).update(data);
    const snapshot = await this.db.ref(`levelMilestones/${id}`).get();
    return { id: snapshot.key!, ...snapshot.val() } as LevelMilestone;
  }

  async deleteLevelMilestone(id: string): Promise<void> {
    await this.db.ref(`levelMilestones/${id}`).remove();
  }

  async getChallenges(): Promise<Challenge[]> {
    const snapshot = await this.db.ref('challenges').get();
    if (!snapshot.exists()) return [];
    
    const challenges: Challenge[] = [];
    snapshot.forEach((child) => {
      challenges.push({ id: child.key!, ...child.val() } as Challenge);
    });
    
    return challenges.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const snapshot = await this.db.ref(`challenges/${id}`).get();
    if (!snapshot.exists()) return undefined;
    return { id: snapshot.key!, ...snapshot.val() } as Challenge;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const newRef = this.db.ref('challenges').push();
    await newRef.set({
      ...challenge,
      createdAt: new Date().toISOString(),
      claimStatus: 'unclaimed',
    });
    const snapshot = await newRef.get();
    return { id: snapshot.key!, ...snapshot.val() } as Challenge;
  }

  async updateChallenge(id: string, data: Partial<InsertChallenge>): Promise<Challenge> {
    await this.db.ref(`challenges/${id}`).update(data);
    const snapshot = await this.db.ref(`challenges/${id}`).get();
    return { id: snapshot.key!, ...snapshot.val() } as Challenge;
  }

  async deleteChallenge(id: string): Promise<void> {
    await this.db.ref(`challenges/${id}`).remove();
  }

  async claimChallenge(id: string, username: string, discordUsername: string): Promise<Challenge> {
    await this.db.ref(`challenges/${id}`).update({
      claimedBy: username,
      claimStatus: 'claimed',
      discordUsername: discordUsername,
    });
    const snapshot = await this.db.ref(`challenges/${id}`).get();
    return { id: snapshot.key!, ...snapshot.val() } as Challenge;
  }

  async getFreeSpinsOffers(): Promise<FreeSpinsOffer[]> {
    const snapshot = await this.db.ref('freeSpinsOffers').get();
    if (!snapshot.exists()) return [];
    
    const offers: FreeSpinsOffer[] = [];
    snapshot.forEach((child) => {
      offers.push({ id: child.key!, ...child.val() } as FreeSpinsOffer);
    });
    
    return offers.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }

  async getFreeSpinsOffer(id: string): Promise<FreeSpinsOffer | undefined> {
    const snapshot = await this.db.ref(`freeSpinsOffers/${id}`).get();
    if (!snapshot.exists()) return undefined;
    return { id: snapshot.key!, ...snapshot.val() } as FreeSpinsOffer;
  }

  async createFreeSpinsOffer(offer: InsertFreeSpinsOffer): Promise<FreeSpinsOffer> {
    const newRef = this.db.ref('freeSpinsOffers').push();
    await newRef.set({
      ...offer,
      expiresAt: offer.expiresAt instanceof Date ? offer.expiresAt.toISOString() : offer.expiresAt,
      createdAt: new Date().toISOString(),
    });
    const snapshot = await newRef.get();
    return { id: snapshot.key!, ...snapshot.val() } as FreeSpinsOffer;
  }

  async updateFreeSpinsOffer(id: string, data: Partial<InsertFreeSpinsOffer>): Promise<FreeSpinsOffer> {
    const updateData = {
      ...data,
      expiresAt: data.expiresAt instanceof Date ? data.expiresAt.toISOString() : data.expiresAt,
    };
    await this.db.ref(`freeSpinsOffers/${id}`).update(updateData);
    const snapshot = await this.db.ref(`freeSpinsOffers/${id}`).get();
    return { id: snapshot.key!, ...snapshot.val() } as FreeSpinsOffer;
  }

  async deleteFreeSpinsOffer(id: string): Promise<void> {
    await this.db.ref(`freeSpinsOffers/${id}`).remove();
  }
}

export const storage = new FirebaseStorage();
