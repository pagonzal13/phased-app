import { QuestionnaireStep } from '@/types';

/**
 * Dynamic questionnaire configuration
 * Card-based, premium UI with smart branching
 */

export const QUESTIONNAIRE_STEPS: QuestionnaireStep[] = [
  {
    id: 'name',
    question: 'What would you like to call this profile?',
    type: 'single-select',
    options: [
      { value: 'My Cycle', label: 'My Cycle' },
      { value: 'Personal', label: 'Personal' },
      { value: 'Custom', label: 'Enter custom name' }
    ],
    required: true
  },
  {
    id: 'cycleLength',
    question: 'What is your typical cycle length?',
    type: 'range',
    min: 25,
    max: 35,
    step: 1,
    unit: 'days',
    required: true
  },
  {
    id: 'bleedingLength',
    question: 'How many days do you typically bleed?',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    unit: 'days',
    required: true
  },
  {
    id: 'bleedingIntensity',
    question: 'How would you describe your flow?',
    type: 'single-select',
    options: [
      { value: 'light', label: 'Light', description: 'Minimal flow, light protection needed' },
      { value: 'medium', label: 'Medium', description: 'Moderate flow, regular protection' },
      { value: 'heavy', label: 'Heavy', description: 'Heavy flow, frequent changes needed' }
    ],
    required: true
  },
  {
    id: 'pmsIntensity',
    question: 'Do you typically experience PMS symptoms?',
    type: 'single-select',
    options: [
      { value: 'none', label: 'None', description: 'Rarely notice premenstrual changes' },
      { value: 'mild', label: 'Mild', description: 'Subtle changes, manageable' },
      { value: 'moderate', label: 'Moderate', description: 'Noticeable symptoms that affect daily life' },
      { value: 'strong', label: 'Strong', description: 'Significant impact on mood and function' }
    ],
    required: true
  },
  {
    id: 'ovulationSigns',
    question: 'Do you track ovulation signs?',
    type: 'single-select',
    options: [
      { value: 'yes', label: 'Yes', description: 'I notice cervical mucus, temperature, or pain' },
      { value: 'no', label: 'No', description: 'I don\'t track or notice these signs' }
    ]
  },
  {
    id: 'averageSleep',
    question: 'How many hours do you typically sleep?',
    type: 'range',
    min: 4,
    max: 10,
    step: 0.5,
    unit: 'hours',
    required: true
  },
  {
    id: 'sleepQuality',
    question: 'How would you rate your sleep quality?',
    type: 'single-select',
    options: [
      { value: 'poor', label: 'Poor' },
      { value: 'fair', label: 'Fair' },
      { value: 'good', label: 'Good' },
      { value: 'excellent', label: 'Excellent' }
    ],
    required: true
  },
  {
    id: 'stressLevel',
    question: 'What is your typical stress level?',
    type: 'single-select',
    options: [
      { value: 'low', label: 'Low', description: 'Generally calm and balanced' },
      { value: 'medium', label: 'Medium', description: 'Moderate daily stress' },
      { value: 'high', label: 'High', description: 'Consistently high stress' }
    ],
    required: true
  },
  {
    id: 'trainingPreference',
    question: 'What type of training do you prefer?',
    type: 'single-select',
    options: [
      { value: 'cardio', label: 'Cardio', description: 'Running, cycling, swimming' },
      { value: 'strength', label: 'Strength', description: 'Weight training, resistance work' },
      { value: 'mixed', label: 'Mixed', description: 'Combination of both' },
      { value: 'minimal', label: 'Minimal', description: 'Light activity, walking, yoga' }
    ],
    required: true
  },
  {
    id: 'trainingFrequency',
    question: 'How many days per week do you train?',
    type: 'range',
    min: 0,
    max: 7,
    step: 1,
    unit: 'days/week',
    required: true
  },
  {
    id: 'heatSensitive',
    question: 'Are you sensitive to heat during training?',
    type: 'single-select',
    options: [
      { value: 'yes', label: 'Yes', description: 'I overheat easily during workouts' },
      { value: 'no', label: 'No', description: 'Heat doesn\'t affect me much' }
    ]
  },
  {
    id: 'symptoms',
    question: 'Which symptoms do you commonly experience? (Select all that apply)',
    type: 'multi-select',
    options: [
      { value: 'cramps', label: 'Cramps' },
      { value: 'bloating', label: 'Bloating' },
      { value: 'acne', label: 'Acne or skin changes' },
      { value: 'headache', label: 'Headache or migraine' },
      { value: 'breastTenderness', label: 'Breast tenderness' },
      { value: 'digestiveIssues', label: 'Digestive issues' },
      { value: 'anxiety', label: 'Anxiety or irritability' },
      { value: 'lowMood', label: 'Low mood or rumination' },
      { value: 'libidoFluctuation', label: 'Libido fluctuation' }
    ]
  },
  {
    id: 'lastPeriod',
    question: 'When did your last period start?',
    type: 'single-select',
    options: [
      { value: 'today', label: 'Today' },
      { value: '1-7', label: '1-7 days ago' },
      { value: '8-14', label: '1-2 weeks ago' },
      { value: '15-21', label: '2-3 weeks ago' },
      { value: '22+', label: 'More than 3 weeks ago' }
    ],
    required: true
  }
];

/**
 * Conditional logic for questionnaire flow
 */
export function shouldShowStep(stepId: string, answers: Record<string, any>): boolean {
  // Show heat sensitivity only if training is not minimal
  if (stepId === 'heatSensitive') {
    return answers.trainingPreference !== 'minimal';
  }

  // Always show other steps
  return true;
}

/**
 * Validate questionnaire answers
 */
export function validateAnswers(answers: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const requiredFields = QUESTIONNAIRE_STEPS
    .filter(step => step.required)
    .map(step => step.id);

  for (const field of requiredFields) {
    if (!answers[field]) {
      errors.push(`Please answer: ${QUESTIONNAIRE_STEPS.find(s => s.id === field)?.question}`);
    }
  }

  // Validate ranges
  if (answers.cycleLength && (answers.cycleLength < 25 || answers.cycleLength > 35)) {
    errors.push('Cycle length must be between 25 and 35 days');
  }

  if (answers.bleedingLength && answers.bleedingLength > answers.cycleLength / 2) {
    errors.push('Bleeding length seems unusually long for your cycle');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Convert questionnaire answers to Profile data
 */
export function answersToProfile(answers: Record<string, any>): any {
  // Calculate last period date from answer
  let lastPeriodDate = new Date();
  switch (answers.lastPeriod) {
    case 'today':
      break;
    case '1-7':
      lastPeriodDate.setDate(lastPeriodDate.getDate() - 4);
      break;
    case '8-14':
      lastPeriodDate.setDate(lastPeriodDate.getDate() - 10);
      break;
    case '15-21':
      lastPeriodDate.setDate(lastPeriodDate.getDate() - 18);
      break;
    case '22+':
      lastPeriodDate.setDate(lastPeriodDate.getDate() - 25);
      break;
  }

  // Convert symptoms array to object
  const symptomsObj: any = {
    cramps: false,
    bloating: false,
    acne: false,
    headache: false,
    breastTenderness: false,
    digestiveIssues: false,
    anxiety: false,
    lowMood: false,
    libidoFluctuation: false
  };

  if (answers.symptoms && Array.isArray(answers.symptoms)) {
    answers.symptoms.forEach((symptom: string) => {
      symptomsObj[symptom] = true;
    });
  }

  return {
    name: answers.name === 'Custom' ? (answers.customName || 'My Cycle') : answers.name,
    cycleLength: answers.cycleLength,
    bleedingLength: answers.bleedingLength,
    bleedingIntensity: answers.bleedingIntensity,
    pmsIntensity: answers.pmsIntensity,
    hasOvulationSigns: answers.ovulationSigns === 'yes',
    averageSleep: answers.averageSleep,
    sleepQuality: answers.sleepQuality,
    stressLevel: answers.stressLevel,
    trainingPreference: answers.trainingPreference,
    trainingFrequency: answers.trainingFrequency,
    heatSensitive: answers.heatSensitive === 'yes',
    symptoms: symptomsObj,
    lastPeriodDate
  };
}
