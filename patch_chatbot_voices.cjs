const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

const oldSpeakText = `  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (language === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'Telugu') {
      utterance.lang = 'te-IN';
    } else {
      utterance.lang = 'en-US';
    }
    
    window.speechSynthesis.speak(utterance);
  };`;

const newSpeakText = `  const speakText = (text: string) => {
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

code = code.replace(oldSpeakText, newSpeakText);
fs.writeFileSync('src/components/Chatbot.tsx', code);
