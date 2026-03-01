'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Brain, Heart } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import Header from '@/components/ui/Header';

export default function InsightsPage() {
  const { language } = useLanguage();

  const features = [
    {
      icon: <TrendingUp className="w-12 h-12" />,
      titleEs: 'Patrones personalizados',
      titleEn: 'Personal patterns',
      descEs: 'Descubre tus tendencias únicas basadas en tus datos reales',
      descEn: 'Discover your unique trends based on your real data'
    },
    {
      icon: <Brain className="w-12 h-12" />,
      titleEs: 'Análisis predictivo',
      titleEn: 'Predictive analysis',
      descEs: 'Anticipate cómo te sentirás en los próximos días',
      descEn: 'Anticipate how you\'ll feel in the coming days'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      titleEs: 'Correlaciones inteligentes',
      titleEn: 'Smart correlations',
      descEs: 'Conecta síntomas, energía y patrones que no sabías que existían',
      descEn: 'Connect symptoms, energy and patterns you didn\'t know existed'
    }
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Header currentPage="/insights" />

      <main className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-24 h-24 text-gold mx-auto" />
            </motion.div>

            <h1 className="text-6xl md:text-7xl mb-6 display-font">
              {language === 'es' ? 'Próximamente' : 'Coming Soon'}
            </h1>
            
            <div className="divider mx-auto mb-8"></div>

            <p className="text-2xl text-gray-600 mb-4 font-light">
              {language === 'es' 
                ? 'Estamos trabajando en algo increíble'
                : 'We\'re working on something amazing'}
            </p>

            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              {language === 'es'
                ? 'Insights personalizados que van a cambiar la forma en que entiendes tu ciclo. Vas a flipar cuando veas lo que estamos preparando.'
                : 'Personalized insights that will change how you understand your cycle. You\'re going to love what we\'re preparing.'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="card-hover text-center"
              >
                <div className="text-gold mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-3 font-semibold">
                  {language === 'es' ? feature.titleEs : feature.titleEn}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'es' ? feature.descEs : feature.descEn}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="card p-8 bg-gradient-to-br from-gold/10 to-cream border-2 border-gold/30 text-center"
          >
            <p className="text-lg text-gray-700">
              {language === 'es'
                ? '💡 Mientras tanto, sigue registrando tus datos. Cuantos más tengas, más precisos serán tus insights personalizados.'
                : '💡 Meanwhile, keep logging your data. The more you have, the more accurate your personalized insights will be.'}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}