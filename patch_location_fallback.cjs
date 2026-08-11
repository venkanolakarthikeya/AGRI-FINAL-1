const fs = require('fs');

let code = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

code = code.replace(
    '    navigator.geolocation.getCurrentPosition(async (position) => {',
    `    const fallbackToIP = async () => {
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        if (ipData && ipData.city) {
          const locName = ipData.region ? \`\${ipData.city}, \${ipData.region}\` : ipData.city;
          setSoilData(prev => ({ ...prev, location: locName }));
        } else {
          setError(language === 'Hindi' ? "स्थान प्राप्त करने में विफल।" : language === 'Telugu' ? "స్థానాన్ని పొందడంలో విఫలమైంది." : "Failed to get location.");
        }
      } catch (err) {
        setError(language === 'Hindi' ? "स्थान प्राप्त करने में विफल।" : language === 'Telugu' ? "స్థానాన్ని పొందడంలో విఫలమైంది." : "Failed to get location.");
      } finally {
        setIsLocating(false);
      }
    };

    navigator.geolocation.getCurrentPosition(async (position) => {`
);

code = code.replace(
    '    }, (err) => {\n      setIsLocating(false);\n      setError(err.message || "Failed to get location.");\n    });',
    '    }, (err) => {\n      console.warn("GPS failed, falling back to IP:", err.message);\n      fallbackToIP();\n    });'
);

fs.writeFileSync('src/components/SoilForm.tsx', code);
