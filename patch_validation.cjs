const fs = require('fs');

let code = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

const oldHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);`;

const newHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const n = Number(soilData.n);
    const p = Number(soilData.p);
    const k = Number(soilData.k);
    const ph = Number(soilData.ph);
    const temp = Number(soilData.temperature);
    const hum = Number(soilData.humidity);
    const rain = Number(soilData.rainfall);

    if (n < 0 || n > 500) { setError(language === 'Hindi' ? "नाइट्रोजन 0 और 500 के बीच होना चाहिए" : language === 'Telugu' ? "నత్రజని 0 మరియు 500 మధ్య ఉండాలి" : "Nitrogen value must be between 0 and 500"); return; }
    if (p < 0 || p > 500) { setError(language === 'Hindi' ? "फास्फोरस 0 और 500 के बीच होना चाहिए" : language === 'Telugu' ? "భాస్వరం 0 మరియు 500 మధ్య ఉండాలి" : "Phosphorus value must be between 0 and 500"); return; }
    if (k < 0 || k > 500) { setError(language === 'Hindi' ? "पोटेशियम 0 और 500 के बीच होना चाहिए" : language === 'Telugu' ? "పొటాషియం 0 మరియు 500 మధ్య ఉండాలి" : "Potassium value must be between 0 and 500"); return; }
    if (ph < 0 || ph > 14) { setError(language === 'Hindi' ? "pH मान 0 और 14 के बीच होना चाहिए" : language === 'Telugu' ? "pH విలువ 0 మరియు 14 మధ్య ఉండాలి" : "pH value must be between 0 and 14"); return; }
    if (temp < -10 || temp > 60) { setError(language === 'Hindi' ? "तापमान -10 और 60 के बीच होना चाहिए" : language === 'Telugu' ? "ఉష్ణోగ్రత -10 మరియు 60 మధ్య ఉండాలి" : "Temperature must be between -10 and 60 °C"); return; }
    if (hum < 0 || hum > 100) { setError(language === 'Hindi' ? "नमी 0 और 100 के बीच होनी चाहिए" : language === 'Telugu' ? "తేమ 0 మరియు 100 మధ్య ఉండాలి" : "Humidity must be between 0 and 100 %"); return; }
    if (rain < 0 || rain > 5000) { setError(language === 'Hindi' ? "वर्षा 0 और 5000 के बीच होनी चाहिए" : language === 'Telugu' ? "వర్షపాతం 0 మరియు 5000 మధ్య ఉండాలి" : "Rainfall must be between 0 and 5000 mm"); return; }

    setIsLoading(true);
    setError(null);`;

code = code.replace(oldHandleSubmit, newHandleSubmit);

// We can also add min and max to the html inputs just in case
code = code.replace(/name="n" value/g, 'min="0" max="500" name="n" value');
code = code.replace(/name="p" value/g, 'min="0" max="500" name="p" value');
code = code.replace(/name="k" value/g, 'min="0" max="500" name="k" value');
code = code.replace(/name="ph" value/g, 'min="0" max="14" name="ph" value');
code = code.replace(/name="temperature" value/g, 'min="-10" max="60" name="temperature" value');
code = code.replace(/name="humidity" value/g, 'min="0" max="100" name="humidity" value');
code = code.replace(/name="rainfall" value/g, 'min="0" max="5000" name="rainfall" value');


fs.writeFileSync('src/components/SoilForm.tsx', code);
