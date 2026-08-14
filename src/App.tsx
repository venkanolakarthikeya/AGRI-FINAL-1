/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [clickedMobileItem, setClickedMobileItem] = useState<string | null>(null);

  const handleMobileNavClick = (id: ViewState) => {
    setClickedMobileItem(id);
    setCurrentView(id);
    setTimeout(() => setClickedMobileItem(null), 600);
  };

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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <FloatingChatbot language={language} soilContext={soilData} />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around p-3 z-50">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const isClicked = clickedMobileItem === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMobileNavClick(item.id as ViewState)}
              className={`p-2 rounded-xl transition-all relative ${isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {/* Active Indicator Background */}
              {isActive && (
                <motion.div 
                  layoutId="mobileNavIndicator"
                  className="absolute inset-0 bg-emerald-50 rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon Animation */}
              <motion.div
                animate={
                  isClicked ? { 
                    rotate: [0, -15, 15, -15, 0],
                    scale: [1, 1.3, 1],
                  } : { 
                    rotate: 0, 
                    scale: isActive ? 1.1 : 1 
                  }
                }
                transition={{ duration: 0.5 }}
              >
                <item.icon className="w-6 h-6 relative z-10" />
              </motion.div>
              
              {/* Ripple Effect */}
              <AnimatePresence>
                {isClicked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-emerald-400/30 rounded-full z-0 pointer-events-none origin-center"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
