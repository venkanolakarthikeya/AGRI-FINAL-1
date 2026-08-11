const fs = require('fs');

let code = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

code = code.replace(
    "const ipRes = await fetch('https://ipapi.co/json/');",
    "const ipRes = await fetch('https://ipinfo.io/json');"
);

fs.writeFileSync('src/components/SoilForm.tsx', code);
