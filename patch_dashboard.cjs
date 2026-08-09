const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const importsTarget = `import { Lightbulb, Droplets, Thermometer, Wind, Sprout } from 'lucide-react';`;
code = code.replace(importsTarget, `import { Lightbulb, Droplets, Thermometer, Wind, Sprout, X, Loader2 } from 'lucide-react';`);

const stateTarget = `export function Dashboard({ setCurrentView, recommendations, language }: DashboardProps) {
  const topCrop = recommendations?.find(r => r.isPrimary) || recommendations?.[0];`;

const stateReplacement = `export function Dashboard({ setCurrentView, recommendations, language }: DashboardProps) {
  const [modalData, setModalData] = React.useState<{ title: string, content: string | null } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const topCrop = recommendations?.find(r => r.isPrimary) || recommendations?.[0];

  const handleInsight = async (crop: Recommendation, type: 'timeline' | 'pricing' | 'actionPlan') => {
    let prompt = '';
    let title = '';
    if (type === 'timeline') {
      title = \`\${crop.cropName} - \${t(language, 'dashboard.viewTimeline')}\`;
      prompt = \`Provide a detailed growth timeline for \${crop.cropName} from sowing to harvesting.\`;
    } else if (type === 'pricing') {
      title = \`\${crop.cropName} - \${t(language, 'dashboard.marketPricing')}\`;
      prompt = \`Provide a current market pricing analysis and economic forecast for \${crop.cropName}.\`;
    } else {
      title = \`\${crop.cropName} - \${t(language, 'dashboard.viewActionPlan')}\`;
      prompt = \`Provide a step-by-step action plan for growing \${crop.cropName} given the soil and climate conditions. Include land preparation, sowing, irrigation, and harvesting tips. Format clearly with headings.\`;
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
      setModalData({ title, content: data.reply || "Failed to generate analysis." });
    } catch (e) {
      setModalData({ title, content: "Failed to load analysis." });
    } finally {
      setIsAnalyzing(false);
    }
  };
`;
code = code.replace(stateTarget, stateReplacement);


const btnTarget1 = `                            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                              {t(language, 'dashboard.viewTimeline')}
                            </button>
                            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                              {t(language, 'dashboard.marketPricing')}
                            </button>`;

const btnReplacement1 = `                            <button onClick={() => handleInsight(rec, 'timeline')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                              {t(language, 'dashboard.viewTimeline')}
                            </button>
                            <button onClick={() => handleInsight(rec, 'pricing')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                              {t(language, 'dashboard.marketPricing')}
                            </button>`;
code = code.replace(btnTarget1, btnReplacement1);

const btnTarget2 = `                        {!rec.isPrimary && (
                          <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2 text-sm">
                            <Sprout className="w-4 h-4" />
                            {t(language, 'dashboard.viewActionPlan')}
                          </button>
                        )}`;

const btnReplacement2 = `                        {!rec.isPrimary && (
                          <button onClick={() => handleInsight(rec, 'actionPlan')} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2 text-sm">
                            <Sprout className="w-4 h-4" />
                            {t(language, 'dashboard.viewActionPlan')}
                          </button>
                        )}`;
code = code.replace(btnTarget2, btnReplacement2);


const endTarget = `    </div>
  );
}`;

const endReplacement = `
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
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
                  <p className="text-slate-500 font-medium">Generating insights...</p>
                </div>
              ) : (
                <div className="prose prose-emerald prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                  {modalData.content}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setModalData(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(endTarget, endReplacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
