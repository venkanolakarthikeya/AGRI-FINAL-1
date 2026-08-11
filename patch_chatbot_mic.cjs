const fs = require('fs');

function patchFile(filepath) {
    let code = fs.readFileSync(filepath, 'utf8');
    code = code.replace(
        /rec\.onerror = \(event: any\) => \{\s*console\.error\('Speech recognition error', event\.error\);\s*setIsListening\(false\);\s*\};/,
        `rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
            alert(language === 'Hindi' ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत कर दिया गया है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।' : language === 'Telugu' ? 'మైక్రోఫోన్ యాక్సెస్ నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి.' : 'Microphone access denied. Please allow it in your browser settings.');
        }
        setIsListening(false);
      };`
    );
    fs.writeFileSync(filepath, code);
}

patchFile('src/components/Chatbot.tsx');
patchFile('src/components/FloatingChatbot.tsx');
