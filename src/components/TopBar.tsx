import React from 'react';
import { motion } from 'motion/react';
import { Language, ViewState } from '../types';
import { MapPin, User, Sprout } from 'lucide-react';
import { t } from '../translations';

interface TopBarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  location: string;
  setCurrentView?: (view: ViewState) => void;
}

export function TopBar({ language, setLanguage, location, setCurrentView }: TopBarProps) {
  const languages: Language[] = ['English', 'Hindi', 'Telugu'];

  return (
    <header className="h-16 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9, rotate: -10 }}
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 5 
            }}
            className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center relative overflow-hidden"
          >
            <Sprout className="w-5 h-5 text-white relative z-10" />
            <motion.div 
              className="absolute inset-0 bg-white/30"
              animate={{ y: ["100%", "-100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden md:inline">{t(language, 'app.language')}:</span>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-sm md:text-xs font-bold px-2 py-1 transition-colors ${
                language === lang 
                  ? 'text-emerald-700 border-b-2 border-emerald-600' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500">{t(language, 'app.region')}</span>
          <span className="text-xs font-bold text-slate-700">{location || t(language, 'app.notSet')}</span>
        </div>
        <button 
          onClick={() => setCurrentView?.('settings')}
          className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 transition-colors shadow-sm"
          title={t(language, 'sidebar.settings')}
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
