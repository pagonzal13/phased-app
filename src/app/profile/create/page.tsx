'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Header from '@/components/ui/Header';
import { useLanguage } from '@/components/LanguageProvider';
import { ProfileService } from '@/lib/profileService';
import { SessionManager } from '@/lib/security';
import { getSymptomIcon, trainingIcons } from '@/lib/icons';

const QUESTIONNAIRE_STEPS = [
  { id: 'name', type: 'text' },
  { id: 'cycleLength', type: 'range', min: 25, max: 35, unit: 'days' },
  { id: 'bleedingLength', type: 'range', min: 1, max: 10, unit: 'days' },
  { id: 'bleedingIntensity', type: 'single-select' },
  { id: 'pmsIntensity', type: 'single-select' },
  { id: 'ovulationSigns', type: 'single-select' },
  { id: 'averageSleep', type: 'range', min: 4, max: 10, step: 0.5, unit: 'hours' },
  { id: 'sleepQuality', type: 'single-select' },
  { id: 'stressLevel', type: 'single-select' },
  { id: 'trainingPreference', type: 'single-select' },
  { id: 'trainingFrequency', type: 'range', min: 0, max: 7, unit: 'days/week' },
  { id: 'heatSensitive', type: 'single-select' },
  { id: 'symptoms', type: 'multi-select' },
  { id: 'lastPeriod', type: 'date' }
];

export default function CreateProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    name: 'My Cycle',
    cycleLength: 28,
    bleedingLength: 5,
    averageSleep: 7,
    trainingFrequency: 3
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const totalSteps = QUESTIONNAIRE_STEPS.length;
  const step = QUESTIONNAIRE_STEPS[currentStep];
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;

  const getOptions = (stepId: string) => {
    const optionsMap: Record<string, any[]> = {
      bleedingIntensity: [
        { value: 'light', labelKey: 'questionnaire.bleedingLight', descKey: 'questionnaire.bleedingLightDesc' },
        { value: 'medium', labelKey: 'questionnaire.bleedingMedium', descKey: 'questionnaire.bleedingMediumDesc' },
        { value: 'heavy', labelKey: 'questionnaire.bleedingHeavy', descKey: 'questionnaire.bleedingHeavyDesc' }
      ],
      pmsIntensity: [
        { value: 'none', labelKey: 'questionnaire.pmsNone', descKey: 'questionnaire.pmsNoneDesc' },
        { value: 'mild', labelKey: 'questionnaire.pmsMild', descKey: 'questionnaire.pmsMildDesc' },
        { value: 'moderate', labelKey: 'questionnaire.pmsModerate', descKey: 'questionnaire.pmsModerateDesc' },
        { value: 'strong', labelKey: 'questionnaire.pmsStrong', descKey: 'questionnaire.pmsStrongDesc' }
      ],
      ovulationSigns: [
        { value: 'yes', labelKey: 'questionnaire.ovulationYes', descKey: 'questionnaire.ovulationYesDesc' },
        { value: 'no', labelKey: 'questionnaire.ovulationNo', descKey: 'questionnaire.ovulationNoDesc' }
      ],
      sleepQuality: [
        { value: 'poor', labelKey: 'questionnaire.sleepPoor' },
        { value: 'fair', labelKey: 'questionnaire.sleepFair' },
        { value: 'good', labelKey: 'questionnaire.sleepGood' },
        { value: 'excellent', labelKey: 'questionnaire.sleepExcellent' }
      ],
      stressLevel: [
        { value: 'low', labelKey: 'questionnaire.stressLow', descKey: 'questionnaire.stressLowDesc' },
        { value: 'medium', labelKey: 'questionnaire.stressMedium', descKey: 'questionnaire.stressMediumDesc' },
        { value: 'high', labelKey: 'questionnaire.stressHigh', descKey: 'questionnaire.stressHighDesc' }
      ],
      trainingPreference: [
        { value: 'cardio', labelKey: 'questionnaire.trainingCardio', descKey: 'questionnaire.trainingCardioDesc' },
        { value: 'strength', labelKey: 'questionnaire.trainingStrength', descKey: 'questionnaire.trainingStrengthDesc' },
        { value: 'mixed', labelKey: 'questionnaire.trainingMixed', descKey: 'questionnaire.trainingMixedDesc' },
        { value: 'minimal', labelKey: 'questionnaire.trainingMinimal', descKey: 'questionnaire.trainingMinimalDesc' }
      ],
      heatSensitive: [
        { value: 'yes', labelKey: 'questionnaire.heatYes', descKey: 'questionnaire.heatYesDesc' },
        { value: 'no', labelKey: 'questionnaire.heatNo', descKey: 'questionnaire.heatNoDesc' }
      ],
      symptoms: [
        { value: 'cramps', labelKey: 'questionnaire.symptomCramps' },
        { value: 'bloating', labelKey: 'questionnaire.symptomBloating' },
        { value: 'acne', labelKey: 'questionnaire.symptomAcne' },
        { value: 'headache', labelKey: 'questionnaire.symptomHeadache' },
        { value: 'breastTenderness', labelKey: 'questionnaire.symptomBreastTenderness' },
        { value: 'digestiveIssues', labelKey: 'questionnaire.symptomDigestive' },
        { value: 'anxiety', labelKey: 'questionnaire.symptomAnxiety' },
        { value: 'lowMood', labelKey: 'questionnaire.symptomLowMood' },
        { value: 'libidoFluctuation', labelKey: 'questionnaire.symptomLibido' }
      ]
    };
    return optionsMap[stepId] || [];
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
    setErrors([]);
  };

  const handleNext = () => {
    if (!answers[step.id] && step.type !== 'multi-select') {
      setErrors([t('questionnaire.errors.required')]);
      return;
    }
    setErrors([]);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors([]);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (!password || password.length < 8) {
      setErrors([t('questionnaire.errors.passwordLength')]);
      return;
    }
    if (password !== confirmPassword) {
      setErrors([t('questionnaire.errors.passwordMatch')]);
      return;
    }

    try {
      const profileData = answersToProfile(answers);
      const profile = await ProfileService.createProfile(profileData, password);
      SessionManager.createSession(profile.id);
      router.push(`/calendar/${profile.id}`);
    } catch (error) {
      setErrors([t('questionnaire.errors.createFailed')]);
    }
  };

  const answersToProfile = (answers: Record<string, any>) => {
    const symptomsObj: any = {
      cramps: false, bloating: false, acne: false, headache: false,
      breastTenderness: false, digestiveIssues: false, anxiety: false,
      lowMood: false, libidoFluctuation: false
    };
    if (answers.symptoms && Array.isArray(answers.symptoms)) {
      answers.symptoms.forEach((symptom: string) => {
        symptomsObj[symptom] = true;
      });
    }

    return {
      name: answers.name,
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
      lastPeriodDate: answers.lastPeriod ? new Date(answers.lastPeriod) : new Date()
    };
  };

  const renderStepContent = () => {
    if (step.type === 'text') {
      return (
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={answers[step.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={t(`questionnaire.${step.id}`)}
            className="w-full text-center text-2xl"
            autoFocus
          />
        </div>
      );
    }

    if (step.type === 'date') {
      return (
        <div className="max-w-md mx-auto">
          <input
            type="date"
            value={answers[step.id] ? new Date(answers[step.id]).toISOString().split('T')[0] : ''}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full text-center text-xl"
            autoFocus
          />
        </div>
      );
    }

    if (step.type === 'range') {
      return (
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="text-5xl display-font text-center mb-2">
              {answers[step.id] || step.min}
              <span className="text-2xl text-gray-500 ml-2">{step.unit}</span>
            </div>
          </div>
          <input
            type="range"
            min={step.min}
            max={step.max}
            step={step.step || 1}
            value={answers[step.id] || step.min}
            onChange={(e) => handleAnswer(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{step.min}{step.unit}</span>
            <span>{step.max}{step.unit}</span>
          </div>
        </div>
      );
    }

    if (step.type === 'single-select') {
      return (
        <div className="grid gap-4">
          {getOptions(step.id).map((option) => {
            const Icon = step.id === 'trainingPreference' ? trainingIcons[option.value as keyof typeof trainingIcons] : null;
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value)}
                className={`card-hover text-left p-6 ${
                  answers[step.id] === option.value ? 'border-gold bg-gold/5' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex items-start gap-3">
                    {Icon && <Icon className="w-5 h-5 text-gold mt-1" />}
                    <div>
                      <h3 className="text-lg mb-1">{t(option.labelKey)}</h3>
                      {option.descKey && (
                        <p className="text-sm text-gray-600">{t(option.descKey)}</p>
                      )}
                    </div>
                  </div>
                  {answers[step.id] === option.value && (
                    <Check className="w-5 h-5 text-gold" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (step.type === 'multi-select') {
      return (
        <div className="grid md:grid-cols-2 gap-4">
          {getOptions(step.id).map((option) => {
            const isSelected = answers[step.id]?.includes(option.value);
            const Icon = getSymptomIcon(option.value);
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const current = answers[step.id] || [];
                  const updated = isSelected
                    ? current.filter((v: any) => v !== option.value)
                    : [...current, option.value];
                  handleAnswer(updated);
                }}
                className={`card-hover text-left p-4 ${
                  isSelected ? 'border-gold bg-gold/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gold" />
                  <span className="flex-1">{t(option.labelKey)}</span>
                  {isSelected && <Check className="w-5 h-5 text-gold" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      );
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const showPasswordScreen = isLastStep && answers[step.id];

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="section-padding">
        <div className="container-width max-w-4xl">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {t('questionnaire.step')} {currentStep + 1} {t('questionnaire.of')} {totalSteps}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-soft-gray overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showPasswordScreen ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-4xl mb-8 text-center">
                  {t(`questionnaire.${step.id}`)}
                </h2>
                
                {renderStepContent()}

                {errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700"
                  >
                    {errors.map((error, i) => <p key={i}>{error}</p>)}
                  </motion.div>
                )}

                <div className="flex gap-4 mt-12">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('questionnaire.back')}
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isLastStep ? t('questionnaire.reviewAnswers') : t('questionnaire.continue')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto"
              >
                <div className="card">
                  <h2 className="text-3xl mb-6 text-center">{t('questionnaire.protectProfile')}</h2>
                  <p className="text-gray-600 text-center mb-8">
                    {t('questionnaire.protectProfileDesc')}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm mb-2">
                        {t('questionnaire.passwordLabel')}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">
                        {t('questionnaire.confirmPasswordLabel')}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {errors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                      {errors.map((error, i) => <p key={i}>{error}</p>)}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(totalSteps - 1)}
                      className="btn-secondary flex-1"
                    >
                      {t('questionnaire.back')}
                    </button>
                    <button
                      onClick={handleFinish}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                      disabled={!password || !confirmPassword}
                    >
                      <Check className="w-4 h-4" />
                      {t('questionnaire.createProfile')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
