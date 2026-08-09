const fs = require('fs');
let code = fs.readFileSync('src/components/Recommendations.tsx', 'utf8');

const target = `              <button className={\`mt-6 w-full font-bold py-3 rounded-xl transition-colors text-sm \${rec.isPrimary ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}\`}>
                {t(language, 'recs.viewFull')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;

const replacement = `              <button 
                onClick={() => handleViewFull(rec)}
                className={\`mt-6 w-full font-bold py-3 rounded-xl transition-colors text-sm \${rec.isPrimary ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}\`}>
                {t(language, 'recs.viewFull')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
              <h3 className="font-bold text-lg">{selectedCrop.cropName} - {t(language, 'recs.viewFull')}</h3>
              <button onClick={() => setSelectedCrop(null)} className="text-emerald-100 hover:text-white transition-colors">
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
                <div className="prose prose-emerald prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                  {fullAnalysis}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedCrop(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

if (code.includes(target.trim())) {
  console.log("Found");
}

code = code.replace(
  `              <button className={\`mt-6 w-full font-bold py-3 rounded-xl transition-colors text-sm \${rec.isPrimary ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}\`}>`,
  `              <button onClick={() => handleViewFull(rec)} className={\`mt-6 w-full font-bold py-3 rounded-xl transition-colors text-sm \${rec.isPrimary ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}\`}>`
);

const modal = `
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
              <h3 className="font-bold text-lg">{selectedCrop.cropName} - {t(language, 'recs.viewFull')}</h3>
              <button onClick={() => setSelectedCrop(null)} className="text-emerald-100 hover:text-white transition-colors">
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
                <div className="prose prose-emerald prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                  {fullAnalysis}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedCrop(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(`    </div>\n  );\n}`, modal + `    </div>\n  );\n}`);

fs.writeFileSync('src/components/Recommendations.tsx', code);
