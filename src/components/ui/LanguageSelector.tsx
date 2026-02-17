'use client';

import { useLanguage } from '../LanguageProvider';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white border border-soft-gray px-3 py-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <button
        onClick={() => setLanguage('es')}
        className={`text-sm px-2 py-1 transition-colors ${
          language === 'es'
            ? 'text-gold font-medium'
            : 'text-gray-600 hover:text-charcoal'
        }`}
      >
        ES
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setLanguage('en')}
        className={`text-sm px-2 py-1 transition-colors ${
          language === 'en'
            ? 'text-gold font-medium'
            : 'text-gray-600 hover:text-charcoal'
        }`}
      >
        EN
      </button>
    </div>
  );
}
