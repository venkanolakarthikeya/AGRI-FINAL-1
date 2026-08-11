const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
    "const fallbackModels = ['gemini-flash-latest', 'gemini-pro-latest'];",
    "const fallbackModels = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-flash-latest'];"
);

code = code.replace(
    /await new Promise\(resolve => setTimeout\(resolve, 1000\)\);/g,
    "await new Promise(resolve => setTimeout(resolve, 3000));" // 3 second delay to let quota recover
);

fs.writeFileSync('server.ts', code);
