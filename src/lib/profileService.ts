import { Profile, DayLog, CycleDay } from '@/types';
import { SecurityService } from './security';
import { CycleEngine } from './cycleEngine';
import { getPredictionsForDay } from '@/data/predictions';

/**
 * Profile Storage Service
 * Handles local-first storage with encryption
 */

const STORAGE_KEY = 'phased_profiles';
const LOGS_KEY_PREFIX = 'phased_logs_';

export class ProfileService {
  /**
   * Create a new profile
   */
  static async createProfile(
    profileData: Omit<Profile, 'id' | 'passwordHash' | 'createdAt' | 'lastUpdated'>,
    password: string
  ): Promise<Profile> {
    const { hash, salt } = SecurityService.hashPassword(password);
    
    const profile: Profile = {
      ...profileData,
      id: SecurityService.generateId(),
      passwordHash: `${hash}:${salt}`,
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    // Encrypt sensitive data
    const sensitiveData = {
      symptoms: profileData.symptoms,
      pmsIntensity: profileData.pmsIntensity
    };
    profile.encryptedData = SecurityService.encryptData(sensitiveData, password);

    this.saveProfile(profile);
    return profile;
  }

  /**
   * Get all profiles (limited data for listing)
   */
  static getAllProfiles(): Array<Omit<Profile, 'encryptedData' | 'passwordHash'>> {
    const profiles = this.loadProfiles();
    return profiles.map(p => {
      const { encryptedData, passwordHash, ...publicData } = p;
      return publicData;
    });
  }

  /**
   * Get profile by ID
   */
  static getProfile(profileId: string): Profile | null {
    const profiles = this.loadProfiles();
    return profiles.find(p => p.id === profileId) || null;
  }

  /**
   * Unlock profile with password
   */
  static unlockProfile(profileId: string, password: string): Profile | null {
    const profile = this.getProfile(profileId);
    if (!profile) return null;

    const [hash, salt] = profile.passwordHash.split(':');
    if (!SecurityService.verifyPassword(password, hash, salt)) {
      return null;
    }

    // Decrypt sensitive data if exists
    if (profile.encryptedData) {
      try {
        const decrypted = SecurityService.decryptData(profile.encryptedData, password);
        return { ...profile, ...decrypted };
      } catch {
        return null;
      }
    }

    return profile;
  }

  /**
   * Update profile
   */
  static updateProfile(profileId: string, updates: Partial<Profile>, password?: string): boolean {
    const profiles = this.loadProfiles();
    const index = profiles.findIndex(p => p.id === profileId);
    
    if (index === -1) return false;

    const updated = {
      ...profiles[index],
      ...updates,
      lastUpdated: new Date()
    };

    // Re-encrypt if password provided
    if (password && updates.symptoms) {
      const sensitiveData = {
        symptoms: updated.symptoms,
        pmsIntensity: updated.pmsIntensity
      };
      updated.encryptedData = SecurityService.encryptData(sensitiveData, password);
    }

    profiles[index] = updated;
    this.saveAllProfiles(profiles);
    return true;
  }

  /**
   * Delete profile
   */
  static deleteProfile(profileId: string): boolean {
    const profiles = this.loadProfiles();
    const filtered = profiles.filter(p => p.id !== profileId);
    
    if (filtered.length === profiles.length) return false;

    this.saveAllProfiles(filtered);
    
    // Delete associated logs
    localStorage.removeItem(`${LOGS_KEY_PREFIX}${profileId}`);
    return true;
  }

  /**
   * Generate cycle calendar for profile
   */
  static generateCycleCalendar(profile: Profile, startDate?: Date): CycleDay[] {
    const cycleStart = startDate || profile.lastPeriodDate;
    const calendar: CycleDay[] = [];
    const logs = this.getLogs(profile.id);

    for (let day = 1; day <= profile.cycleLength; day++) {
      const date = new Date(cycleStart);
      date.setDate(date.getDate() + day - 1);

      const phase = CycleEngine.getPhase(day, profile.cycleLength, profile.bleedingLength);
      const relativeDay = CycleEngine.calculateRelativeDay(day, profile.cycleLength);
      
      // Get recent logs for adaptive predictions
      const recentLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        const daysDiff = Math.floor((date.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 3;
      });

      const predictions = getPredictionsForDay(relativeDay, profile, recentLogs);
      
      const actualLog = logs.find(log => {
        const logDate = new Date(log.date);
        return logDate.toDateString() === date.toDateString();
      });

      calendar.push({
        cycleDay: day,
        relativeDay,
        date,
        phase,
        predictions,
        actualLog
      });
    }

    return calendar;
  }

  /**
   * Save a daily log
   */
  static saveLog(profileId: string, log: DayLog): void {
    const logs = this.getLogs(profileId);
    
    // Remove existing log for same date if exists
    const filtered = logs.filter(l => {
      const existingDate = new Date(l.date);
      const newDate = new Date(log.date);
      return existingDate.toDateString() !== newDate.toDateString();
    });

    filtered.push(log);
    localStorage.setItem(`${LOGS_KEY_PREFIX}${profileId}`, JSON.stringify(filtered));
  }

  /**
   * Get all logs for a profile
   */
  static getLogs(profileId: string): DayLog[] {
    try {
      const data = localStorage.getItem(`${LOGS_KEY_PREFIX}${profileId}`);
      if (!data) return [];
      
      const logs = JSON.parse(data);
      // Convert date strings back to Date objects
      return logs.map((log: any) => ({
        ...log,
        date: new Date(log.date)
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get logs for date range
   */
  static getLogsInRange(profileId: string, startDate: Date, endDate: Date): DayLog[] {
    const logs = this.getLogs(profileId);
    return logs.filter(log => {
      const date = new Date(log.date);
      return date >= startDate && date <= endDate;
    });
  }

  /**
   * Export profile data
   */
  static exportData(profileId: string): string {
    const profile = this.getProfile(profileId);
    const logs = this.getLogs(profileId);
    
    return JSON.stringify({
      profile,
      logs,
      exportedAt: new Date()
    }, null, 2);
  }

  // Private helpers

  private static loadProfiles(): Profile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const profiles = JSON.parse(data);
      // Convert date strings back to Date objects
      return profiles.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        lastUpdated: new Date(p.lastUpdated),
        lastPeriodDate: new Date(p.lastPeriodDate)
      }));
    } catch {
      return [];
    }
  }

  private static saveProfile(profile: Profile): void {
    const profiles = this.loadProfiles();
    profiles.push(profile);
    this.saveAllProfiles(profiles);
  }

  private static saveAllProfiles(profiles: Profile[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }
}
