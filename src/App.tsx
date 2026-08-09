/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { SoilForm } from './components/SoilForm';
import { Recommendations } from './components/Recommendations';
import { Weather } from './components/Weather';
import { Chatbot } from './components/Chatbot';
import { Settings } from './components/Settings';
import { FloatingChatbot } from './components/FloatingChatbot';
import { ViewState, Language, SoilData, Recommendation } from './types';
import { LayoutDashboard, TestTube, Sprout, CloudSun, Bot } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [language, setLanguage] = useState<Language>('English');
  const [soilData, setSoilData] = useState<SoilData>({
    n: '', p: '', k: '', temperature: '', humidity: '', rainfall: '', ph: '', location: '', season: ''
  });
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard setCurrentView={setCurrentView} recommendations={recommendations} language={language} soilContext={soilData} />;
      case 'soil': return <SoilForm soilData={soilData} setSoilData={setSoilData} setRecommendations={setRecommendations} setCurrentView={setCurrentView} setIsLoading={setIsLoadingRecs} isLoading={isLoadingRecs} language={language} />;
      case 'recommendations': return <Recommendations recommendations={recommendations} isLoading={isLoadingRecs} language={language} soilContext={soilData} setCurrentView={setCurrentView} />;
      case 'weather': return <Weather location={soilData.location || 'New Delhi'} language={language} />;
      case 'chatbot': return <Chatbot language={language} soilContext={soilData} />;
      case 'settings': return <Settings language={language} setLanguage={setLanguage} location={soilData.location} setLocation={(loc) => setSoilData({ ...soilData, location: loc })} />;
      default: return <Dashboard setCurrentView={setCurrentView} recommendations={recommendations} language={language} soilContext={soilData} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'soil', icon: TestTube },
    { id: 'recommendations', icon: Sprout },
    { id: 'weather', icon: CloudSun },
    { id: 'chatbot', icon: Bot },
  ] as const;

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} language={language} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar language={language} setLanguage={setLanguage} location={soilData.location} setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            {renderView()}
          </div>
        </main>
      </div>

      <FloatingChatbot language={language} soilContext={soilData} />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around p-3 z-50">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewState)}
              className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
