const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

code = code.replace(/title: "AgriSmart AI"/g, 'title: "AgriSmart"');
code = code.replace(/title: "एग्रीस्मार्ट एआई"/g, 'title: "एग्रीस्मार्ट"');
code = code.replace(/title: "అగ్రిస్మార్ట్ AI"/g, 'title: "అగ్రిస్మార్ట్"');

fs.writeFileSync('src/translations.ts', code);
console.log("Patched titles again.");
