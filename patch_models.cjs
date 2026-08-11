const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
    /const fallbackModels = \[\s*'gemini-3\.5-flash',\s*'gemini-pro-latest',\s*'gemini-flash-latest',\s*'gemini-3\.1-flash-lite'\s*\];/,
    "const fallbackModels = ['gemini-flash-latest', 'gemini-pro-latest'];"
);

code = code.replace(
    /model: 'gemini-3\.5-flash',/g,
    "model: 'gemini-flash-latest',"
);

fs.writeFileSync('server.ts', code);
