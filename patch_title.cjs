const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

code = code.replace(/title: "AgriMind"/g, 'title: "AgriSmart AI"');
code = code.replace(/title: "एग्रीमाइंड"/g, 'title: "एग्रीस्मार्ट एआई"');
code = code.replace(/title: "అగ్రిమైండ్"/g, 'title: "అగ్రిస్మార్ట్ AI"');

fs.writeFileSync('src/translations.ts', code);
console.log("Patched titles.");
