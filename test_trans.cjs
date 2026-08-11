const fs = require('fs');
const content = fs.readFileSync('src/translations.ts', 'utf8');
// just print the first 200 chars of English section
const match = content.match(/English:\s*{([\s\S]*?)},\s*Hindi:/);
if (match) {
    console.log(match[1].substring(0, 500));
}
