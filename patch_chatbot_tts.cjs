const fs = require('fs');

function patchFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Add Pause/Square/StopCircle icon
  code = code.replace("Volume2 } from 'lucide-react';", "Volume2, Square } from 'lucide-react';");

  // 2. Add state
  const stateStr = `  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);`;
  code = code.replace(`  const [isListening, setIsListening] = useState(false);\n  const [recognition, setRecognition] = useState<any>(null);`, stateStr);

  // 3. Update speakText function
  const oldSpeakText = `  const speakText = (text: string) => {
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
  };`;

  const newSpeakText = `  const toggleSpeak = (text: string, idx: number) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (speakingMsgIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
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
    
    utterance.onend = () => setSpeakingMsgIdx(null);
    utterance.onerror = () => setSpeakingMsgIdx(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingMsgIdx(idx);
  };`;

  code = code.replace(oldSpeakText, newSpeakText);

  // 4. Update the render logic for the button in Chatbot
  // Note: we need to handle both Chatbot and FloatingChatbot, so let's match carefully
  code = code.replace(/onClick=\{\(\) \=\> speakText\(msg\.text\)\} /g, "onClick={() => toggleSpeak(msg.text, idx)} ");
  
  // Replace the Volume2 icon logic
  const volIconRegex = /<Volume2 className="w-([0-9]) h-\1" \/>/g;
  code = code.replace(volIconRegex, (match, size) => {
    return `{speakingMsgIdx === idx ? <Square className="w-${size} h-${size} fill-current" /> : <Volume2 className="w-${size} h-${size}" />}`;
  });

  // Also replace title text
  code = code.replace(/title="Listen to response"/g, `title={speakingMsgIdx === idx ? "Stop speaking" : "Listen to response"}`);

  fs.writeFileSync(filePath, code);
}

patchFile('src/components/Chatbot.tsx');
patchFile('src/components/FloatingChatbot.tsx');
