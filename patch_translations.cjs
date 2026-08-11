const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

code = code.replace(
    '      location: "Location",',
    '      location: "Location",\n      useLocation: "Use Current Location (GPS)",\n      locating: "Locating...",'
);

code = code.replace(
    '      location: "स्थान",',
    '      location: "स्थान",\n      useLocation: "वर्तमान स्थान (GPS) का उपयोग करें",\n      locating: "स्थान खोज रहा है...",'
);

code = code.replace(
    '      location: "ప్రాంతం",',
    '      location: "ప్రాంతం",\n      useLocation: "ప్రస్తుత స్థానాన్ని (GPS) ఉపయోగించండి",\n      locating: "స్థానం కనుగొనబడుతోంది...",'
);

fs.writeFileSync('src/translations.ts', code);
