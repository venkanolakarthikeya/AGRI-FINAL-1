const fs = require('fs');

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
    '<p className="text-slate-400 text-sm">Complete a soil analysis to unlock AI-powered insights for your specific field conditions.</p>',
    '<p className="text-slate-400 text-sm">{t(language, "dashboard.unlockInsights")}</p>'
);

code = code.replace(
    '<p className="text-slate-500 font-medium">Generating insights...</p>',
    '<p className="text-slate-500 font-medium">{t(language, "dashboard.generatingInsights")}</p>'
);

code = code.replace(
    'Close',
    '{t(language, "dashboard.close")}'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
