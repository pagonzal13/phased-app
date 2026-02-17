import {
  Droplets,
  Droplet,
  Sun,
  Sunrise,
  Moon,
  CloudMoon,
  Star,
  CloudRain,
  Zap,
  Wind,
  Brain,
  Heart,
  Flame,
  Activity,
  AlertCircle,
  Smile,
  Frown,
  Meh,
  Laugh,
  Minus,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';

// Symptom icons
export const symptomIcons = {
  cramps: Zap,
  bloating: Wind,
  acne: Droplet,
  headache: Brain,
  breastTenderness: Heart,
  digestiveIssues: Activity,
  anxiety: AlertCircle,
  lowMood: CloudRain,
  libidoFluctuation: Flame
};

// Phase icons
export const phaseIcons = {
  menstrual_early: Droplets,
  follicular_mid: Sunrise,
  follicular_high: Sun,
  ovulatory: Star,
  luteal_early: Moon,
  luteal_mid: CloudMoon,
  luteal_late: CloudRain
};

// Mood level icons
export const moodIcons = {
  1: Frown,
  2: Frown,
  3: Meh,
  4: Meh,
  5: Minus,
  6: Minus,
  7: Smile,
  8: Smile,
  9: Laugh,
  10: Laugh
};

// Energy level indicators
export const energyIcons = {
  'very-low': { icon: TrendingDown, color: 'text-red-600' },
  'low': { icon: TrendingDown, color: 'text-red-500' },
  'medium-low': { icon: Minus, color: 'text-yellow-600' },
  'medium': { icon: Minus, color: 'text-yellow-500' },
  'medium-high': { icon: TrendingUp, color: 'text-green-500' },
  'high': { icon: TrendingUp, color: 'text-green-600' },
  'very-high': { icon: TrendingUp, color: 'text-green-700' }
};

// Training type icons
export const trainingIcons = {
  cardio: Activity,
  strength: Zap,
  mixed: Star,
  minimal: Moon
};

export function getPhaseIcon(phaseName: string) {
  const Icon = phaseIcons[phaseName as keyof typeof phaseIcons] || Calendar;
  return Icon;
}

export function getSymptomIcon(symptomName: string) {
  const Icon = symptomIcons[symptomName as keyof typeof symptomIcons] || AlertCircle;
  return Icon;
}

export function getMoodIcon(moodValue: number) {
  const Icon = moodIcons[moodValue as keyof typeof moodIcons] || Minus;
  return Icon;
}
