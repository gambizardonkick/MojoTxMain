import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import {
  insertLeaderboardEntrySchema,
  insertLeaderboardSettingsSchema,
  insertLevelMilestoneSchema,
  insertChallengeSchema,
  insertFreeSpinsOfferSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Leaderboard Entries
  app.get("/api/leaderboard/entries", async (_req, res) => {
    try {
      const entries = await storage.getLeaderboardEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard entries" });
    }
  });

  app.post("/api/leaderboard/entries", async (req, res) => {
    try {
      const data = insertLeaderboardEntrySchema.parse(req.body);
      const entry = await storage.createLeaderboardEntry(data);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid leaderboard entry data" });
    }
  });

  app.patch("/api/leaderboard/entries/:id", async (req, res) => {
    try {
      const entry = await storage.updateLeaderboardEntry(req.params.id, req.body);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update leaderboard entry" });
    }
  });

  app.delete("/api/leaderboard/entries/:id", async (req, res) => {
    try {
      await storage.deleteLeaderboardEntry(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete leaderboard entry" });
    }
  });

  // Leaderboard Settings
  app.get("/api/leaderboard/settings", async (_req, res) => {
    try {
      const settings = await storage.getLeaderboardSettings();
      res.json(settings || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard settings" });
    }
  });

  app.post("/api/leaderboard/settings", async (req, res) => {
    try {
      const data = insertLeaderboardSettingsSchema.parse(req.body);
      const settings = await storage.upsertLeaderboardSettings(data);
      res.json(settings);
    } catch (error) {
      console.error("Leaderboard settings validation error:", error);
      res.status(400).json({ error: "Invalid leaderboard settings data", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Level Milestones
  app.get("/api/milestones", async (_req, res) => {
    try {
      const milestones = await storage.getLevelMilestones();
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch milestones" });
    }
  });

  app.post("/api/milestones", async (req, res) => {
    try {
      const data = insertLevelMilestoneSchema.parse(req.body);
      const milestone = await storage.createLevelMilestone(data);
      res.json(milestone);
    } catch (error) {
      res.status(400).json({ error: "Invalid milestone data" });
    }
  });

  app.patch("/api/milestones/:id", async (req, res) => {
    try {
      const milestone = await storage.updateLevelMilestone(req.params.id, req.body);
      res.json(milestone);
    } catch (error) {
      res.status(500).json({ error: "Failed to update milestone" });
    }
  });

  app.delete("/api/milestones/:id", async (req, res) => {
    try {
      await storage.deleteLevelMilestone(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete milestone" });
    }
  });

  // Challenges
  app.get("/api/challenges", async (_req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  });

  app.post("/api/challenges", async (req, res) => {
    try {
      const data = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(data);
      res.json(challenge);
    } catch (error) {
      res.status(400).json({ error: "Invalid challenge data" });
    }
  });

  app.patch("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.updateChallenge(req.params.id, req.body);
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update challenge" });
    }
  });

  app.delete("/api/challenges/:id", async (req, res) => {
    try {
      await storage.deleteChallenge(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete challenge" });
    }
  });

  app.post("/api/challenges/:id/claim", async (req, res) => {
    try {
      const claimSchema = z.object({
        username: z.string().min(1, "Username is required"),
        discordUsername: z.string().min(1, "Discord username is required"),
      });
      
      const validation = claimSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors[0].message });
      }
      
      const { username, discordUsername } = validation.data;
      const challenge = await storage.claimChallenge(req.params.id, username, discordUsername);
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to claim challenge" });
    }
  });

  // Free Spins Offers
  app.get("/api/free-spins", async (_req, res) => {
    try {
      const offers = await storage.getFreeSpinsOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch free spins offers" });
    }
  });

  app.post("/api/free-spins", async (req, res) => {
    try {
      const data = insertFreeSpinsOfferSchema.parse(req.body);
      const offer = await storage.createFreeSpinsOffer(data);
      res.json(offer);
    } catch (error) {
      res.status(400).json({ error: "Invalid free spins offer data" });
    }
  });

  app.patch("/api/free-spins/:id", async (req, res) => {
    try {
      const offer = await storage.updateFreeSpinsOffer(req.params.id, req.body);
      res.json(offer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update free spins offer" });
    }
  });

  app.delete("/api/free-spins/:id", async (req, res) => {
    try {
      await storage.deleteFreeSpinsOffer(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete free spins offer" });
    }
  });

  // Server time endpoint for accurate countdown timers
  app.get("/api/time", (_req, res) => {
    res.json({ timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
