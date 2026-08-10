import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage, Language, SoilData } from '../types';
import { Send, Bot, User, Loader2, Mic, MicOff, Volume2, Square } from 'lucide-react';
import { t } from '../translations';

interface ChatbotProps {
  language: Language;
  soilContext: SoilData;
}

export function Chatbot({ language, soilContext }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: t(language, 'chat.welcome') }]);
  
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', text: t(language, 'chat.welcome') }]);
    }
  }, [language]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
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


  const toggleSpeak = (text: string, idx: number) => {
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
    const cleanText = text.replace(/[*_#]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
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
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: soilContext, language })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: error.message || "I'm sorry, I encountered an error connecting to the neural network." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-slate-900 p-5 text-white flex items-center gap-4 shrink-0 border-b border-slate-800">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight">{t(language, 'chat.title')}</h2>
          <p className="text-slate-400 text-xs">{t(language, 'chat.desc')} {language}.</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-sm' : 'bg-slate-800 text-white shadow-sm'}`}>
              {msg.role === 'user' ? 'U' : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-sm shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
            }`}>
              <div className="markdown-body text-sm">
                <Markdown>{msg.text}</Markdown>
              </div>
              {msg.role === 'assistant' && (
                <button 
                  onClick={() => toggleSpeak(msg.text, idx)} 
                  className="mt-2 text-emerald-600 hover:text-emerald-700 p-1.5 bg-emerald-50 rounded-full transition-colors flex items-center justify-center border border-emerald-100"
                  title={speakingMsgIdx === idx ? "Stop speaking" : "Listen to response"}
                >
                  {speakingMsgIdx === idx ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 rounded-tl-sm shadow-sm flex items-center gap-3 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              {t(language, 'chat.analyzing')}
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-3">
        <button
          type="button"
          onClick={toggleListen}
          className={`px-4 py-3 rounded-xl transition-all flex items-center justify-center shadow-sm shrink-0 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${t(language, 'chat.placeholder')} ${language}...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
