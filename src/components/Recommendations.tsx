import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { Recommendation, Language, SoilData, ViewState } from '../types';
import { Sprout, Loader2, CheckCircle2, X, Edit2, Volume2, Square, Wand2, Sparkles } from 'lucide-react';
import { t } from '../translations';

interface RecommendationsProps {
  recommendations: Recommendation[] | null;
  isLoading: boolean;
  language: Language;
  soilContext?: SoilData;
  setCurrentView: (view: ViewState) => void;
}

export function Recommendations({ recommendations, isLoading, language, soilContext, setCurrentView }: RecommendationsProps) {
  const [selectedCrop, setSelectedCrop] = useState<Recommendation | null>(null);
  const [fullAnalysis, setFullAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCloseModal = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedCrop(null);
  };

  const toggleSpeech = () => {
    if (!window.speechSynthesis || !fullAnalysis) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const plainText = fullAnalysis.replace(/[#*`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      
      if (language === 'Hindi') utterance.lang = 'hi-IN';
      else if (language === 'Telugu') utterance.lang = 'te-IN';
      else utterance.lang = 'en-US';
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleViewFull = async (crop: Recommendation) => {
    setSelectedCrop(crop);
    setIsAnalyzing(true);
    setFullAnalysis(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please provide a detailed, comprehensive agricultural analysis and step-by-step farming guide for growing ${crop.cropName} given the soil and climate conditions. Include land preparation, sowing, irrigation, and harvesting tips. Format clearly with headings.`,
          context: { ...soilContext, crop: crop.cropName },
          language
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setFullAnalysis(data.error || data.details || "Failed to generate analysis. Server returned an error.");
      } else {
        setFullAnalysis(data.reply || "Failed to generate analysis.");
      }
    } catch (e) {
      setFullAnalysis("Failed to load full analysis. Network or parsing error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-lg font-bold text-slate-800 tracking-tight">{t(language, 'recs.analyzing')}</p>
        <p className="text-sm text-slate-500">{t(language, 'recs.analyzingDesc')}</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center max-w-md mx-auto">
        <Sprout className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{t(language, 'recs.noRecs')}</h2>
        <p className="text-sm text-slate-500 mb-6">{t(language, 'recs.noRecsDesc')}</p>
        <button 
          onClick={() => setCurrentView('soil')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit Soil Data
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
    >
      <motion.div 
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
        className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
      >
        <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-emerald-600" />
          </div>
          {t(language, 'recs.title')}
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('soil')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-semibold bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-200"
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden md:inline">Edit Soil Data</span>
          </button>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider hidden md:inline">
            {language} {t(language, 'recs.translation')}
          </span>
        </div>
      </motion.div>

      <motion.div 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {recommendations.map((rec, index) => {
          if (rec.isPrimary) {
            return (
              <motion.div 
                key={index}
                className="md:col-span-2 lg:col-span-3 relative group"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                {/* Magic Wand Animation */}
                <motion.div
                  initial={{ x: "-20%", y: 0, opacity: 0, rotate: -45 }}
                  animate={{ x: "120%", y: [0, -20, 10, -10, 0], opacity: [0, 1, 1, 0], rotate: [0, 20, -10, 10, 45] }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                  className="absolute top-1/3 left-0 z-50 pointer-events-none drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] text-yellow-400"
                >
                  <Wand2 className="w-16 h-16" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-8 h-8 text-yellow-200" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.3, delay: 0.1 }}
                    className="absolute bottom-0 -left-4"
                  >
                    <Sparkles className="w-6 h-6 text-emerald-300" />
                  </motion.div>
                </motion.div>
                
                {/* Reveal Card */}
                <motion.div 
                  initial={{ clipPath: "circle(0% at 0% 50%)", filter: "brightness(1.5)" }}
                  animate={{ clipPath: "circle(150% at 0% 50%)", filter: "brightness(1)" }}
                  transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-md lg:flex-row border-none relative"
                >
                   <div className="p-6 text-white lg:w-1/3 flex flex-col justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
                     {/* Magic glow background inside card */}
                     <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl pointer-events-none"
                     />
                     <div className="flex justify-between items-start mb-4 relative z-10">
                       <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">{t(language, 'recs.topMatch')}</span>
                       <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg ml-auto shadow-sm">{rec.matchPercentage}% {t(language, 'recs.suitability')}</span>
                     </div>
                     <h3 className="text-3xl font-black relative z-10 drop-shadow-md">{rec.cropName}</h3>
                   </div>
                   
                   <div className="p-6 flex-1 flex flex-col bg-emerald-50/50">
                     <div className="flex-1 space-y-4">
                       <div>
                         <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                           {t(language, 'recs.whyCrop')}
                         </h4>
                         <p className="text-sm text-slate-600 leading-relaxed">{rec.reason}</p>
                       </div>
                       
                       <div className="bg-white p-4 rounded-xl border border-emerald-100 mt-4 shadow-sm relative overflow-hidden group-hover:border-emerald-200 transition-colors">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
                         <h4 className="text-xs font-bold text-slate-800 mb-1 uppercase tracking-wider relative z-10">{t(language, 'recs.actionPlan')}</h4>
                         <p className="text-slate-600 text-xs leading-relaxed relative z-10">{rec.actionPlan}</p>
                       </div>
                     </div>
                     
                     <motion.button 
                       onClick={() => handleViewFull(rec)} 
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       className="mt-6 w-full font-bold py-3 rounded-xl transition-all text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] relative overflow-hidden group/btn"
                     >
                       <span className="relative z-10 flex items-center justify-center gap-2">
                         <Sparkles className="w-4 h-4" />
                         {t(language, 'recs.viewFull')}
                       </span>
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]" />
                     </motion.button>
                   </div>
                </motion.div>
              </motion.div>
            );
          }

          return (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              key={index} 
              className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200"
            >
              {/* Visual Header / Banner */}
              <div className="p-6 text-white bg-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg ml-auto">{rec.matchPercentage}% {t(language, 'recs.suitability')}</span>
                </div>
                <h3 className="text-2xl font-black">{rec.cropName}</h3>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col bg-white">
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {t(language, 'recs.whyCrop')}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{rec.reason}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-800 mb-1 uppercase tracking-wider">{t(language, 'recs.actionPlan')}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{rec.actionPlan}</p>
                  </div>
                </div>
                
                <motion.button 
                  onClick={() => handleViewFull(rec)} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full font-bold py-3 rounded-xl transition-all text-sm bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-transparent hover:border-emerald-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 opacity-50" />
                  {t(language, 'recs.viewFull')}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {selectedCrop && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, rotateX: 20, y: 40 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: -20, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
              <h3 className="font-bold text-lg">{selectedCrop.cropName} - {t(language, 'recs.viewFull')}</h3>
              <button onClick={handleCloseModal} className="text-emerald-100 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-slate-500 font-medium">Generating detailed analysis...</p>
                </div>
              ) : (
                <div className="prose prose-emerald prose-sm max-w-none text-slate-700">
                  <div className="markdown-body">
                    <Markdown>{fullAnalysis || ''}</Markdown>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end items-center">
              {!isAnalyzing && fullAnalysis && (
                <button onClick={toggleSpeech} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 mr-auto">
                  {isSpeaking ? (
                    <><Square className="w-4 h-4" /> {t(language, 'recs.stopReading')}</>
                  ) : (
                    <><Volume2 className="w-4 h-4" /> {t(language, 'recs.readAloud')}</>
                  )}
                </button>
              )}

              <button onClick={handleCloseModal} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
