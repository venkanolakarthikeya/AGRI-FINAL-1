const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = `import { Settings } from './components/Settings';`;
const importReplacement = `import { Settings } from './components/Settings';\nimport { FloatingChatbot } from './components/FloatingChatbot';`;

code = code.replace(importTarget, importReplacement);

const renderTarget = `      {/* Mobile Bottom Nav */}`;
const renderReplacement = `      <FloatingChatbot language={language} soilContext={soilData} />\n\n      {/* Mobile Bottom Nav */}`;

code = code.replace(renderTarget, renderReplacement);
fs.writeFileSync('src/App.tsx', code);
