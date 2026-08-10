const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const newRecommendInstruction = "CRITICAL INSTRUCTION: You MUST translate ALL output text (including cropName, reason, and actionPlan) natively into ${language || 'English'} using local terminology familiar to farmers. If the language is Hindi or Telugu, you MUST use the native script (Devanagari or Telugu) for all string fields.";
code = code.replace(/CRITICAL INSTRUCTION: You MUST translate ALL output text \(including cropName, reason, and actionPlan\) into \$\{language \|\| 'English'\}\./, newRecommendInstruction);
fs.writeFileSync('server.ts', code);
