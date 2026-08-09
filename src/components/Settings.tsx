import React from 'react';
import { ViewState, Language, SoilData } from '../types';
import { Globe, MapPin, Leaf, Shield, Bell, ChevronRight } from 'lucide-react';
import { t } from '../translations';
import { LocationAutocomplete } from './LocationAutocomplete';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  location: string;
  setLocation: (loc: string) => void;
}

export function Settings({ language, setLanguage, location, setLocation }: SettingsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{t(language, 'settings.title')}</h2>
        <p className="text-slate-500 mt-2">{t(language, 'settings.desc')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col space-y-4">
          <div className="flex items-center gap-3 text-slate-800 font-semibold mb-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            {t(language, 'settings.general')}
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.language')}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 appearance-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.defaultLoc')}</label>
            <LocationAutocomplete 
              location={location} 
              setLocation={setLocation} 
              placeholder={t(language, 'app.notSet')} 
            />
            <p className="text-xs text-slate-400 mt-1">This location is used for weather forecasts.</p>
          </div>
        </div>

        {/* Notifications & Privacy */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col space-y-4">
          <div className="flex items-center gap-3 text-slate-800 font-semibold mb-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            {t(language, 'settings.notifications')}
          </div>

          <button className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Bell className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-sm">{t(language, 'settings.push')}</p>
                <p className="text-xs text-slate-500">{t(language, 'settings.pushDesc')}</p>
              </div>
            </div>
            <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
            </div>
          </button>

          <button className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Shield className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-sm">{t(language, 'settings.privacy')}</p>
                <p className="text-xs text-slate-500">{t(language, 'settings.privacyDesc')}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
