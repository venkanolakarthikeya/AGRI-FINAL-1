const fs = require('fs');
['src/components/Chatbot.tsx', 'src/components/FloatingChatbot.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the error handler
  const oldError = `      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
            alert(language === 'Hindi' ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत कर दिया गया है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।' : language === 'Telugu' ? 'మైక్రోఫోన్ యాక్సెస్ నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి.' : 'Microphone access denied. Please allow it in your browser settings.');
        }
        setIsListening(false);
      };`;
      
  const newError = `      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
            const errorMsg = language === 'Hindi' ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत कर दिया गया है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।' : language === 'Telugu' ? 'మైక్రోఫోన్ యాక్సెస్ నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి.' : 'Microphone access denied. Please allow it in your browser settings.';
            setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
        }
        setIsListening(false);
      };`;
      
  code = code.replace(oldError, newError);
  fs.writeFileSync(file, code);
});
