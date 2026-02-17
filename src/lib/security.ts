import CryptoJS from 'crypto-js';

/**
 * Password Security Utilities
 * Uses PBKDF2 for key derivation and AES for encryption
 */

const ITERATIONS = 10000;
const KEY_SIZE = 256 / 32; // 256 bits

export class SecurityService {
  /**
   * Hash password using PBKDF2
   */
  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const finalSalt = salt || CryptoJS.lib.WordArray.random(128 / 8).toString();
    const hash = CryptoJS.PBKDF2(password, finalSalt, {
      keySize: KEY_SIZE,
      iterations: ITERATIONS
    }).toString();

    return { hash, salt: finalSalt };
  }

  /**
   * Verify password against hash
   */
  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: newHash } = this.hashPassword(password, salt);
    return newHash === hash;
  }

  /**
   * Encrypt sensitive profile data
   */
  static encryptData(data: any, password: string): string {
    const dataStr = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataStr, password).toString();
    return encrypted;
  }

  /**
   * Decrypt profile data
   */
  static decryptData(encryptedData: string, password: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, password);
      const dataStr = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(dataStr);
    } catch (error) {
      throw new Error('Invalid password or corrupted data');
    }
  }

  /**
   * Generate secure random ID
   */
  static generateId(): string {
    return CryptoJS.lib.WordArray.random(16).toString();
  }
}

/**
 * Session management for unlocked profiles
 */
export class SessionManager {
  private static readonly SESSION_KEY = 'phased_sessions';
  private static readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  static createSession(profileId: string): void {
    const sessions = this.getSessions();
    sessions[profileId] = {
      unlockedAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
  }

  static isSessionValid(profileId: string): boolean {
    const sessions = this.getSessions();
    const session = sessions[profileId];

    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.clearSession(profileId);
      return false;
    }

    return true;
  }

  static clearSession(profileId: string): void {
    const sessions = this.getSessions();
    delete sessions[profileId];
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
  }

  static clearAllSessions(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  private static getSessions(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static extendSession(profileId: string): void {
    if (this.isSessionValid(profileId)) {
      this.createSession(profileId);
    }
  }
}
