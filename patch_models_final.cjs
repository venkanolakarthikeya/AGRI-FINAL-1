const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldModels = `  const fallbackModels = [
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-pro-latest',
    'gemini-3.1-flash-lite'
  ];`;

const newModels = `  const fallbackModels = [
    'gemini-3.5-flash',
    'gemini-pro-latest',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];`;

code = code.replace(oldModels, newModels);
// Also patch the initial model in generateWithRetry calls if any
code = code.replace(/model: 'gemini-flash-latest'/g, "model: 'gemini-3.5-flash'");

fs.writeFileSync('server.ts', code);
