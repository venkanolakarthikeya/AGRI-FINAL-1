const fs = require('fs');
let code = fs.readFileSync('src/components/Recommendations.tsx', 'utf8');

code = code.replace(
    "import { Sprout, Loader2, CheckCircle2, X, Edit2 } from 'lucide-react';",
    "import { Sprout, Loader2, CheckCircle2, X, Edit2, Volume2, Square } from 'lucide-react';"
);

const stateAndFunctions = `  const [isSpeaking, setIsSpeaking] = useState(false);

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
      const plainText = fullAnalysis.replace(/[#*\`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      
      if (language === 'Hindi') utterance.lang = 'hi-IN';
      else if (language === 'Telugu') utterance.lang = 'te-IN';
      else utterance.lang = 'en-US';
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };`;

code = code.replace(
    '  const [isAnalyzing, setIsAnalyzing] = useState(false);',
    '  const [isAnalyzing, setIsAnalyzing] = useState(false);\n' + stateAndFunctions
);

code = code.replace(
    '<button onClick={() => setSelectedCrop(null)} className="text-emerald-100 hover:text-white transition-colors">',
    '<button onClick={handleCloseModal} className="text-emerald-100 hover:text-white transition-colors">'
);

code = code.replace(
    '<button onClick={() => setSelectedCrop(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">',
    '<button onClick={handleCloseModal} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">'
);

const ttsButton = `
              {!isAnalyzing && fullAnalysis && (
                <button onClick={toggleSpeech} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 mr-auto">
                  {isSpeaking ? (
                    <><Square className="w-4 h-4" /> Stop Reading</>
                  ) : (
                    <><Volume2 className="w-4 h-4" /> Read Aloud</>
                  )}
                </button>
              )}
`;

code = code.replace(
    '<div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">',
    '<div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end items-center">' + ttsButton
);

fs.writeFileSync('src/components/Recommendations.tsx', code);
