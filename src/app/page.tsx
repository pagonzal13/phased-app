'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Calendar, Brain, TrendingUp, Heart, Shield, Download } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import Header from '@/components/ui/Header';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      titleKey: 'landing.feature1Title',
      descKey: 'landing.feature1Desc'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      titleKey: 'landing.feature2Title',
      descKey: 'landing.feature2Desc'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      titleKey: 'landing.feature3Title',
      descKey: 'landing.feature3Desc'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      titleKey: 'landing.feature4Title',
      descKey: 'landing.feature4Desc'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      titleKey: 'landing.feature5Title',
      descKey: 'landing.feature5Desc'
    },
    {
      icon: <Download className="w-8 h-8" />,
      titleKey: 'landing.feature6Title',
      descKey: 'landing.feature6Desc'
    }
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Header currentPage="/" />  {}
      {/* Hero Section */}
      <section className="section-padding gradient-radial">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-7xl md:text-8xl mb-6 display-font font-light">
              {t('landing.title')}
            </h1>
            <div className="divider mx-auto"></div>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light leading-relaxed">
              {t('landing.subtitle')}
              <br />
              {t('landing.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/profile/create')}
                className="btn-primary"
              >
                {t('landing.createProfile')}
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="btn-secondary"
              >
                {t('landing.unlockCalendar')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl text-center mb-16">
              {t('landing.howItWorks')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-6xl display-font text-gold mb-4">01</div>
                <h3 className="text-2xl mb-4">{t('landing.step1Title')}</h3>
                <p className="text-gray-600">{t('landing.step1Desc')}</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl display-font text-gold mb-4">02</div>
                <h3 className="text-2xl mb-4">{t('landing.step2Title')}</h3>
                <p className="text-gray-600">{t('landing.step2Desc')}</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl display-font text-gold mb-4">03</div>
                <h3 className="text-2xl mb-4">{t('landing.step3Title')}</h3>
                <p className="text-gray-600">{t('landing.step3Desc')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding">
        <div className="container-width">
          <h2 className="text-4xl md:text-5xl text-center mb-16">
            {t('landing.whyPhased')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover"
              >
                <div className="text-gold mb-4">{feature.icon}</div>
                <h3 className="text-xl mb-3">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding bg-white">
        <div className="container-width max-w-4xl">
          <div className="disclaimer">
            <h3 className="text-lg font-semibold mb-3 not-italic">
              {t('landing.disclaimer')}
            </h3>
            <p className="mb-3">{t('landing.disclaimerText1')}</p>
            <p className="mb-3">{t('landing.disclaimerText2')}</p>
            <p>{t('landing.disclaimerText3')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding border-t border-soft-gray">
        <div className="container-width">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h4 className="text-xl mb-4">{t('landing.title')}</h4>
              <p className="text-gray-600 text-sm">
                {t('landing.footerAbout')}
              </p>
            </div>
            
            <div>
              <h4 className="text-xl mb-4">{t('landing.footerPrivacy')}</h4>
              <p className="text-gray-600 text-sm">
                {t('landing.footerPrivacyText')}
              </p>
            </div>
            
            <div>
              <h4 className="text-xl mb-4">{t('landing.footerSources')}</h4>
              <p className="text-gray-600 text-sm">
                <button
                  onClick={() => router.push('/learn')}
                  className="btn-minimal text-sm"
                >
                  {t('landing.footerSourcesLink')}
                </button>
              </p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 PHASED. {t('landing.disclaimer')}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
