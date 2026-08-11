const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
    "If the language is Hindi or Telugu, you MUST use the native script (Devanagari or Telugu) for all string fields.",
    "If the language is Hindi or Telugu, you MUST use the native script. IF THE LANGUAGE IS ENGLISH, YOU MUST STRICTLY OUTPUT ONLY IN ENGLISH, regardless of the location."
);

code = code.replace(
    "If the preferred language is Hindi or Telugu, you MUST write your entire response natively in that language (using Devanagari or Telugu script).",
    "If the preferred language is Hindi or Telugu, you MUST write your entire response natively in that language. IF THE PREFERRED LANGUAGE IS ENGLISH, YOU MUST STRICTLY OUTPUT ONLY IN ENGLISH, regardless of the user's location or regional terms."
);

fs.writeFileSync('server.ts', code);
