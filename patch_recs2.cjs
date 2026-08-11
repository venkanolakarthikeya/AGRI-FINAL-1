const fs = require('fs');
let code = fs.readFileSync('src/components/Recommendations.tsx', 'utf8');

code = code.replace(
    '<><Square className="w-4 h-4" /> Stop Reading</>',
    '<><Square className="w-4 h-4" /> {t(language, \'recs.stopReading\')}</>'
);

code = code.replace(
    '<><Volume2 className="w-4 h-4" /> Read Aloud</>',
    '<><Volume2 className="w-4 h-4" /> {t(language, \'recs.readAloud\')}</>'
);

fs.writeFileSync('src/components/Recommendations.tsx', code);
