const fs = require('fs');

let code = fs.readFileSync('src/components/Weather.tsx', 'utf8');

const oldUrl = '`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&hourly=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto`';
const newUrl = '`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&hourly=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto&models=best_match`';

if (code.includes(oldUrl)) {
    code = code.replace(oldUrl, newUrl);
    fs.writeFileSync('src/components/Weather.tsx', code);
    console.log('patched');
} else {
    console.log('not found');
}
