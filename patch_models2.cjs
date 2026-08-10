const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldModels = `  const fallbackModels = [
    'gemini-2.5-flash',
    'gemini-2.5-pro'
  ];`;

const newModels = `  const fallbackModels = [
    'gemini-3.5-flash',
    'gemini-pro-latest',
    'gemini-flash-latest'
  ];`;

code = code.replace(oldModels, newModels);
// Also patch the initial model in generateWithRetry calls if any
code = code.replace(/gemini-2\.5-flash/g, 'gemini-3.5-flash');

fs.writeFileSync('server.ts', code);
