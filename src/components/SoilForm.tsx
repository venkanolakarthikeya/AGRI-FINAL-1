import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ViewState, SoilData, Recommendation, Language } from '../types';
import { Loader2, TestTube, MapPin } from 'lucide-react';
import { t } from '../translations';
import { LocationAutocomplete } from './LocationAutocomplete';

interface SoilFormProps {
  soilData: SoilData;
  setSoilData: React.Dispatch<React.SetStateAction<SoilData>>;
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[] | null>>;
  setCurrentView: (view: ViewState) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  language: Language;
}

export function SoilForm({ soilData, setSoilData, setRecommendations, setCurrentView, isLoading, setIsLoading, language }: SoilFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLocating, setIsLocating] = useState(false);

  const fetchWeather = async (lat: number | string, lon: number | string) => {
    try {
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation`);
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const limits: Record<string, {min: number, max: number}> = { 
       n: { min: 0, max: 500 }, 
       p: { min: 0, max: 500 }, 
       k: { min: 0, max: 500 }, 
       ph: { min: 0, max: 14 },
       temperature: { min: -10, max: 60 },
       humidity: { min: 0, max: 100 },
       rainfall: { min: 0, max: 5000 }
    };
    
    if (limits[name] && value !== '' && value !== '-') {
       const num = Number(value);
       const limit = limits[name];
       if (num > limit.max) {
           setFieldErrors(prev => ({ ...prev, [name]: language === 'Hindi' ? `अधिकतम मान ${limit.max} है` : language === 'Telugu' ? `గరిష్ట విలువ ${limit.max}` : `Maximum value is ${limit.max}` }));
           return;
       }
       if (num < limit.min) {
           setFieldErrors(prev => ({ ...prev, [name]: language === 'Hindi' ? `न्यूनतम मान ${limit.min} है` : language === 'Telugu' ? `కనిష్ట విలువ ${limit.min}` : `Minimum value is ${limit.min}` }));
           return;
       }
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setSoilData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    const fallbackToIP = async () => {
      try {
        const ipRes = await fetch('https://ipinfo.io/json');
        const ipData = await ipRes.json();
        if (ipData && ipData.city) {
          const locName = ipData.region ? `${ipData.city}, ${ipData.region}` : ipData.city;
          setSoilData(prev => ({ ...prev, location: locName }));
          if (ipData.loc) {
            const [lat, lon] = ipData.loc.split(',');
            await fetchWeather(lat, lon);
          }
        } else {
          setError(language === 'Hindi' ? "स्थान प्राप्त करने में विफल।" : language === 'Telugu' ? "స్థానాన్ని పొందడంలో విఫలమైంది." : "Failed to get location.");
        }
      } catch (err) {
        setError(language === 'Hindi' ? "स्थान प्राप्त करने में विफल।" : language === 'Telugu' ? "స్థానాన్ని పొందడంలో విఫలమైంది." : "Failed to get location.");
      } finally {
        setIsLocating(false);
      }
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1&accept-language=${language === 'Hindi' ? 'hi' : language === 'Telugu' ? 'te' : 'en'}`, {
          headers: {
            'User-Agent': 'AgriApp/1.0 (hackathon)'
          }
        });
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const local = addr.village || addr.town || addr.city || addr.hamlet || addr.county || addr.suburb || '';
          const region = addr.state_district || addr.state || '';
          const shortName = [local, region].filter(Boolean).join(', ');
          setSoilData(prev => ({ ...prev, location: shortName || data.display_name }));
        } else if (data && data.display_name) {
          setSoilData(prev => ({ ...prev, location: data.display_name }));
        }
        await fetchWeather(latitude, longitude);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch location name.");
      } finally {
        setIsLocating(false);
      }
    }, (err) => {
      console.warn("GPS failed, falling back to IP:", err.message);
      fallbackToIP();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(fieldErrors).some(err => err !== '')) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get weather data automatically based on location
      if (!soilData.location) {
        throw new Error(language === 'Hindi' ? "कृपया एक स्थान दर्ज करें" : language === 'Telugu' ? "దయచేసి స్థానాన్ని నమోదు చేయండి" : "Please provide a location");
      }
      
            let temp = soilData.temperature ? Number(soilData.temperature) : null;
      let hum = soilData.humidity ? Number(soilData.humidity) : null;
      let rain = soilData.rainfall ? Number(soilData.rainfall) : null;
      
      if (temp === null || hum === null || rain === null) {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(soilData.location)}&format=json&limit=1&accept-language=en`, {
          headers: {
            'User-Agent': 'AgriApp/1.0 (hackathon)'
          }
        });
        const geoData = await geoRes.json();
        
        if (geoData && geoData.length > 0) {
          const { lat, lon } = geoData[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation`);
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
      if (rain === null) rain = 100;
      
      const finalSoilData = {
        ...soilData,
        temperature: temp.toString(),
        humidity: hum.toString(),
        rainfall: rain.toString()
      };
      
      setSoilData(finalSoilData);

      const payload = {
        ...finalSoilData,
        language
      };

      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
      
      setRecommendations(data.recommendations);
      setCurrentView('recommendations');
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <TestTube className="w-6 h-6 text-emerald-600" />
          </div>
          {t(language, 'soil.title')}
        </h2>
        <p className="text-slate-500 mt-2">{t(language, 'soil.desc')}</p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider">
            {t(language, 'soil.composition')} <span className="text-slate-400 font-normal ml-2">(Optional)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-emerald-700 mb-1.5 ml-1">{t(language, 'soil.nitrogen')}</label>
              <input type="number" min="0" max="500" name="n" value={soilData.n} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 90" />
              {fieldErrors.n && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.n}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-700 mb-1.5 ml-1">{t(language, 'soil.phosphorus')}</label>
              <input type="number" min="0" max="500" name="p" value={soilData.p} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 42" />
              {fieldErrors.p && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.p}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-amber-700 mb-1.5 ml-1">{t(language, 'soil.potassium')}</label>
              <input type="number" min="0" max="500" name="k" value={soilData.k} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 43" />
              {fieldErrors.k && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.k}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-purple-700 mb-1.5 ml-1">{t(language, 'soil.ph')}</label>
              <input type="number" step="0.1" min="0" max="14" name="ph" value={soilData.ph} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 6.5" />
              {fieldErrors.ph && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.ph}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider mt-4">{t(language, 'soil.climate')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 ml-1">{t(language, 'soil.location')}</label>
              <LocationAutocomplete 
                location={soilData.location}
                setLocation={(loc) => setSoilData(prev => ({ ...prev, location: loc }))}
                placeholder="e.g. Punjab"
                language={language}
                onSelectCoordinates={(lat, lon) => fetchWeather(lat, lon)}
              />
              <button 
                type="button"
                onClick={handleUseLocation}
                disabled={isLocating}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-70"
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {isLocating ? t(language, 'locating') : t(language, 'useLocation')}
              </button>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.season')}</label>
              <select required name="season" value={soilData.season} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium h-[46px]">
                <option value="">{t(language, 'soil.selectSeason')}</option>
                <option value="Kharif">{t(language, 'soil.kharif')}</option>
                <option value="Rabi">{t(language, 'soil.rabi')}</option>
                <option value="Zaid">{t(language, 'soil.zaid')}</option>
                <option value="Annual">{t(language, 'soil.annual')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isLoading || Object.values(fieldErrors).some(err => err !== '') || !soilData.location || !soilData.season}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-md text-sm uppercase tracking-wider"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {t(language, 'soil.analyzing')}</>
            ) : (
              t(language, 'soil.generate')
            )}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
