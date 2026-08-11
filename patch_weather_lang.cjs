const fs = require('fs');
let code = fs.readFileSync('src/components/Weather.tsx', 'utf8');

code = code.replace(
    'accept-language=en',
    'accept-language=${language === "Hindi" ? "hi" : language === "Telugu" ? "te" : "en"}'
);

fs.writeFileSync('src/components/Weather.tsx', code);
