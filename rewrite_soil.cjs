const fs = require('fs');

const code = `import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const limits: Record<string, {min: number, max: number}> = { 
       n: { min: 0, max: 500 }, 
       p: { min: 0, max: 500 }, 
       k: { min: 0, max: 500 }, 
       ph: { min: 0, max: 14 }
    };
    
    if (limits[name] && value !== '' && value !== '-') {
       const num = Number(value);
       const limit = limits[name];
       if (num > limit.max) {
           setFieldErrors(prev => ({ ...prev, [name]: language === 'Hindi' ? \`अधिकतम मान \${limit.max} है\` : language === 'Telugu' ? \`గరిష్ట విలువ \${limit.max}\` : \`Maximum value is \${limit.max}\` }));
           return;
       }
       if (num < limit.min) {
           setFieldErrors(prev => ({ ...prev, [name]: language === 'Hindi' ? \`न्यूनतम मान \${limit.min} है\` : language === 'Telugu' ? \`కనిష్ట విలువ \${limit.min}\` : \`Minimum value is \${limit.min}\` }));
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
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}&zoom=10&accept-language=\${language === 'Hindi' ? 'hi' : language === 'Telugu' ? 'te' : 'en'}\`);
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(',');
          // Just grab a readable part of the location
          const shortName = parts.length > 1 ? parts[0] + ', ' + parts[1] : data.display_name;
          setSoilData(prev => ({ ...prev, location: shortName }));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch location name.");
      } finally {
        setIsLocating(false);
      }
    }, (err) => {
      setIsLocating(false);
      setError(err.message || "Failed to get location.");
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
      
      const geoRes = await fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(soilData.location)}&format=json&limit=1&accept-language=en\`);
      const geoData = await geoRes.json();
      
      let temp = 25, hum = 60, rain = 100;
      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
        const weatherRes = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,relative_humidity_2m,precipitation\`);
        const weatherData = await weatherRes.json();
        if (weatherData && weatherData.current) {
          temp = weatherData.current.temperature_2m;
          hum = weatherData.current.relative_humidity_2m;
          // estimate monthly rainfall from current precip or just send current
          rain = weatherData.current.precipitation * 30 || 100;
        }
      }

      const payload = {
        ...soilData,
        temperature: temp,
        humidity: hum,
        rainfall: rain,
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <TestTube className="w-6 h-6 text-emerald-600" />
          </div>
          {t(language, 'soil.title')}
        </h2>
        <p className="text-slate-500 mt-2">{t(language, 'soil.desc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-8">
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
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 ml-1">{t(language, 'soil.location')}</label>
              <LocationAutocomplete 
                location={soilData.location}
                setLocation={(loc) => setSoilData(prev => ({ ...prev, location: loc }))}
                placeholder="e.g. Punjab"
                language={language}
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
            <div>
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
      </form>
    </div>
  );
}
`;

fs.writeFileSync('src/components/SoilForm.tsx', code);
