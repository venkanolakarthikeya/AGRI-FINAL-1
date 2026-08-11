const fs = require('fs');
let code = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

const climateInputs = `
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.temp')} <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
              <input type="number" step="0.1" min="-10" max="60" name="temperature" value={soilData.temperature} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="Auto-fetch if empty" />
              {fieldErrors.temperature && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.temperature}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.humidity')} <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
              <input type="number" min="0" max="100" name="humidity" value={soilData.humidity} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="Auto-fetch if empty" />
              {fieldErrors.humidity && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.humidity}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.rainfall')} <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
              <input type="number" min="0" max="5000" name="rainfall" value={soilData.rainfall} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="Auto-fetch if empty" />
              {fieldErrors.rainfall && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.rainfall}</p>}
            </div>
`;

// Replace JSX
code = code.replace(
    /<div className="grid grid-cols-1 md:grid-cols-2 gap-5">\s*<div className="space-y-2">/,
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-5">' + climateInputs + '\n            <div className="space-y-2">'
);

// Replace fetch logic
const fetchLogic = `      let temp = soilData.temperature ? Number(soilData.temperature) : null;
      let hum = soilData.humidity ? Number(soilData.humidity) : null;
      let rain = soilData.rainfall ? Number(soilData.rainfall) : null;
      
      if (temp === null || hum === null || rain === null) {
        const geoRes = await fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(soilData.location)}&format=json&limit=1&accept-language=en\`);
        const geoData = await geoRes.json();
        
        if (geoData && geoData.length > 0) {
          const { lat, lon } = geoData[0];
          const weatherRes = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,relative_humidity_2m,precipitation\`);
          const weatherData = await weatherRes.json();
          if (weatherData && weatherData.current) {
            if (temp === null) temp = weatherData.current.temperature_2m;
            if (hum === null) hum = weatherData.current.relative_humidity_2m;
            if (rain === null) rain = weatherData.current.precipitation * 30 || 100;
          }
        }
      }
      
      // Fallbacks if still null
      if (temp === null) temp = 25;
      if (hum === null) hum = 60;
      if (rain === null) rain = 100;`;

code = code.replace(
    /const geoRes = await fetch[\s\S]*?(?=const payload = {)/,
    fetchLogic + '\n\n      '
);

fs.writeFileSync('src/components/SoilForm.tsx', code);
