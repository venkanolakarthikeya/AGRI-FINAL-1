import React from 'react';
import { ViewState, Language } from '../types';
import { LayoutDashboard, TestTube, Sprout, CloudSun, Bot, Settings, LifeBuoy, Plus } from 'lucide-react';
import { t } from '../translations';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  language: Language;
}

export function Sidebar({ currentView, setCurrentView, language }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: t(language, 'app.dashboard'), icon: LayoutDashboard },
    { id: 'soil', label: t(language, 'app.soilAnalysis'), icon: TestTube },
    { id: 'recommendations', label: t(language, 'app.recommendations'), icon: Sprout },
    { id: 'weather', label: t(language, 'app.weather'), icon: CloudSun },
    { id: 'chatbot', label: t(language, 'app.chatbot'), icon: Bot },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col hidden md:flex shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          {t(language, 'app.title')} <span className="text-emerald-600">AI</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-11">{t(language, 'app.subtitle')}</p>
      </div>

      <div className="px-4 pb-6">
        <button 
          onClick={() => setCurrentView('soil')}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          {t(language, 'app.newSoilTest')}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors font-medium ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 pl-3' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <button 
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
            currentView === 'settings' 
              ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 pl-3' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <Settings className={`w-5 h-5 ${currentView === 'settings' ? 'text-emerald-600' : 'text-slate-400'}`} />
          {t(language, 'app.settings')}
        </button>
      </div>
    </aside>
  );
}
