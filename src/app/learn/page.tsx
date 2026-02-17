'use client';

import { motion } from 'framer-motion';
import Header from '@/components/ui/Header';
import { BookOpen, TrendingUp, Brain, Activity } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header currentPage="/learn" />

      <main className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl mb-6">Theoretical Foundation</h1>
            <p className="text-xl text-gray-600 mb-12">
              Understanding the science behind cycle-based guidance
            </p>

            {/* Relative Day Concept */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-gold" />
                <h2 className="text-3xl">The Relative Day System</h2>
              </div>

              <div className="card mb-6">
                <p className="mb-4">
                  PHASED uses a "relative to ovulation" approach (O-14 to O+13) instead of fixed calendar days.
                  This allows the system to provide accurate guidance regardless of your cycle length.
                </p>

                <div className="bg-soft-gray p-6 mb-4">
                  <h3 className="font-semibold mb-3">How it works:</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Ovulation Day (O)</strong> = Cycle Length − 14</li>
                    <li><strong>Relative Day</strong> = Current Day − Ovulation Day</li>
                    <li>Example: 30-day cycle → O = Day 16</li>
                    <li>Day 10 = O-6 (6 days before ovulation)</li>
                    <li>Day 20 = O+4 (4 days after ovulation)</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600">
                  This approach is based on the physiological fact that the luteal phase (post-ovulation)
                  is relatively stable at ~14 days, while the follicular phase varies between individuals.
                </p>
              </div>
            </section>

            {/* Phases */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-8 h-8 text-gold" />
                <h2 className="text-3xl">The Seven Phases</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    range: 'O-14 to O-10',
                    name: 'Menstrual / Early Follicular',
                    hormones: 'Low estrogen & progesterone',
                    characteristics: 'Lower energy, introspection, need for rest'
                  },
                  {
                    range: 'O-9 to O-6',
                    name: 'Mid Follicular',
                    hormones: 'Rising estrogen',
                    characteristics: 'Increasing energy, optimism, clarity'
                  },
                  {
                    range: 'O-5 to O-3',
                    name: 'High Follicular',
                    hormones: 'High estrogen',
                    characteristics: 'Peak energy, confidence, high performance window'
                  },
                  {
                    range: 'O-2 to O+1',
                    name: 'Ovulatory Window',
                    hormones: 'Estrogen peak + ovulation',
                    characteristics: 'Very high social energy, magnetic, peak libido'
                  },
                  {
                    range: 'O+2 to O+7',
                    name: 'Early Luteal',
                    hormones: 'Progesterone dominant',
                    characteristics: 'Stable energy, pragmatic, execution-focused'
                  },
                  {
                    range: 'O+8 to O+10',
                    name: 'Mid Luteal',
                    hormones: 'High progesterone',
                    characteristics: 'Energy decline, increased sensitivity'
                  },
                  {
                    range: 'O+11 to O+13',
                    name: 'Late Luteal / Premenstrual',
                    hormones: 'Hormonal withdrawal',
                    characteristics: 'Lower energy, emotional variability, need for space'
                  }
                ].map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl">{phase.name}</h3>
                      <span className="phase-badge">{phase.range}</span>
                    </div>
                    <div className="text-sm space-y-2 text-gray-700">
                      <p><strong>Hormones:</strong> {phase.hormones}</p>
                      <p><strong>Typical experience:</strong> {phase.characteristics}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Dimensions */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-gold" />
                <h2 className="text-3xl">What We Track</h2>
              </div>

              <div className="card">
                <p className="mb-6">
                  PHASED provides guidance across six key dimensions that are influenced by
                  hormonal fluctuations:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Energy',
                      description: 'Physical and social energy levels vary predictably across the cycle'
                    },
                    {
                      title: 'Mood & Emotions',
                      description: 'Emotional baseline, stress tolerance, and mood stability'
                    },
                    {
                      title: 'Cognition',
                      description: 'Mental clarity, focus, creativity, and multitasking ability'
                    },
                    {
                      title: 'Training Response',
                      description: 'Strength, endurance, recovery capacity, and injury risk'
                    },
                    {
                      title: 'Work Capacity',
                      description: 'Optimal tasks for each phase (strategic vs. execution vs. rest)'
                    },
                    {
                      title: 'Relationships',
                      description: 'Social needs, communication style, and intimacy patterns'
                    }
                  ].map((dimension, i) => (
                    <div key={i}>
                      <h4 className="font-semibold mb-2">{dimension.title}</h4>
                      <p className="text-sm text-gray-600">{dimension.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Sources */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-gold" />
                <h2 className="text-3xl">Scientific Foundation</h2>
              </div>

              <div className="card">
                <p className="mb-6">
                  Our recommendations are based on peer-reviewed research studying hormonal effects
                  on physiology, cognition, and behavior. Key areas include:
                </p>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <div>
                      <strong>Endocrinology:</strong> How estrogen and progesterone affect neurotransmitters,
                      metabolism, and physical systems
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <div>
                      <strong>Sports Science:</strong> Research on training adaptation, strength gains,
                      and injury risk across cycle phases
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <div>
                      <strong>Neuroscience:</strong> Studies on cognitive performance, mood regulation,
                      and stress response
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <div>
                      <strong>Behavioral Science:</strong> Research on social behavior, risk-taking,
                      and decision-making patterns
                    </div>
                  </li>
                </ul>

                <div className="divider my-6"></div>

                <p className="text-xs text-gray-600 italic">
                  Note: While based on research averages, individual experience varies significantly.
                  PHASED encourages you to track your actual patterns to personalize recommendations.
                </p>
              </div>
            </section>

            {/* Limitations */}
            <section className="mb-16">
              <h2 className="text-3xl mb-6">Important Limitations</h2>

              <div className="disclaimer">
                <h3 className="text-lg font-semibold mb-4 not-italic">What This App Cannot Do</h3>
                
                <div className="space-y-3">
                  <p>
                    <strong>Not a medical device:</strong> PHASED does not diagnose or treat any medical condition.
                  </p>
                  <p>
                    <strong>Not contraception:</strong> This app should never be used as a primary method of
                    contraception or fertility planning without professional guidance.
                  </p>
                  <p>
                    <strong>Not a substitute for medical care:</strong> If you experience severe symptoms
                    (extreme pain, very heavy bleeding, severe mood changes, or symptoms that significantly
                    impact your life), consult a healthcare provider.
                  </p>
                  <p>
                    <strong>Individual variation:</strong> The predictions use probabilistic language
                    ("many people experience...") because not everyone follows the average pattern.
                  </p>
                </div>

                <div className="divider my-6"></div>

                <h3 className="text-lg font-semibold mb-3 not-italic">When to Seek Medical Help</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Severe menstrual pain that interferes with daily activities</li>
                  <li>• Very heavy bleeding (soaking through protection in 1-2 hours)</li>
                  <li>• Severe mood changes or suicidal thoughts (possible PMDD)</li>
                  <li>• Cycles shorter than 21 days or longer than 35 days consistently</li>
                  <li>• Complete absence of periods (amenorrhea) when not pregnant</li>
                  <li>• Any symptom that concerns you or affects your quality of life</li>
                </ul>
              </div>
            </section>

            {/* Personalization */}
            <section>
              <h2 className="text-3xl mb-6">How PHASED Personalizes</h2>

              <div className="card">
                <p className="mb-4">
                  Your calendar isn't just based on research averages. PHASED adjusts recommendations using:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Profile Attributes</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• PMS intensity → Adjusts caution in late luteal phase</li>
                      <li>• Training preference → Customizes workout recommendations</li>
                      <li>• Heat sensitivity → Adds hydration reminders in luteal phase</li>
                      <li>• Symptoms → Highlights relevant risk periods</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Daily Logs (Adaptive Learning)</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Poor sleep → Reduces intensity recommendations for 24-48h</li>
                      <li>• High stress → Suggests recovery over performance</li>
                      <li>• Unexpected energy → Offers higher-intensity options</li>
                      <li>• Pattern recognition → Identifies your unique cycle signature</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
