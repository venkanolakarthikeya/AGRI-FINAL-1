const fs = require('fs');

let code = fs.readFileSync('src/components/FloatingChatbot.tsx', 'utf8');

code = code.replace(
    'AgriSmart Assistant',
    '{t(language, "chat.title")}'
);

code = code.replace(
    '<p className="text-emerald-100 text-xs text-opacity-80">Ask me anything</p>',
    '<p className="text-emerald-100 text-xs text-opacity-80">{t(language, "chat.desc")}</p>'
);

code = code.replace(
    'Thinking...',
    '{t(language, "chat.analyzing")}'
);

code = code.replace(
    'placeholder={`Ask a question...`}',
    'placeholder={`${t(language, "chat.placeholder")}...`}'
);

fs.writeFileSync('src/components/FloatingChatbot.tsx', code);
