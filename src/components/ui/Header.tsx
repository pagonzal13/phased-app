'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, User, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { useLanguage } from '../LanguageProvider';
import LanguageSelector from './LanguageSelector';
import { SessionManager } from '@/lib/security';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();

  type NavItem = {
    label: string;
    path: string;
    icon: JSX.Element;
    isSmartRoute?: boolean;
  };

  const navItems: NavItem[] = [
    { label: t('nav.home'), path: '/', icon: <Home className="w-4 h-4" /> },
    { label: t('nav.profiles'), path: '/profile', icon: <User className="w-4 h-4" /> },
    { label: t('nav.calendar'), path: '/calendar', icon: <Calendar className="w-4 h-4" />, isSmartRoute: true },    { label: t('nav.insights'), path: '/insights', icon: <TrendingUp className="w-4 h-4" /> },
    { label: t('nav.learn'), path: '/learn', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-soft-gray sticky top-0 z-30 backdrop-blur-sm bg-white/95"
    >
      <nav className="container-width py-6 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="text-2xl display-font font-light"
        >
          PHASED
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                if (item.isSmartRoute) {
                  const activeProfileId = SessionManager.getActiveProfile();
                  if (activeProfileId && SessionManager.isSessionValid(activeProfileId)) {
                    router.push(`/calendar/${activeProfileId}`);
                  } else {
                    router.push('/profile');
                  }
                } else {
                  router.push(item.path);
                }
              }}
              className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors ${
                currentPage === item.path
                  ? 'text-gold'
                  : 'text-charcoal hover:text-gold'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <LanguageSelector />
      </nav>
    </motion.header>
  );
}
