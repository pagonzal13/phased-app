import { PhaseInfo } from '@/types';

/**
 * Core Cycle Calculation Engine
 * Maps any cycle length (25-35 days) to relative ovulation days (O-14 to O+13)
 */

export class CycleEngine {
  /**
   * Calculate ovulation day based on cycle length
   * Standard approximation: CycleLength - 14
   */
  static calculateOvulationDay(cycleLength: number): number {
    return cycleLength - 14;
  }

  /**
   * Calculate relative day (O±X) from cycle day
   * @param cycleDay - Current day of cycle (1-based)
   * @param cycleLength - Total cycle length
   * @returns Relative day number (negative before ovulation, 0 on ovulation, positive after)
   */
  static calculateRelativeDay(cycleDay: number, cycleLength: number): number {
    const ovulationDay = this.calculateOvulationDay(cycleLength);
    return cycleDay - ovulationDay;
  }

  /**
   * Get phase information for a given relative day
   */
  static getPhase(relativeDay: number): PhaseInfo {
    if (relativeDay >= -14 && relativeDay <= -10) {
      return {
        name: 'menstrual_early',
        displayName: 'Menstrual / Early Follicular',
        range: 'O-14 to O-10'
      };
    } else if (relativeDay >= -9 && relativeDay <= -6) {
      return {
        name: 'follicular_mid',
        displayName: 'Mid Follicular',
        range: 'O-9 to O-6'
      };
    } else if (relativeDay >= -5 && relativeDay <= -3) {
      return {
        name: 'follicular_high',
        displayName: 'High Follicular',
        range: 'O-5 to O-3'
      };
    } else if (relativeDay >= -2 && relativeDay <= 1) {
      return {
        name: 'ovulatory',
        displayName: 'Ovulatory Window',
        range: 'O-2 to O+1'
      };
    } else if (relativeDay >= 2 && relativeDay <= 7) {
      return {
        name: 'luteal_early',
        displayName: 'Early Luteal',
        range: 'O+2 to O+7'
      };
    } else if (relativeDay >= 8 && relativeDay <= 10) {
      return {
        name: 'luteal_mid',
        displayName: 'Mid Luteal',
        range: 'O+8 to O+10'
      };
    } else if (relativeDay >= 11 && relativeDay <= 13) {
      return {
        name: 'luteal_late',
        displayName: 'Late Luteal / Premenstrual',
        range: 'O+11 to O+13'
      };
    }
    
    // Fallback for edge cases
    return {
      name: 'menstrual_early',
      displayName: 'Transitional',
      range: 'Edge of cycle'
    };
  }

  /**
   * Generate cycle day number from date and cycle start
   */
  static getCycleDayFromDate(date: Date, cycleStartDate: Date): number {
    const diffTime = date.getTime() - cycleStartDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 1-based indexing
  }

  /**
   * Calculate next period date
   */
  static getNextPeriodDate(lastPeriodDate: Date, cycleLength: number): Date {
    const nextDate = new Date(lastPeriodDate);
    nextDate.setDate(nextDate.getDate() + cycleLength);
    return nextDate;
  }

  /**
   * Get current cycle day
   */
  static getCurrentCycleDay(lastPeriodDate: Date, cycleLength: number): number {
    const today = new Date();
    const cycleDay = this.getCycleDayFromDate(today, lastPeriodDate);
    
    // If we've passed the cycle length, we're in a new cycle
    if (cycleDay > cycleLength) {
      return cycleDay % cycleLength || cycleLength;
    }
    
    return cycleDay;
  }

  /**
   * Format relative day for display (e.g., "O-5", "O", "O+3")
   */
  static formatRelativeDay(relativeDay: number): string {
    if (relativeDay === 0) return 'O';
    if (relativeDay > 0) return `O+${relativeDay}`;
    return `O${relativeDay}`; // Already has negative sign
  }
}

/**
 * Validation utilities
 */
export class CycleValidation {
  static isValidCycleLength(length: number): boolean {
    return length >= 25 && length <= 35;
  }

  static isValidCycleDay(day: number, cycleLength: number): boolean {
    return day >= 1 && day <= cycleLength;
  }

  static isValidBleedingLength(length: number, cycleLength: number): boolean {
    return length >= 1 && length <= Math.min(10, cycleLength / 2);
  }
}
