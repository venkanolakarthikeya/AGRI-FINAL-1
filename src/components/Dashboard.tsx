import React from 'react';
import { motion } from 'motion/react';
import { ViewState, Recommendation, Language, SoilData } from '../types';
import { Lightbulb, Droplets, Thermometer, Wind, Sprout, X, Loader2 } from 'lucide-react';
import { t } from '../translations';

interface DashboardProps {
  setCurrentView: (view: ViewState) => void;
  recommendations: Recommendation[] | null;
  language: Language;
  soilContext?: SoilData;
}

export function Dashboard({ setCurrentView, recommendations, language, soilContext }: DashboardProps) {
  const [modalData, setModalData] = React.useState<{ title: string, content: string | null } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const topCrop = recommendations?.find(r => r.isPrimary) || recommendations?.[0];

  const handleInsight = async (crop: Recommendation, type: 'timeline' | 'pricing' | 'actionPlan') => {
    let prompt = '';
    let title = '';
    if (type === 'timeline') {
      title = `${crop.cropName} - ${t(language, 'dashboard.viewTimeline')}`;
      prompt = `Provide a detailed growth timeline for ${crop.cropName} from sowing to harvesting.`;
    } else if (type === 'pricing') {
      title = `${crop.cropName} - ${t(language, 'dashboard.marketPricing')}`;
      prompt = `Provide a current market pricing analysis and economic forecast for ${crop.cropName}.`;
    } else {
      title = `${crop.cropName} - ${t(language, 'dashboard.viewActionPlan')}`;
      prompt = `Provide a step-by-step action plan for growing ${crop.cropName} given the soil and climate conditions. Include land preparation, sowing, irrigation, and harvesting tips. Format clearly with headings.`;
    }

    setModalData({ title, content: null });
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          context: { crop: crop.cropName },
          language
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setModalData({ title, content: data.error || data.details || "Failed to generate analysis. Server returned an error." });
      } else {
        setModalData({ title, content: data.reply || "Failed to generate analysis." });
      }
    } catch (e) {
      setModalData({ title, content: "Failed to load analysis. Network or parsing error." });
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div 
        className="bg-white border border-slate-200 shadow-sm p-4 md:p-5 rounded-2xl flex items-start gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 shrink-0">
          <Lightbulb className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {topCrop && soilContext?.ph ? `${t(language, 'dashboard.optimalWindow')} - ${topCrop.cropName}` : t(language, 'dashboard.optimalWindow')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {topCrop && soilContext?.ph ? 
              (language === 'Hindi' 
                ? `आपके मृदा विश्लेषण (pH: ${soilContext.ph}, नाइट्रोजन: ${soilContext.n}) के आधार पर, ${topCrop.cropName} ${topCrop.matchPercentage}% अनुकूल है।`
                : language === 'Telugu'
                ? `మీ మట్టి విశ్లేషణ (pH: ${soilContext.ph}, నత్రజని: ${soilContext.n}) ఆధారంగా, ${topCrop.cropName} ${topCrop.matchPercentage}% అనుకూలంగా ఉంది.`
                : `Based on your soil analysis (pH: ${soilContext.ph}, Nitrogen: ${soilContext.n}), ${topCrop.cropName} is a ${topCrop.matchPercentage}% match.`)
              : t(language, 'dashboard.optimalDesc')}
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-[-12px]">
            <h3 className="text-lg font-bold text-slate-800">{t(language, 'dashboard.topCrops')}</h3>
            {!recommendations && (
              <button 
                onClick={() => setCurrentView('soil')}
                className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {t(language, 'dashboard.runSoilTest')} &rarr;
              </button>
            )}
            {recommendations && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">{t(language, 'dashboard.updatedJustNow')}</span>
            )}
          </div>
          
          {recommendations ? (
             <div className="grid grid-cols-1 gap-4">
                {recommendations.map((rec, i) => (
                  <motion.div key={i} className={`overflow-hidden transition-all ${rec.isPrimary ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-md' : 'bg-white border border-slate-200 rounded-2xl shadow-sm'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="p-5 flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                             <h4 className={`text-2xl font-black ${rec.isPrimary ? 'text-white' : 'text-slate-800'}`}>{rec.cropName}</h4>
                             {rec.isPrimary && <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider">{t(language, 'dashboard.topMatch')}</span>}
                           </div>
                           <div className="text-right">
                             <p className={`text-[10px] font-bold uppercase tracking-wider ${rec.isPrimary ? 'text-white/80' : 'text-slate-400'}`}>{t(language, 'dashboard.suitability')}</p>
                             <p className={`text-2xl font-black ${rec.isPrimary ? 'text-white' : 'text-emerald-600'}`}>{rec.matchPercentage}%</p>
                           </div>
                        </div>
                        <p className={`text-sm leading-relaxed ${rec.isPrimary ? 'text-white/90' : 'text-slate-500'}`}>{rec.reason}</p>
                        
                        {rec.isPrimary && (
                          <div className="flex flex-wrap gap-3 mt-4">
                            <motion.button 
                              onClick={() => handleInsight(rec, 'timeline')} 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                            >
                              {t(language, 'dashboard.viewTimeline')}
                            </motion.button>
                            <motion.button 
                              onClick={() => handleInsight(rec, 'pricing')} 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                            >
                              {t(language, 'dashboard.marketPricing')}
                            </motion.button>
                          </div>
                        )}

                        {!rec.isPrimary && (
                          <motion.button 
                            onClick={() => handleInsight(rec, 'actionPlan')} 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2 text-sm hover:border-emerald-200 hover:text-emerald-700"
                          >
                            <Sprout className="w-4 h-4" />
                            {t(language, 'dashboard.viewActionPlan')}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-6">{t(language, 'dashboard.noData')}</p>
              <button 
                onClick={() => setCurrentView('soil')}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                {t(language, 'dashboard.startAnalysis')}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative text-white p-6">
             <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black select-none pointer-events-none">AI</div>
             <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
               <Lightbulb className="w-4 h-4" />
               {t(language, 'dashboard.aiAssistant')}
             </h2>
             
             <div className="space-y-4 relative z-10">
                {topCrop ? (
                   <>
                     <p className="text-sm leading-relaxed text-slate-300">
                       <span className="text-white font-bold">{t(language, 'dashboard.why')} {topCrop.cropName}?</span> {topCrop.reason}
                     </p>
                     <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider">{t(language, 'dashboard.criticalAction')}</p>
                        <p className="text-sm leading-tight text-white">{topCrop.actionPlan}</p>
                     </div>
                   </>
                ) : (
                   <p className="text-slate-400 text-sm">{t(language, "dashboard.unlockInsights")}</p>
                )}
             </div>
           </div>

        </div>
      </motion.div>

      {modalData && (
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
              <h3 className="font-bold text-lg">{modalData.title}</h3>
              <button onClick={() => setModalData(null)} className="text-emerald-100 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-slate-500 font-medium">{t(language, "dashboard.generatingInsights")}</p>
                </div>
              ) : (
                <div className="prose prose-emerald prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                  {modalData.content}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setModalData(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                {t(language, "dashboard.close")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
