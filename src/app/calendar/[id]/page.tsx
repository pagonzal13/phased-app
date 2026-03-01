'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Circle, ChevronLeft } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import Header from '@/components/ui/Header';
import { ProfileService } from '@/lib/profileService';
import { SessionManager } from '@/lib/security';
import { CycleEngine } from '@/lib/cycleEngine';
import { CycleDay, Profile, DayLog } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';
import { getPhaseIcon, getMoodIcon, getSymptomIcon } from '@/lib/icons';
import { getFamilyTips } from '@/data/familyTips';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function CalendarPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const profileId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [calendar, setCalendar] = useState<CycleDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CycleDay | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'family'>('grid');
  const [showUpdatePeriod, setShowUpdatePeriod] = useState(false);
  const [newPeriodDate, setNewPeriodDate] = useState('');
  const [modalView, setModalView] = useState<'details' | 'log'>('details');
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showFertileDays, setShowFertileDays] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Log form states
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  const [stress, setStress] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState('');
  const [notes, setNotes] = useState('');

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

  useEffect(() => {
    if (!SessionManager.isSessionValid(profileId)) {
      router.push('/profile');
      return;
    }

    const loadedProfile = ProfileService.getProfile(profileId);
    if (!loadedProfile) {
      router.push('/profile');
      return;
    }

    setProfile(loadedProfile);
    const cal = ProfileService.generateCycleCalendar(loadedProfile);
    setCalendar(cal);
    SessionManager.extendSession(profileId);
  }, [profileId, router]);

  const handleUpdatePeriod = () => {
    if (!profile || !newPeriodDate) return;
    
    const updatedProfile = {
      ...profile,
      lastPeriodDate: new Date(newPeriodDate)
    };
    
    ProfileService.updateProfile(profileId, updatedProfile);
    setProfile(updatedProfile);
    const newCalendar = ProfileService.generateCycleCalendar(updatedProfile);
    setCalendar(newCalendar);
    setShowUpdatePeriod(false);
    setNewPeriodDate('');
  };

  const handleSaveLog = () => {
    if (!selectedDay) return;

    const log: DayLog = {
      date: getDayDate(selectedDay),
      cycleDay: selectedDay.cycleDay,
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
      notes: notes + (customSymptoms ? `\n\nCustom symptoms: ${customSymptoms}` : '')
    };
    
    ProfileService.saveLog(profileId, log);
    setModalView('details');
    setMood(5);
    setEnergy(5);
    setSleepHours(7);
    setSleepQuality('good');
    setStress(5);
    setSelectedSymptoms([]);
    setCustomSymptoms('');
    setNotes('');
  };

  const handleCopyTips = (tips: any[]) => {
    const tipsText = tips.map((tip, i) => 
      `${i + 1}. ${tip.icon} ${tip.title}\n${tip.tip}`
    ).join('\n\n');
    
    const fullText = `${t('calendar.familyTips')}\n\n${tipsText}\n\n---\n${t('calendar.shareWith')}`;
    
    navigator.clipboard.writeText(fullText);
    setShowCopiedTooltip(true);
    setTimeout(() => setShowCopiedTooltip(false), 2000);
  };

  if (!profile || calendar.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-gold">{t('common.loading')}</div>
      </div>
    );
  }

  const locale = language === 'es' ? es : enUS;
  const today = new Date();
  const currentCycleDay = CycleEngine.getCurrentCycleDay(
    profile.lastPeriodDate,
    profile.cycleLength
  );

  const getPhaseColor = (phaseName: string): { bg: string; border: string; text: string; icon: string } => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      'menstrual_early': { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', icon: 'text-red-500' },
      'follicular_mid': { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700', icon: 'text-green-500' },
      'follicular_high': { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800', icon: 'text-green-600' },
      'ovulatory': { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800', icon: 'text-yellow-600' },
      'luteal_early': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', icon: 'text-blue-500' },
      'luteal_mid': { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800', icon: 'text-blue-600' },
      'luteal_late': { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', icon: 'text-purple-500' }
    };
    return colors[phaseName] || { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', icon: 'text-gray-500' };
  };

  const getEnergyValue = (energy: any): number => {
    if (typeof energy === 'string') {
      const energyStr = energy.toLowerCase();
      if (energyStr.includes('very high') || energyStr.includes('muy alta')) return 10;
      if (energyStr.includes('high') || energyStr.includes('alta')) return 8;
      if (energyStr.includes('medium-high') || energyStr.includes('media-alta')) return 7;
      if (energyStr.includes('medium') || energyStr.includes('media')) return 5;
      if (energyStr.includes('medium-low') || energyStr.includes('media-baja')) return 3;
      if (energyStr.includes('low') || energyStr.includes('baja')) return 2;
      if (energyStr.includes('very low') || energyStr.includes('muy baja')) return 1;
    }
    return 5;
  };

  const getDayDate = (day: CycleDay) => {
    return addDays(profile.lastPeriodDate, day.cycleDay - 1);
  };

  const getCycleDayForDate = (date: Date): CycleDay | null => {
    const daysDiff = Math.floor((date.getTime() - profile.lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = ((daysDiff % profile.cycleLength) + profile.cycleLength) % profile.cycleLength || profile.cycleLength;
    return calendar.find(d => d.cycleDay === cycleDay) || null;
  };

  // Generate calendar month grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = language === 'es' 
    ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    : ['Monday', 'Tueday', 'Wednesday', 'Thuday', 'Friday', 'Satday', 'Sunday'];

  const MoodIcon = getMoodIcon(mood);
  const EnergyIcon = getMoodIcon(energy);

  return (
    <div className="min-h-screen bg-cream">
      <Header currentPage="/calendar" />

      <main className="section-padding">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl mb-2">{profile.name}</h1>
                <p className="text-gray-600">
                  {language === 'es' ? 'Día' : 'Day'} {currentCycleDay} {t('common.of')} {profile.cycleLength} • {format(currentMonth, 'MMMM yyyy', { locale })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm mb-6">
              {[
                { name: 'menstrual_early', label: language === 'es' ? 'Menstrual' : 'Menstrual' },
                { name: 'follicular_mid', label: language === 'es' ? 'Folicular' : 'Follicular' },
                { name: 'follicular_high', label: language === 'es' ? 'Folicular Alta' : 'High Follicular' },
                { name: 'ovulatory', label: language === 'es' ? 'Ovulatoria' : 'Ovulatory' },
                { name: 'luteal_early', label: language === 'es' ? 'Lútea' : 'Luteal' },
                { name: 'luteal_mid', label: language === 'es' ? 'Lútea Media' : 'Mid Luteal' },
                { name: 'luteal_late', label: language === 'es' ? 'Premenstrual' : 'Premenstrual' }
              ].map((phase) => {
                const Icon = getPhaseIcon(phase.name);
                const colors = getPhaseColor(phase.name);
                return (
                  <div key={phase.name} className="flex items-center gap-2">
                    <div className={`w-8 h-8 border-2 ${colors.border} ${colors.bg} rounded flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <span className="text-gray-700 font-medium">{phase.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t('calendar.grid')}
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 ${viewMode === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t('calendar.timeline')}
              </button>
              <button
                onClick={() => setViewMode('family')}
                className={`px-4 py-2 ${viewMode === 'family' ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t('calendar.familyTips')}
              </button>
            </div>
          </motion.div>

          {viewMode === 'grid' && (
            <>
              {/* Config row — aligned left, icon-only, low profile */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setShowUpdatePeriod(true)}
                  title={language === 'es' ? 'Actualizar período' : 'Update period'}
                  className="p-2 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-full transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowFertileDays(!showFertileDays)}
                  title={showFertileDays ? t('calendar.hideFertileDays') : t('calendar.showFertileDays')}
                  className={`p-2 rounded-full transition-all ${
                    showFertileDays
                      ? 'text-pink-600 bg-pink-100 hover:bg-pink-200'
                      : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-lg">🤰</span>
                </button>
                <button
                  onClick={() => {
                    SessionManager.clearActiveProfile();
                    SessionManager.clearSession(profileId);
                    router.push('/profile');
                  }}
                  title={language === 'es' ? 'Cambiar perfil' : 'Switch profile'}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="btn-secondary py-2"
                >
                  ← {language === 'es' ? 'Anterior' : 'Previous'}
                </button>
                <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy', { locale })}</h2>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="btn-secondary py-2"
                >
                  {language === 'es' ? 'Siguiente' : 'Next'} →
                </button>
              </div>

              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-bold text-gray-700 py-2 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid - MONTH VIEW */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((date) => {
                  const cycleDay = getCycleDayForDate(date);
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                  const isPeriodStart = cycleDay?.phase.isBleeding && cycleDay.cycleDay === 1;
                  const isOvulationDay = showFertileDays && cycleDay?.phase.isOvulation;
                  const isFertileWindow = showFertileDays && cycleDay?.phase.isFertile;
                  
                  if (!cycleDay || !isCurrentMonth) {
                    return (
                      <div
                        key={date.toString()}
                        className="aspect-square border border-gray-200 bg-gray-50 p-2 flex items-center justify-center"
                      >
                        <span className="text-gray-400 text-sm">{format(date, 'd')}</span>
                      </div>
                    );
                  }

                  const colors = getPhaseColor(cycleDay.phase.name);
                  const Icon = getPhaseIcon(cycleDay.phase.name);

                  return (
                    <motion.button
                      key={date.toString()}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        setSelectedDay(cycleDay);
                        setModalView('details');
                      }}
                      className={`aspect-square border-2 p-2 transition-all hover:shadow-lg relative
                                  ${`${colors.border} ${colors.bg}`}
                                  ${isToday ? 'ring-4 ring-gold ring-offset-2' : ''}
                                  ${isPeriodStart ? 'ring-4 ring-light-burgundy ring-offset-2' : ''}
                                `}
                    >
                      <div className="flex flex-col h-full">
                        {/* Day of month - PROMINENT */}
                        <div className={`text-2xl font-bold mb-1 ${isPeriodStart ? 'text-light-burgundy' : ''}`}>
                          {format(date, 'd')}
                        </div>
                        
                        {/* Icon */}
                        <div className="flex-1 flex items-center justify-center opacity-2">
                          <Icon className={`w-20 h-20 ${colors.icon}`} />
                        </div>
                        
                        {/* Cycle day - SMALL */}
                        <div className={`text-xs mt-1 ${isPeriodStart ? 'text-red-100' : 'text-gray-600'}`}>
                          {language === 'es' ? 'Día' : 'Day'} {cycleDay.cycleDay} {language === 'es' ? 'del ciclo' : 'of the cycle'}
                        </div>
                      </div>

                      {isToday && (
                        <div className="absolute top-1 right-1">
                          <Circle className="w-2 h-2 fill-gold text-gold" />
                        </div>
                      )}

                      {isPeriodStart && (
                        <div className="absolute top-1 inset-x-0 flex justify-left">
                          <span className="text-lg drop-shadow">🩸</span>
                        </div>
                      )}

                      {isOvulationDay && (
                        <div className="absolute inset-0 flex items-start justify-left pb-1 pointer-events-none">
                          <span className="text-xl drop-shadow">🥚</span>
                        </div>
                      )}

                      {isFertileWindow && !isOvulationDay && (
                        <div className="absolute inset-0 flex items-start justify-left pb-1 pointer-events-none">
                          <span className="text-base drop-shadow opacity-80">🤰</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === 'timeline' && (
            <div className="space-y-3">
              {calendar.map((day) => {
                const dayDate = getDayDate(day);
                const isToday = day.cycleDay === currentCycleDay;
                const isPeriodStart = day?.phase.isBleeding && day.cycleDay === 1;
                const colors = getPhaseColor(day.phase.name);
                const Icon = getPhaseIcon(day.phase.name);

                return (
                  <motion.div
                    key={day.cycleDay}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: day.cycleDay * 0.005 }}
                    onClick={() => {
                      setSelectedDay(day);
                      setModalView('details');
                    }}
                    className={`card-hover border-2 ${colors.border} ${colors.bg} p-4 ${
                      isToday ? 'ring-2 ring-gold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 ${colors.border} flex items-center justify-center ${colors.bg}`}>
                        <Icon className={`w-10 h-10 ${colors.icon}`} />
                      </div>

                      <div className="flex-shrink-0 text-center min-w-[100px]">
                        <div className={`text-3xl font-bold ${isPeriodStart ? 'text-light-burgundy' : ''}`}>{format(dayDate, 'd')}</div>
                        <div className="text-sm text-gray-600">
                          {format(dayDate, 'EEEE', { locale })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(dayDate, 'MMM yyyy', { locale })}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {language === 'es' ? 'Día' : 'Day'} {day.cycleDay} {language === 'es' ? 'del ciclo' : 'of cycle'}
                          {day.phase.isBleeding && day.cycleDay === 1 && (
                            <div className="text-xs text-red-600 font-bold mt-1">
                              🩸 {t('calendar.periodStart')}
                            </div>
                          )}
                          {showFertileDays && day.phase.isOvulation && (
                            <div className="text-xs text-purple-600 font-bold mt-1">
                              🥚 {t('calendar.ovulationDay')}
                            </div>
                          )}
                          {showFertileDays && day.phase.isFertile && !day.phase.isOvulation && (
                            <div className="text-xs text-pink-600 mt-1">
                              🤰 {t('calendar.fertileWindow')}
                            </div>
                          )}
                        </div>
                        {isToday && (
                          <div className="text-xs text-gold mt-1 font-bold uppercase">
                            {t('calendar.today')}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>
                          {day.phase.displayName}
                        </h3>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-semibold">{language === 'es' ? 'Energía' : 'Energy'}:</span>{' '}
                            <span className={colors.text}>
                              {typeof day.predictions.physicalEnergy === 'string' 
                                ? day.predictions.physicalEnergy 
                                : 'Medium'}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">{language === 'es' ? 'Estado' : 'Mood'}:</span>{' '}
                            <span className="text-gray-700">
                              {day.predictions.emotionalState.split('.')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {viewMode === 'family' && (
            <div className="max-w-3xl mx-auto">
              <div className="card p-8 mb-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
                <h2 className="text-3xl font-bold mb-4 text-center display-font">
                  {t('calendar.familyTips')}
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  {t('calendar.shareWith')}
                </p>

                {(() => {
                  const currentDay = calendar.find(d => d.cycleDay === currentCycleDay);
                  if (!currentDay) return null;
                  
                  const tips = getFamilyTips(currentDay.phase.name, language);
                  const colors = getPhaseColor(currentDay.phase.name);
                  const Icon = getPhaseIcon(currentDay.phase.name);

                  return (
                    <>
                      <div className="flex items-center justify-center gap-4 mb-8 pb-6 border-b border-pink-300">
                        <div className={`w-20 h-20 rounded-full border-4 ${colors.border} ${colors.bg} flex items-center justify-center`}>
                          <Icon className={`w-12 h-12 ${colors.icon}`} />
                        </div>
                        <div>
                          <h3 className={`text-2xl font-bold ${colors.text}`}>
                            {currentDay.phase.displayName}
                          </h3>
                          <p className="text-gray-600">
                            {language === 'es' ? 'Día' : 'Day'} {currentCycleDay} {language === 'es' ? 'del ciclo' : 'of cycle'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6 mb-8">
                        {tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card p-6 border-l-4 border-gold bg-white hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-5xl flex-shrink-0">{tip.icon}</div>
                              <div className="flex-1">
                                <h4 className="text-xl font-bold mb-2 text-charcoal">
                                  {tip.title}
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {tip.tip}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => handleCopyTips(tips)}
                          className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {t('calendar.copyTips')}
                        </button>
                        
                        {showCopiedTooltip && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
                          >
                            ✓ {t('calendar.tipsCopied')}
                          </motion.div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="disclaimer text-xs">
                <p>
                  {language === 'es' 
                    ? 'Estos tips son orientativos basados en patrones hormonales promedio. Cada persona es única y puede experimentar variaciones.'
                    : 'These tips are guidelines based on average hormonal patterns. Each person is unique and may experience variations.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Update Period Modal */}
      <AnimatePresence>
        {showUpdatePeriod && (
          <div className="fixed inset-0 z-50">
            <div
              className="modal-overlay"
              onClick={() => setShowUpdatePeriod(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="modal-content max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl mb-4">
                  {language === 'es' ? 'Actualizar Fecha de Período' : 'Update Period Date'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {language === 'es' 
                    ? 'Selecciona la nueva fecha en la que comenzó tu período:'
                    : 'Select the new date when your period started:'}
                </p>
                <input
                  type="date"
                  value={newPeriodDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewPeriodDate(e.target.value)}
                  className="w-full mb-6"
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowUpdatePeriod(false)}
                    className="btn-secondary flex-1"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleUpdatePeriod}
                    disabled={!newPeriodDate}
                    className="btn-primary flex-1"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Day Detail Modal with integrated Log */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50">
            <div
              className="modal-overlay"
              onClick={() => {
                setSelectedDay(null);
                setModalView('details');
              }}
            />

            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="modal-content max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSelectedDay(null);
                    setModalView('details');
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {modalView === 'log' && (
                  <button
                    onClick={() => setModalView('details')}
                    className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {(() => {
                  const colors = getPhaseColor(selectedDay.phase.name);
                  const Icon = getPhaseIcon(selectedDay.phase.name);
                  
                  return (
                    <>
                      {modalView === 'details' && (
                        <>
                          <div className="mb-8">
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-16 h-16 rounded-lg border-2 ${colors.border} ${colors.bg} flex items-center justify-center`}>
                                <Icon className={`w-10 h-10 ${colors.icon}`} />
                              </div>
                              <div>
                                <h2 className="text-4xl font-bold">
                                  {format(getDayDate(selectedDay), 'd MMMM', { locale })}
                                </h2>
                                <p className={`text-lg font-semibold ${colors.text}`}>
                                  {selectedDay.phase.displayName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {language === 'es' ? 'Día' : 'Day'} {selectedDay.cycleDay} {language === 'es' ? 'del ciclo' : 'of cycle'}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-600">
                              {format(getDayDate(selectedDay), 'EEEE, d MMMM yyyy', { locale })}
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Radar Chart - IMPROVED */}
                            <div className="card p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
                              <h3 className="text-xl font-bold mb-6 text-center">{t('calendar.yourEnergyMapToday')}</h3>
                              <ResponsiveContainer width="100%" height={320}>
                                <RadarChart 
                                  data={[
                                    { 
                                      metric: language === 'es' ? 'Física' : 'Physical', 
                                      value: getEnergyValue(selectedDay.predictions.physicalEnergy)
                                    },
                                    { 
                                      metric: language === 'es' ? 'Social' : 'Social', 
                                      value: getEnergyValue(selectedDay.predictions.socialEnergy)
                                    },
                                    { 
                                      metric: language === 'es' ? 'Mental' : 'Mental', 
                                      value: 7
                                    },
                                    { 
                                      metric: 'Libido', 
                                      value: getEnergyValue(selectedDay.predictions.libido)
                                    },
                                  ]}
                                  margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                                >
                                  <PolarGrid stroke="#d1d5db" strokeWidth={1} />
                                  <PolarAngleAxis 
                                    dataKey="metric" 
                                    tick={{ fill: '#374151', fontSize: 13, fontWeight: 700 }}
                                  />
                                  <PolarRadiusAxis 
                                    angle={90} 
                                    domain={[0, 10]} 
                                    tick={{ fill: '#6b7280', fontSize: 10 }}
                                    tickCount={6}
                                    axisLine={{ stroke: '#9ca3af' }}
                                  />
                                  <Radar 
                                    dataKey="value" 
                                    stroke="#B8985F" 
                                    fill="#B8985F" 
                                    fillOpacity={0.4}
                                    strokeWidth={2.5}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                              <div className="text-center text-xs text-gray-500 mt-2">
                                {language === 'es' ? 'Escala 0-10 (0=muy bajo, 10=muy alto)' : 'Scale 0-10 (0=very low, 10=very high)'}
                              </div>
                            </div>

                            {/* Details Cards */}
                            <div className="space-y-4">
                              <div className="card p-5 border-l-4 border-blue-400 bg-blue-50">
                                <div className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                  <Circle className="w-3 h-3 fill-blue-500" />
                                  {t('calendar.emotionalState')}
                                </div>
                                <div className="text-gray-800 text-sm leading-relaxed">
                                  {selectedDay.predictions.emotionalState}
                                </div>
                              </div>
                              
                              <div className="card p-5 border-l-4 border-purple-400 bg-purple-50">
                                <div className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                  <Circle className="w-3 h-3 fill-purple-500" />
                                  {t('calendar.cognition')}
                                </div>
                                <div className="text-gray-800 text-sm leading-relaxed">
                                  {selectedDay.predictions.cognition}
                                </div>
                              </div>

                              <div className="card p-5 border-l-4 border-pink-400 bg-pink-50">
                                <div className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                                  <Circle className="w-3 h-3 fill-pink-500" />
                                  {t('calendar.selfPerception')}
                                </div>
                                <div className="text-gray-800 text-sm leading-relaxed">
                                  {selectedDay.predictions.selfPerception}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Training */}
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                              <span className="text-gold">●</span>
                              {t('calendar.training')}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="card p-5 border-l-4 border-green-500 bg-green-50">
                                <div className="font-bold text-green-800 mb-3">
                                  {t('calendar.ifHighEnergy')}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {selectedDay.predictions.training.highEnergy}
                                </p>
                              </div>
                              <div className="card p-5 border-l-4 border-yellow-500 bg-yellow-50">
                                <div className="font-bold text-yellow-800 mb-3">
                                  {t('calendar.ifLowEnergy')}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {selectedDay.predictions.training.lowEnergy}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Work */}
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                              <span className="text-gold">●</span>
                              {t('calendar.work')}
                            </h3>
                            <div className="card p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
                              <div className="font-bold text-blue-900 mb-3 text-lg">
                                {t('calendar.idealFor')}
                              </div>
                              <ul className="space-y-2">
                                {selectedDay.predictions.work.ideal.map((item, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
                                    <Circle className="w-2 h-2 fill-blue-500 mt-1.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Relationships */}
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                              <span className="text-gold">●</span>
                              {t('calendar.relationships')}
                            </h3>
                            <div className="card p-6 bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200">
                              <div className="space-y-4">
                                <div>
                                  <div className="font-bold text-pink-900 mb-2">
                                    {t('calendar.youMightNeed')}
                                  </div>
                                  <p className="text-sm text-gray-800">
                                    {selectedDay.predictions.relationships.needs}
                                  </p>
                                </div>
                                <div>
                                  <div className="font-bold text-pink-900 mb-2">
                                    {t('calendar.communicationStyle')}
                                  </div>
                                  <p className="text-sm text-gray-800">
                                    {selectedDay.predictions.relationships.communication}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Risks */}
                          {selectedDay.predictions.risks.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-gold">●</span>
                                {t('calendar.beAwareOf')}
                              </h3>
                              <div className="card p-6 bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-300">
                                <ul className="space-y-2">
                                  {selectedDay.predictions.risks.map((risk, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
                                      <span className="text-yellow-600 text-lg flex-shrink-0">⚠</span>
                                      <span>{risk}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          <div className="disclaimer text-xs mb-6">
                            <p>{t('calendar.disclaimer')}</p>
                          </div>

                          <button
                            onClick={() => setModalView('log')}
                            className="btn-primary w-full text-lg py-4"
                          >
                            {t('calendar.logDay')}
                          </button>
                        </>
                      )}

                      {modalView === 'log' && (
                        <div className="space-y-6">
                          <h2 className="text-3xl font-bold mb-6 mt-6">{t('logging.title')}</h2>

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

                          <div className="flex gap-4 mt-8">
                            <button
                              onClick={() => setModalView('details')}
                              className="btn-secondary flex-1"
                            >
                              {t('common.cancel')}
                            </button>
                            <button
                              onClick={handleSaveLog}
                              className="btn-primary flex-1"
                            >
                              {t('logging.save')}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
