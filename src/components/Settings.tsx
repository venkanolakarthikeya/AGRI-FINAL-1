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

        {/* Profile Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col space-y-4">
          <div className="flex items-center gap-3 text-slate-800 font-semibold mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              U
            </div>
            {t(language, 'settings.profile') || "Profile Details"}
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.name') || "Name"}</label>
            <input 
              type="text" 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700" 
              placeholder="Your name" 
              defaultValue="Farmer"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.email') || "Email"}</label>
            <input 
              type="email" 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700" 
              placeholder="Your email" 
              defaultValue="farmer@example.com"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.phone') || "Phone Number"}</label>
            <input 
              type="tel" 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700" 
              placeholder="Your phone number" 
              defaultValue="+91 9876543210"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
