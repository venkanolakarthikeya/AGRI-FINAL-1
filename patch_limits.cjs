const fs = require('fs');
let code = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

code = code.replace(
    'ph: { min: 0, max: 14 }',
    'ph: { min: 0, max: 14 },\n       temperature: { min: -10, max: 60 },\n       humidity: { min: 0, max: 100 },\n       rainfall: { min: 0, max: 5000 }'
);

fs.writeFileSync('src/components/SoilForm.tsx', code);
