// Core domain types
export interface Profile {
  id: string;
  name: string;
  cycleLength: number;
  bleedingLength: number;
  bleedingIntensity: 'light' | 'medium' | 'heavy';
  pmsIntensity: 'none' | 'mild' | 'moderate' | 'strong';
  hasOvulationSigns: boolean;
  
  // Lifestyle
  averageSleep: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  stressLevel: 'low' | 'medium' | 'high';
  trainingPreference: 'cardio' | 'strength' | 'mixed' | 'minimal';
  trainingFrequency: number; // days per week
  heatSensitive: boolean;
  
  // Symptoms
  symptoms: {
    cramps: boolean;
    bloating: boolean;
    acne: boolean;
    headache: boolean;
    breastTenderness: boolean;
    digestiveIssues: boolean;
    anxiety: boolean;
    lowMood: boolean;
    libidoFluctuation: boolean;
  };
  
  // Security
  passwordHash: string;
  encryptedData?: string;
  
  // Metadata
  createdAt: Date;
  lastUpdated: Date;
  lastPeriodDate: Date;
}

export interface CycleDay {
  cycleDay: number; // CD1, CD2, etc.
  relativeDay: number; // O-14, O-13, ... O+13
  date: Date;
  phase: PhaseInfo;
  predictions: DayPredictions;
  actualLog?: DayLog;
}

export interface PhaseInfo {
  name: 'menstrual_early' | 'follicular_mid' | 'follicular_high' | 'ovulatory' | 'luteal_early' | 'luteal_mid' | 'luteal_late';
  displayName: string;
  range: string; // e.g., "O-14 to O-10"
}

export interface DayPredictions {
  physicalEnergy: EnergyLevel;
  socialEnergy: EnergyLevel;
  emotionalState: string;
  cognition: string;
  selfPerception: string;
  libido: EnergyLevel;
  training: TrainingRecommendation;
  work: WorkRecommendation;
  relationships: RelationshipGuidance;
  risks: string[];
}

export interface TrainingRecommendation {
  highEnergy: string;
  lowEnergy: string;
  avoid?: string;
  notes?: string;
}

export interface WorkRecommendation {
  ideal: string[];
  avoid?: string[];
  notes?: string;
}

export interface RelationshipGuidance {
  needs: string;
  communication: string;
  intimacy?: string;
}

export interface DayLog {
  date: Date;
  cycleDay: number;
  
  // Subjective measures
  mood: number; // 1-10
  moodTags: string[];
  energy: number; // 1-10
  sleep: {
    hours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  stress: number; // 1-10
  
  // Physical symptoms
  symptoms: {
    pain?: number; // 1-10
    bloating?: number; // 1-10
    breastTenderness?: number; // 1-10
    headache?: number; // 1-10
    digestion?: 'poor' | 'normal' | 'good';
    bleeding?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  };
  
  // Activity
  training?: {
    type: 'none' | 'cardio' | 'strength' | 'mixed';
    intensity: 'light' | 'moderate' | 'high';
    duration?: number; // minutes
  };
  
  notes?: string;
}

export type EnergyLevel = 'very-low' | 'low' | 'medium-low' | 'medium' | 'medium-high' | 'high' | 'very-high';

export interface Insight {
  type: 'pattern' | 'peak' | 'recommendation' | 'warning';
  title: string;
  description: string;
  relatedDays?: number[];
  confidence: 'low' | 'medium' | 'high';
}

export interface QuestionnaireStep {
  id: string;
  question: string;
  type: 'single-select' | 'multi-select' | 'range' | 'number' | 'toggle';
  options?: Array<{ value: any; label: string; description?: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  conditional?: {
    dependsOn: string;
    condition: (value: any) => boolean;
  };
}

export interface ProfileSession {
  profileId: string;
  unlocked: boolean;
  expiresAt: Date;
}
