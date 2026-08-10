const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingChatbot.tsx', 'utf8');

// 1. Add imports
code = code.replace("import { Send, Bot, X, Loader2 } from 'lucide-react';", "import { Send, Bot, X, Loader2, Mic, MicOff, Volume2 } from 'lucide-react';");

// 2. Add states
const stateStr = `  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);`;
code = code.replace(`  const [input, setInput] = useState('');\n  const [isLoading, setIsLoading] = useState(false);`, stateStr);

// 3. Add useEffects and functions
const oldHandleSend = `  const handleSend = async (e: React.FormEvent) => {`;
const newUseEffectsAndFuncs = `  useEffect(() => {
    // Attempt to preload voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      
      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        if (language === 'Hindi') {
          recognition.lang = 'hi-IN';
        } else if (language === 'Telugu') {
          recognition.lang = 'te-IN';
        } else {
          recognition.lang = 'en-US';
        }
        
        try {
          recognition.start();
          setIsListening(true);
        } catch(e) {
          console.error(e);
        }
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }
    window.speechSynthesis.cancel();
    
    // Clean markdown characters for better speech
    const cleanText = text.replace(/[*_#]/g, '').replace(/\\[(.*?)\\]\\(.*?\\)/g, '$1');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    
    if (language === 'Hindi') {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('hi-IN') || v.name.includes('Hindi'));
      if (hiVoice) utterance.voice = hiVoice;
    } else if (language === 'Telugu') {
      utterance.lang = 'te-IN';
      const teVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('te-IN') || v.name.includes('Telugu'));
      if (teVoice) utterance.voice = teVoice;
    } else {
      utterance.lang = 'en-US';
      const enVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e: React.FormEvent) => {`;
code = code.replace(oldHandleSend, newUseEffectsAndFuncs);

// 4. Add Volume button to message
const oldMessageBody = `<div className="markdown-body text-sm">
                  <Markdown>{msg.text}</Markdown>
                </div>`;
const newMessageBody = `<div className="markdown-body text-sm">
                  <Markdown>{msg.text}</Markdown>
                </div>
                {msg.role === 'assistant' && (
                  <button 
                    type="button"
                    onClick={() => speakText(msg.text)} 
                    className="mt-2 text-emerald-600 hover:text-emerald-700 p-1.5 bg-emerald-50 rounded-full transition-colors flex items-center justify-center border border-emerald-100"
                    title="Listen to response"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}`;
code = code.replace(oldMessageBody, newMessageBody);

// 5. Add Mic button to form
const oldForm = `<form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2 md:rounded-b-2xl">`;
const newForm = `<form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2 md:rounded-b-2xl">
          <button
            type="button"
            onClick={toggleListen}
            className={\`px-3 py-2 rounded-xl transition-all flex items-center justify-center shadow-sm shrink-0 \${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
            }\`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>`;
code = code.replace(oldForm, newForm);

fs.writeFileSync('src/components/FloatingChatbot.tsx', code);
