'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Lock, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import Header from '@/components/ui/Header';
import PasswordModal from '@/components/ui/PasswordModal';
import { ProfileService } from '@/lib/profileService';
import { SessionManager } from '@/lib/security';
import { CycleEngine } from '@/lib/cycleEngine';
import { useLanguage } from '@/components/LanguageProvider';

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [actionType, setActionType] = useState<'unlock' | 'edit' | 'delete'>('unlock');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const allProfiles = ProfileService.getAllProfiles();
    setProfiles(allProfiles);
  };

  const handleProfileAction = (profileId: string, action: 'unlock' | 'edit' | 'delete') => {
    setSelectedProfile(profileId);
    setActionType(action);
    setShowPasswordModal(true);
    setPasswordError('');
  };

  const handlePasswordSubmit = (password: string) => {
    if (!selectedProfile) return;

    const profile = ProfileService.unlockProfile(selectedProfile, password);
    
    if (!profile) {
      setPasswordError(t('password.incorrectPassword'));
      return;
    }

    SessionManager.createSession(selectedProfile);
    setShowPasswordModal(false);

    if (actionType === 'unlock') {
      router.push(`/calendar/${selectedProfile}`);
    } else if (actionType === 'edit') {
      router.push(`/profile/edit/${selectedProfile}`);
    } else if (actionType === 'delete') {
      if (confirm(t('profile.confirmDelete'))) {
        ProfileService.deleteProfile(selectedProfile);
        loadProfiles();
      }
    }
  };

  const getNextPeriodInfo = (profile: any) => {
    const nextDate = CycleEngine.getNextPeriodDate(
      new Date(profile.lastPeriodDate),
      profile.cycleLength
    );
    const today = new Date();
    const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      date: nextDate,
      daysUntil: Math.max(0, daysUntil)
    };
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header currentPage="/profile" />

      <main className="section-padding">
        <div className="container-width max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl mb-4">{t('profile.title')}</h1>
            <p className="text-gray-600 mb-12">{t('profile.subtitle')}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Create New Profile Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/profile/create')}
                className="card-hover text-left h-full min-h-[200px] flex flex-col items-center justify-center"
              >
                <Plus className="w-12 h-12 text-gold mb-4" />
                <h3 className="text-2xl mb-2">{t('profile.createNew')}</h3>
                <p className="text-gray-600 text-sm">{t('profile.createNewDesc')}</p>
              </motion.button>

              {/* Existing Profiles */}
              {profiles.map((profile, index) => {
                const nextPeriod = getNextPeriodInfo(profile);
                
                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-hover relative"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl mb-1">{profile.name}</h3>
                        <p className="text-sm text-gray-500">
                          {profile.cycleLength} {t('profile.dayCycle')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileAction(profile.id, 'delete');
                        }}
                        className="p-2 hover:bg-red-50 transition-colors rounded"
                        title={t('profile.delete')}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {t('profile.nextPeriod')} {nextPeriod.daysUntil} {t('profile.days')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t('profile.lastUpdated')}: {new Date(profile.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleProfileAction(profile.id, 'unlock')}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {t('profile.unlock')}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {profiles.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                <p className="mb-4">{t('profile.noProfiles')}</p>
                <p className="text-sm">{t('profile.createFirst')}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordError('');
        }}
        onSubmit={handlePasswordSubmit}
        title={
          actionType === 'delete'
            ? t('password.confirmDeletion')
            : actionType === 'edit'
            ? t('password.editProfile')
            : t('password.enterPassword')
        }
        subtitle={
          actionType === 'delete'
            ? t('password.confirmDeletionDesc')
            : actionType === 'edit'
            ? t('password.editProfileDesc')
            : t('password.profileProtected')
        }
        error={passwordError}
      />
    </div>
  );
}
