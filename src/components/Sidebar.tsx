import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewState, Language } from '../types';
import { LayoutDashboard, TestTube, Sprout, CloudSun, Bot, Settings, Plus } from 'lucide-react';
import { t } from '../translations';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  language: Language;
}

export function Sidebar({ currentView, setCurrentView, language }: SidebarProps) {
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleNavClick = (id: ViewState) => {
    setClickedItem(id);
    setCurrentView(id);
    setTimeout(() => setClickedItem(null), 600); // Reset after animation
  };

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
        <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-3 group cursor-default">
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
          {t(language, 'app.title')} <span className="text-emerald-600">AI</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-11">{t(language, 'app.subtitle')}</p>
      </div>

      <div className="px-4 pb-6">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavClick('soil')}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors shadow-md relative overflow-hidden group"
        >
          <motion.div
            animate={clickedItem === 'soil' ? { rotate: 180, scale: 1.2 } : { rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Plus className="w-5 h-5" />
          </motion.div>
          {t(language, 'app.newSoilTest')}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </motion.button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const isClicked = clickedItem === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-medium relative overflow-hidden ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 pl-3' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <motion.div
                animate={
                  isClicked ? { 
                    rotate: [0, -15, 15, -15, 0],
                    scale: [1, 1.3, 1],
                    color: '#10b981' // emerald-500
                  } : { 
                    rotate: 0, 
                    scale: 1 
                  }
                }
                transition={{ duration: 0.5 }}
                className={isActive ? 'text-emerald-600' : 'text-slate-400'}
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              {item.label}
              
              <AnimatePresence>
                {isClicked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-12 h-12 bg-emerald-400/20 rounded-full left-4"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <motion.button 
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all relative ${
            currentView === 'settings' 
              ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 pl-3' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          {currentView === 'settings' && (
            <motion.div 
              layoutId="activeNavIndicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          
          <motion.div
            animate={
              clickedItem === 'settings' ? { 
                rotate: 180,
                scale: [1, 1.2, 1]
              } : { 
                rotate: 0, 
                scale: 1 
              }
            }
            transition={{ duration: 0.5 }}
            className={currentView === 'settings' ? 'text-emerald-600' : 'text-slate-400'}
          >
            <Settings className="w-5 h-5" />
          </motion.div>
          {t(language, 'app.settings')}
          
          <AnimatePresence>
            {clickedItem === 'settings' && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute w-12 h-12 bg-emerald-400/20 rounded-full left-4"
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </aside>
  );
}
