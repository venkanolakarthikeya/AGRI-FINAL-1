const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

code = code.replace(
    '      viewFull: "View Full Analysis"',
    '      viewFull: "View Full Analysis",\n      readAloud: "Read Aloud",\n      stopReading: "Stop Reading"'
);
code = code.replace(
    '      viewFull: "पूर्ण विश्लेषण देखें"',
    '      viewFull: "पूर्ण विश्लेषण देखें",\n      readAloud: "जोर से पढ़ें",\n      stopReading: "पढ़ना बंद करें"'
);
code = code.replace(
    '      viewFull: "పూర్తి విశ్లేషణను చూడండి"',
    '      viewFull: "పూర్తి విశ్లేషణను చూడండి",\n      readAloud: "చదివి వినిపించండి",\n      stopReading: "చదవడం ఆపండి"'
);

fs.writeFileSync('src/translations.ts', code);
