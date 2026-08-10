const fs = require('fs');

let chatCode = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');
chatCode = chatCode.replace(
    /text: \`Hello! I am your AgriSmart AI assistant\. How can I help you today\? I can answer in \$\{language\}\.\`/,
    'text: t(language, "chat.welcome")'
);
// Make sure it runs when language changes
chatCode = chatCode.replace(
    /const \[messages, setMessages\] = useState<ChatMessage\[\]>\(\[[\s\S]*?\]\);/,
    "const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: t(language, 'chat.welcome') }]);\n  \n  useEffect(() => {\n    if (messages.length === 1 && messages[0].role === 'assistant') {\n      setMessages([{ role: 'assistant', text: t(language, 'chat.welcome') }]);\n    }\n  }, [language]);"
);
fs.writeFileSync('src/components/Chatbot.tsx', chatCode);


let floatCode = fs.readFileSync('src/components/FloatingChatbot.tsx', 'utf8');
floatCode = floatCode.replace(
    /text: \`Hello! I am your AgriSmart AI assistant\. I'm here to help with any doubts you have while using the app\.\`/,
    'text: t(language, "chat.floatingWelcome")'
);
floatCode = floatCode.replace(
    /const \[messages, setMessages\] = useState<ChatMessage\[\]>\(\[[\s\S]*?\]\);/,
    "const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: t(language, 'chat.floatingWelcome') }]);\n  \n  useEffect(() => {\n    if (messages.length === 1 && messages[0].role === 'assistant') {\n      setMessages([{ role: 'assistant', text: t(language, 'chat.floatingWelcome') }]);\n    }\n  }, [language]);"
);
fs.writeFileSync('src/components/FloatingChatbot.tsx', floatCode);
