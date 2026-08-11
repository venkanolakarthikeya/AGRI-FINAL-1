const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
    'Soil N: ${n}, P: ${p}, K: ${k}',
    'Soil N: ${n || "Not provided (estimate based on location)"}, P: ${p || "Not provided"}, K: ${k || "Not provided"}'
);
code = code.replace(
    'pH Level: ${ph}',
    'pH Level: ${ph || "Not provided (estimate based on location)"}'
);
fs.writeFileSync('server.ts', code);
