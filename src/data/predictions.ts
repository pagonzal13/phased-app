import { DayPredictions, Profile } from '@/types';

/**
 * Base prediction data organized by relative day ranges
 * Translated and adapted from the Spanish dataset
 */

interface PhaseData {
  range: [number, number]; // [min, max] relative days
  physicalEnergy: string;
  socialEnergy: string;
  emotionalState: string;
  cognition: string;
  selfPerception: string;
  libido: string;
  training: {
    highEnergy: string;
    lowEnergy: string;
    notes?: string;
  };
  work: {
    ideal: string[];
    avoid?: string[];
  };
  relationships: {
    needs: string;
    communication: string;
  };
  risks: string[];
}

const PHASE_DATA: PhaseData[] = [
  {
    // O-14 to O-10: Menstrual / Early Follicular
    range: [-14, -10],
    physicalEnergy: 'Low to medium-low',
    socialEnergy: 'Low',
    emotionalState: 'Introspective and sensitive. Many people feel a need for quiet and rest.',
    cognition: 'May experience slight mental fog in the first days',
    selfPerception: 'More self-critical or vulnerable',
    libido: 'Low in most (though some experience an increase just after bleeding starts)',
    training: {
      highEnergy: 'Light strength work with focus on technique, Zone 2 cardio (short duration)',
      lowEnergy: 'Gentle mobility, walking, restorative yoga',
      notes: 'Listen to your body carefully during menstruation'
    },
    work: {
      ideal: ['Planning and organization', 'Closing out tasks', 'Deep individual work', 'Documentation'],
      avoid: ['High-stakes presentations', 'Intensive networking']
    },
    relationships: {
      needs: 'Greater need for care and safe space',
      communication: 'Direct and gentle communication works best'
    },
    risks: ['Fatigue', 'Menstrual pain', 'Low iron if bleeding is heavy']
  },
  {
    // O-9 to O-6: Mid Follicular (Ascending)
    range: [-9, -6],
    physicalEnergy: 'Medium to medium-high',
    socialEnergy: 'Increasing',
    emotionalState: 'Growing optimism and motivation',
    cognition: 'High mental clarity and creativity emerging',
    selfPerception: 'Notable improvement in self-image',
    libido: 'Rising progressively',
    training: {
      highEnergy: 'Excellent window for strength progression, moderate intervals, volume increases',
      lowEnergy: 'Zone 2 cardio, technique practice, steady state training',
      notes: 'Good phase to build training volume'
    },
    work: {
      ideal: ['Starting new projects', 'Strategic planning', 'Important meetings', 'Creative work'],
      avoid: []
    },
    relationships: {
      needs: 'Greater openness to connection',
      communication: 'Good time for important conversations'
    },
    risks: ['Overestimating capacity and loading too much training volume']
  },
  {
    // O-5 to O-3: High Follicular
    range: [-5, -3],
    physicalEnergy: 'High',
    socialEnergy: 'High',
    emotionalState: 'Confidence and drive peak',
    cognition: 'Excellent multitasking ability',
    selfPerception: 'Increased self-esteem',
    libido: 'High and rising',
    training: {
      highEnergy: 'Optimal time for intense strength, power work, HIIT, personal records (if recovery supports it)',
      lowEnergy: 'Moderate strength training, tempo runs',
      notes: 'Peak performance window - but don\'t skip recovery'
    },
    work: {
      ideal: ['Presentations', 'Networking events', 'Public speaking', 'Negotiations', 'Leadership moments'],
      avoid: []
    },
    relationships: {
      needs: 'More desire for closeness and playfulness',
      communication: 'Assertive and clear communication comes naturally'
    },
    risks: ['Excess intensity without adequate recovery', 'Overcommitment']
  },
  {
    // O-2 to O+1: Ovulatory Window
    range: [-2, 1],
    physicalEnergy: 'High (individual variation)',
    socialEnergy: 'Very high',
    emotionalState: 'Expansive and magnetic for many people',
    cognition: 'Quick, interaction-oriented',
    selfPerception: 'Heightened sense of attractiveness',
    libido: 'Peak likely',
    training: {
      highEnergy: 'Power and high performance work. Ensure thorough warm-up (possible increased joint laxity)',
      lowEnergy: 'Moderate intensity training with good form focus',
      notes: 'Watch for joint stability - warm up thoroughly'
    },
    work: {
      ideal: ['Sales', 'Interviews', 'Negotiations', 'Social events', 'Networking'],
      avoid: []
    },
    relationships: {
      needs: 'Greater sexual desire and connection',
      communication: 'May have heightened interpersonal sensitivity'
    },
    risks: ['Social overcommitment', 'Joint injury if not warming up properly']
  },
  {
    // O+2 to O+7: Early Luteal
    range: [2, 7],
    physicalEnergy: 'Medium stable',
    socialEnergy: 'Medium',
    emotionalState: 'More pragmatic and execution-focused',
    cognition: 'Good sustained focus',
    selfPerception: 'Neutral with possible mild bloating',
    libido: 'Medium',
    training: {
      highEnergy: 'Strength maintenance/moderate progression, Zone 2/tempo cardio',
      lowEnergy: 'Steady state training, technique work',
      notes: 'Hydration is key - body temperature elevated'
    },
    work: {
      ideal: ['Execution', 'Process work', 'Organization', 'Technical tasks'],
      avoid: []
    },
    relationships: {
      needs: 'More need for structure and clarity',
      communication: 'Direct and practical communication preferred'
    },
    risks: ['Increased heat perception and fatigue in intense training']
  },
  {
    // O+8 to O+10: Mid Luteal
    range: [8, 10],
    physicalEnergy: 'Medium-low',
    socialEnergy: 'Medium-low',
    emotionalState: 'Mild irritability possible',
    cognition: 'Slower if sleep is poor',
    selfPerception: 'More bloating and body sensitivity',
    libido: 'Declining',
    training: {
      highEnergy: 'Reduce training volume, maintain moderate intensity',
      lowEnergy: 'Focus on recovery, light activity, mobility',
      notes: 'Prioritize recovery over volume'
    },
    work: {
      ideal: ['Routine tasks', 'Review work', 'Documentation', 'Organization'],
      avoid: ['Intense creative demands', 'High-pressure deadlines if possible']
    },
    relationships: {
      needs: 'Greater emotional sensitivity',
      communication: 'Extra patience and clarity needed'
    },
    risks: ['PMS symptoms beginning']
  },
  {
    // O+11 to O+13: Late Luteal / Premenstrual
    range: [11, 13],
    physicalEnergy: 'Low',
    socialEnergy: 'Low',
    emotionalState: 'Greater emotional variability for many',
    cognition: 'Difficulty concentrating if PMS present',
    selfPerception: 'More self-critical',
    libido: 'Low',
    training: {
      highEnergy: 'Active recovery, walking, gentle movement',
      lowEnergy: 'Mobility, stretching, very light activity or rest',
      notes: 'Avoid HIIT if fatigue is high'
    },
    work: {
      ideal: ['Simple tasks', 'Low-stakes work'],
      avoid: ['Critical negotiations', 'High-pressure presentations', 'Complex problem-solving']
    },
    relationships: {
      needs: 'Greater need for space and understanding',
      communication: 'Direct but gentle approach works best'
    },
    risks: ['Significant PMS or PMDD symptoms if severe', 'Low frustration tolerance']
  }
];

/**
 * Generate predictions for a specific relative day with personalization
 */
export function getPredictionsForDay(
  relativeDay: number,
  profile: Profile,
  recentLogs?: any[]
): DayPredictions {
  // Find matching phase data
  const phaseData = PHASE_DATA.find(
    phase => relativeDay >= phase.range[0] && relativeDay <= phase.range[1]
  );

  if (!phaseData) {
    // Fallback for edge cases
    return getDefaultPredictions();
  }

  // Apply personalization modifiers
  const predictions: DayPredictions = {
    physicalEnergy: adjustEnergyLevel(phaseData.physicalEnergy, profile, recentLogs),
    socialEnergy: adjustEnergyLevel(phaseData.socialEnergy, profile, recentLogs),
    emotionalState: personalizeText(phaseData.emotionalState, profile, relativeDay),
    cognition: personalizeText(phaseData.cognition, profile, relativeDay),
    selfPerception: personalizeText(phaseData.selfPerception, profile, relativeDay),
    libido: adjustEnergyLevel(phaseData.libido, profile, recentLogs),
    training: personalizeTraining(phaseData.training, profile, relativeDay, recentLogs),
    work: personalizeWork(phaseData.work, profile, relativeDay),
    relationships: phaseData.relationships,
    risks: personalizeRisks(phaseData.risks, profile, relativeDay)
  };

  return predictions;
}

function adjustEnergyLevel(baseLevel: string, profile: Profile, recentLogs?: any[]): any {
  // Convert text to energy level enum
  const mapping: Record<string, any> = {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
    'Very high': 'very-high'
  };

  // Adjust based on recent sleep/stress if logs available
  // This is a simplified version - full implementation would be more sophisticated
  return baseLevel;
}

function personalizeText(baseText: string, profile: Profile, relativeDay: number): string {
  let text = baseText;

  // Add modifiers based on profile
  if (profile.pmsIntensity === 'strong' && relativeDay >= 11) {
    text = `${text} (Note: Your profile indicates strong PMS - symptoms may be more pronounced.)`;
  }

  if (profile.symptoms.anxiety && relativeDay >= 8) {
    text = `${text} Anxiety levels may fluctuate more during this phase.`;
  }

  return text;
}

function personalizeTraining(
  baseTraining: any,
  profile: Profile,
  relativeDay: number,
  recentLogs?: any[]
): any {
  const training = { ...baseTraining };

  // Adjust for training preference
  if (profile.trainingPreference === 'strength') {
    training.highEnergy = training.highEnergy.replace('cardio', 'strength-focused work');
  }

  // Reduce intensity during menstruation if heavy bleeding
  if (relativeDay >= -14 && relativeDay <= -10 && profile.bleedingIntensity === 'heavy') {
    training.notes = `${training.notes || ''} Consider extra rest given your typical heavy flow.`;
  }

  // Add heat sensitivity warnings
  if (profile.heatSensitive && relativeDay >= 2) {
    training.notes = `${training.notes || ''} Stay well-hydrated and consider cooler training environments.`;
  }

  return training;
}

function personalizeWork(baseWork: any, profile: Profile, relativeDay: number): any {
  return baseWork; // Could add more personalization here
}

function personalizeRisks(baseRisks: string[], profile: Profile, relativeDay: number): string[] {
  const risks = [...baseRisks];

  // Add profile-specific risks
  if (profile.symptoms.headache && relativeDay >= 11) {
    risks.push('Headache or migraine more likely');
  }

  if (profile.symptoms.digestiveIssues && (relativeDay <= -10 || relativeDay >= 11)) {
    risks.push('Digestive sensitivity');
  }

  return risks;
}

function getDefaultPredictions(): DayPredictions {
  return {
    physicalEnergy: 'medium',
    socialEnergy: 'medium',
    emotionalState: 'Neutral',
    cognition: 'Normal',
    selfPerception: 'Normal',
    libido: 'medium',
    training: {
      highEnergy: 'Moderate training',
      lowEnergy: 'Light activity'
    },
    work: {
      ideal: ['General tasks'],
      avoid: []
    },
    relationships: {
      needs: 'Normal connection',
      communication: 'Clear and direct'
    },
    risks: []
  };
}

export { PHASE_DATA };
