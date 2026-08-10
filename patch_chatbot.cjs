const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

// Add Volume2 import
code = code.replace("import { Send, Bot, User, Loader2, Mic, MicOff } from 'lucide-react';", "import { Send, Bot, User, Loader2, Mic, MicOff, Volume2 } from 'lucide-react';");

// Add speakText function
const speakFunc = `
  const speakText = (text: string) => {
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
  };

  const handleSend = async (e: React.FormEvent) => {`;

code = code.replace("  const handleSend = async (e: React.FormEvent) => {", speakFunc);

// Add Speaker button in messages.map
const messageRender = `<div className="markdown-body text-sm">
                <Markdown>{msg.text}</Markdown>
              </div>`;
const newMessageRender = `<div className="markdown-body text-sm">
                <Markdown>{msg.text}</Markdown>
              </div>
              {msg.role === 'assistant' && (
                <button 
                  onClick={() => speakText(msg.text)} 
                  className="mt-2 text-emerald-600 hover:text-emerald-700 p-1.5 bg-emerald-50 rounded-full transition-colors flex items-center justify-center border border-emerald-100"
                  title="Listen to response"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}`;

code = code.replace(messageRender, newMessageRender);

fs.writeFileSync('src/components/Chatbot.tsx', code);
