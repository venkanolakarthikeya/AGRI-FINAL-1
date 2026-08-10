const fs = require('fs');

let code = fs.readFileSync('src/translations.ts', 'utf8');

const englishUpdates = {
    unlockInsights: "Complete a soil analysis to unlock AI-powered insights for your specific field conditions.",
    generatingInsights: "Generating insights...",
    close: "Close",
    chatbotWelcome: "Hello! I am your AgriSmart AI assistant. How can I help you today?",
    floatingWelcome: "Hello! I am your AgriSmart AI assistant. I'm here to help with any doubts you have while using the app."
};

const hindiUpdates = {
    unlockInsights: "अपनी विशिष्ट खेत स्थितियों के लिए AI-संचालित अंतर्दृष्टि प्राप्त करने के लिए मृदा परीक्षण पूरा करें।",
    generatingInsights: "अंतर्दृष्टि उत्पन्न की जा रही है...",
    close: "बंद करें",
    chatbotWelcome: "नमस्ते! मैं आपका एग्रीस्मार्ट एआई सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    floatingWelcome: "नमस्ते! मैं आपका एग्रीस्मार्ट एआई सहायक हूं। ऐप का उपयोग करते समय आपके किसी भी संदेह में मदद करने के लिए मैं यहां हूं।"
};

const teluguUpdates = {
    unlockInsights: "మీ నిర్దిష్ట క్షేత్ర పరిస్థితుల కోసం AI-ఆధారిత అంతర్దృష్టులను అన్‌లాక్ చేయడానికి మట్టి విశ్లేషణను పూర్తి చేయండి.",
    generatingInsights: "అంతర్దృష్టులను రూపొందిస్తోంది...",
    close: "మూసివేయు",
    chatbotWelcome: "నమస్కారం! నేను మీ అగ్రిస్మార్ట్ AI సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    floatingWelcome: "నమస్కారం! నేను మీ అగ్రిస్మార్ట్ AI సహాయకుడిని. యాప్‌ని ఉపయోగిస్తున్నప్పుడు మీకు ఏవైనా సందేహాలు ఉంటే సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను."
};

function insertUpdates(lang, updates) {
    const searchStr = lang + ": {";
    const target = code.indexOf(searchStr);
    if (target === -1) return;
    
    // Find 'dashboard: {' inside lang
    const dashTarget = code.indexOf('dashboard: {', target);
    if (dashTarget !== -1) {
        // insert after 'dashboard: {'
        const insertPoint = dashTarget + 'dashboard: {'.length;
        code = code.slice(0, insertPoint) + 
            "\n      unlockInsights: \"" + updates.unlockInsights + "\",\n      generatingInsights: \"" + updates.generatingInsights + "\",\n      close: \"" + updates.close + "\"," + 
            code.slice(insertPoint);
    }
    
    const chatTarget = code.indexOf('chat: {', target);
    if (chatTarget !== -1) {
        const insertPoint = chatTarget + 'chat: {'.length;
        code = code.slice(0, insertPoint) + 
            "\n      welcome: \"" + updates.chatbotWelcome + "\",\n      floatingWelcome: \"" + updates.floatingWelcome + "\"," + 
            code.slice(insertPoint);
    }
}

insertUpdates('English', englishUpdates);
insertUpdates('Hindi', hindiUpdates);
insertUpdates('Telugu', teluguUpdates);

fs.writeFileSync('src/translations.ts', code);
