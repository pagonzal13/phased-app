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
   * Get phase information for a given cycle day and bleeding length
   * @param cycleDay - Day of cycle (1-based)
   * @param cycleLength - Total cycle length
   * @param bleedingLength - Number of bleeding days
   */
  static getPhase(cycleDay: number, cycleLength: number, bleedingLength: number): PhaseInfo {
    const ovulationDay = this.calculateOvulationDay(cycleLength);
    
    // MENSTRUAL PHASE: Days 1 to bleedingLength
    if (cycleDay >= 1 && cycleDay <= bleedingLength) {
      return {
        name: 'menstrual_early',
        displayName: 'Menstrual',
        range: `Day 1-${bleedingLength}`,
        isBleeding: true
      };
    }
    
    // EARLY FOLLICULAR: After bleeding until mid-follicular
    // Usually days after bleeding to about ovulation-9
    const earlyFollicularEnd = Math.max(bleedingLength + 1, ovulationDay - 9);
    if (cycleDay > bleedingLength && cycleDay <= earlyFollicularEnd) {
      return {
        name: 'follicular_mid',
        displayName: 'Early Follicular',
        range: `Day ${bleedingLength + 1}-${earlyFollicularEnd}`,
        isBleeding: false
      };
    }
    
    // MID FOLLICULAR: About O-9 to O-6
    const midFollicularEnd = ovulationDay - 6;
    if (cycleDay > earlyFollicularEnd && cycleDay <= midFollicularEnd) {
      return {
        name: 'follicular_mid',
        displayName: 'Mid Follicular',
        range: `Day ${earlyFollicularEnd + 1}-${midFollicularEnd}`,
        isBleeding: false
      };
    }
    
    // HIGH FOLLICULAR: O-5 to O-3
    const highFollicularEnd = ovulationDay - 3;
    if (cycleDay > midFollicularEnd && cycleDay <= highFollicularEnd) {
      return {
        name: 'follicular_high',
        displayName: 'High Follicular',
        range: `Day ${midFollicularEnd + 1}-${highFollicularEnd}`,
        isBleeding: false
      };
    }
    
    // FERTILE WINDOW / OVULATORY: O-2 to O+1
    const fertileWindowEnd = ovulationDay + 1;
    if (cycleDay > highFollicularEnd && cycleDay <= fertileWindowEnd) {
      return {
        name: 'ovulatory',
        displayName: 'Ovulatory',
        range: `Day ${highFollicularEnd + 1}-${fertileWindowEnd}`,
        isBleeding: false,
        isFertile: true,
        isOvulation: cycleDay === ovulationDay
      };
    }
    
    // EARLY LUTEAL: O+2 to O+7
    const earlyLutealEnd = ovulationDay + 7;
    if (cycleDay > fertileWindowEnd && cycleDay <= earlyLutealEnd) {
      return {
        name: 'luteal_early',
        displayName: 'Early Luteal',
        range: `Day ${fertileWindowEnd + 1}-${earlyLutealEnd}`,
        isBleeding: false
      };
    }
    
    // MID LUTEAL: O+8 to O+10
    const midLutealEnd = ovulationDay + 10;
    if (cycleDay > earlyLutealEnd && cycleDay <= midLutealEnd) {
      return {
        name: 'luteal_mid',
        displayName: 'Mid Luteal',
        range: `Day ${earlyLutealEnd + 1}-${midLutealEnd}`,
        isBleeding: false
      };
    }
    
    // LATE LUTEAL / PREMENSTRUAL: Rest of cycle
    return {
      name: 'luteal_late',
      displayName: 'Late Luteal / Premenstrual',
      range: `Day ${midLutealEnd + 1}-${cycleLength}`,
      isBleeding: false
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
