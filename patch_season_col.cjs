const fs = require('fs');
let code = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

code = code.replace(
    /<div>\s*<label className="block text-\[10px\] uppercase font-bold text-slate-500 mb-1\.5 ml-1">\{t\(language, 'soil\.season'\)\}<\/label>/,
    '<div className="md:col-span-2">\n              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, \'soil.season\')}</label>'
);

fs.writeFileSync('src/components/SoilForm.tsx', code);
