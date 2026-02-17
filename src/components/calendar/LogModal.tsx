'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../LanguageProvider';
import { getMoodIcon, getSymptomIcon } from '@/lib/icons';
import { DayLog } from '@/types';
import { ProfileService } from '@/lib/profileService';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  cycleDay: number;
  date: Date;
  existingLog?: DayLog;
}

export default function LogModal({
  isOpen,
  onClose,
  profileId,
  cycleDay,
  date,
  existingLog
}: LogModalProps) {
  const { t } = useLanguage();
  
  const [mood, setMood] = useState(existingLog?.mood || 5);
  const [energy, setEnergy] = useState(existingLog?.energy || 5);
  const [sleepHours, setSleepHours] = useState(existingLog?.sleep.hours || 7);
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>(
    existingLog?.sleep.quality || 'good'
  );
  const [stress, setStress] = useState(existingLog?.stress || 5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState('');
  const [trainingType, setTrainingType] = useState<'none' | 'cardio' | 'strength' | 'mixed'>(
    existingLog?.training?.type || 'none'
  );
  const [trainingIntensity, setTrainingIntensity] = useState<'light' | 'moderate' | 'high'>(
    existingLog?.training?.intensity || 'moderate'
  );
  const [notes, setNotes] = useState(existingLog?.notes || '');

  const symptoms = [
    'cramps', 'bloating', 'acne', 'headache',
    'breastTenderness', 'digestiveIssues', 'anxiety', 'lowMood'
  ];

  const symptomKeyMap: Record<string, string> = {
    'cramps': 'symptomCramps',
    'bloating': 'symptomBloating',
    'acne': 'symptomAcne',
    'headache': 'symptomHeadache',
    'breastTenderness': 'symptomBreastTenderness',
    'digestiveIssues': 'symptomDigestive',
    'anxiety': 'symptomAnxiety',
    'lowMood': 'symptomLowMood'
  };

  const MoodIcon = getMoodIcon(mood);
  const EnergyIcon = getMoodIcon(energy);

  const handleSave = () => {
    const log: DayLog = {
      date,
      cycleDay,
      mood,
      moodTags: [],
      energy,
      sleep: {
        hours: sleepHours,
        quality: sleepQuality
      },
      stress,
      symptoms: {
        pain: selectedSymptoms.includes('cramps') ? 7 : undefined
      },
      training: trainingType !== 'none' ? {
        type: trainingType,
        intensity: trainingIntensity
      } : undefined,
      notes: notes + (customSymptoms ? `\n\nCustom symptoms: ${customSymptoms}` : '')
    };
    
    ProfileService.saveLog(profileId, log);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        />

        <div className="min-h-screen px-4 flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="modal-content max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl">{t('logging.title')}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Mood */}
              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <MoodIcon className="w-5 h-5 text-gold" />
                  {t('logging.moodLabel')}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span className="text-lg font-semibold text-charcoal">{mood}</span>
                  <span>10</span>
                </div>
              </div>

              {/* Energy */}
              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <EnergyIcon className="w-5 h-5 text-gold" />
                  {t('logging.energyLabel')}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span className="text-lg font-semibold text-charcoal">{energy}</span>
                  <span>10</span>
                </div>
              </div>

              {/* Sleep & Stress in grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('logging.sleepHours')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('logging.sleepQuality')}
                  </label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value as any)}
                    className="w-full"
                  >
                    <option value="poor">{t('questionnaire.sleepPoor')}</option>
                    <option value="fair">{t('questionnaire.sleepFair')}</option>
                    <option value="good">{t('questionnaire.sleepGood')}</option>
                    <option value="excellent">{t('questionnaire.sleepExcellent')}</option>
                  </select>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  {t('logging.symptoms')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {symptoms.map((symptom) => {
                    const Icon = getSymptomIcon(symptom);
                    const isSelected = selectedSymptoms.includes(symptom);
                    const translationKey = `questionnaire.${symptomKeyMap[symptom]}`;
                    
                    return (
                      <button
                        key={symptom}
                        onClick={() => {
                          setSelectedSymptoms(prev =>
                            isSelected ? prev.filter(s => s !== symptom) : [...prev, symptom]
                          );
                        }}
                        className={`card-hover p-3 flex items-center gap-2 text-left ${
                          isSelected ? 'border-gold bg-gold/5' : ''
                        }`}
                      >
                        <Icon className="w-4 h-4 text-gold" />
                        <span className="text-sm">{t(translationKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Symptoms & Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('logging.customSymptoms')}
                </label>
                <input
                  type="text"
                  value={customSymptoms}
                  onChange={(e) => setCustomSymptoms(e.target.value)}
                  className="w-full"
                  placeholder={t('logging.customSymptoms')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('logging.notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full"
                  placeholder={t('logging.notes')}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={onClose} className="btn-secondary flex-1">
                {t('common.cancel')}
              </button>
              <button onClick={handleSave} className="btn-primary flex-1">
                {t('logging.save')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
