const fs = require('fs');

let code = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

const weatherHelper = `  const fetchWeather = async (lat: number | string, lon: number | string) => {
    try {
      const weatherRes = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,relative_humidity_2m,precipitation\`);
      const weatherData = await weatherRes.json();
      if (weatherData && weatherData.current) {
        setSoilData(prev => ({
          ...prev,
          temperature: prev.temperature || String(weatherData.current.temperature_2m),
          humidity: prev.humidity || String(weatherData.current.relative_humidity_2m),
          rainfall: prev.rainfall || String(Math.round(weatherData.current.precipitation * 30) || 100),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch weather", err);
    }
  };`;

// Insert weather helper after isLocating state
code = code.replace(
    '  const [isLocating, setIsLocating] = useState(false);',
    '  const [isLocating, setIsLocating] = useState(false);\n\n' + weatherHelper
);

// Add weather fetch to IP fallback
code = code.replace(
    '          setSoilData(prev => ({ ...prev, location: locName }));',
    '          setSoilData(prev => ({ ...prev, location: locName }));\n          if (ipData.loc) {\n            const [lat, lon] = ipData.loc.split(\',\');\n            await fetchWeather(lat, lon);\n          }'
);

// Add weather fetch to GPS success
code = code.replace(
    '        } else if (data && data.display_name) {\n          setSoilData(prev => ({ ...prev, location: data.display_name }));\n        }',
    '        } else if (data && data.display_name) {\n          setSoilData(prev => ({ ...prev, location: data.display_name }));\n        }\n        await fetchWeather(latitude, longitude);'
);

fs.writeFileSync('src/components/SoilForm.tsx', code);
