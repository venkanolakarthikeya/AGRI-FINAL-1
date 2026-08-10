const fs = require('fs');

const code = `import React, { useState } from 'react';
import { ViewState, SoilData, Recommendation, Language } from '../types';
import { Loader2, TestTube } from 'lucide-react';
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
           setFieldErrors(prev => ({ ...prev, [name]: language === 'Hindi' ? \`अधिकतम मान \${limit.max} है\` : language === 'Telugu' ? \`గరిష్ట విలువ \${limit.max}\` : \`Maximum value is \${limit.max}\` }));
           return; 
       }
       if (num < limit.min) {
           setFieldErrors(prev => ({ ...prev, [name]: language === 'Hindi' ? \`न्यूनतम मान \${limit.min} है\` : language === 'Telugu' ? \`కనిష్ట విలువ \${limit.min}\` : \`Minimum value is \${limit.min}\` }));
           return;
       }
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setSoilData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...soilData, language }),
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
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider">{t(language, 'soil.composition')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-emerald-700 mb-1.5 ml-1">{t(language, 'soil.nitrogen')}</label>
              <input required type="number" min="0" max="500" name="n" value={soilData.n} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 90" />
              {fieldErrors.n && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.n}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-700 mb-1.5 ml-1">{t(language, 'soil.phosphorus')}</label>
              <input required type="number" min="0" max="500" name="p" value={soilData.p} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 42" />
              {fieldErrors.p && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.p}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-amber-700 mb-1.5 ml-1">{t(language, 'soil.potassium')}</label>
              <input required type="number" min="0" max="500" name="k" value={soilData.k} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 43" />
              {fieldErrors.k && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.k}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-purple-700 mb-1.5 ml-1">{t(language, 'soil.ph')}</label>
              <input required type="number" step="0.1" min="0" max="14" name="ph" value={soilData.ph} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 6.5" />
              {fieldErrors.ph && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.ph}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider mt-4">{t(language, 'soil.climate')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.temp')}</label>
              <input required type="number" step="0.1" min="-10" max="60" name="temperature" value={soilData.temperature} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 28" />
              {fieldErrors.temperature && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.temperature}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.humidity')}</label>
              <input required type="number" min="0" max="100" name="humidity" value={soilData.humidity} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 82" />
              {fieldErrors.humidity && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.humidity}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.rainfall')}</label>
              <input required type="number" min="0" max="5000" name="rainfall" value={soilData.rainfall} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 200" />
              {fieldErrors.rainfall && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{fieldErrors.rainfall}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.location')}</label>
              <LocationAutocomplete 
                location={soilData.location}
                setLocation={(loc) => setSoilData(prev => ({ ...prev, location: loc }))}
                placeholder="e.g. Punjab"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.season')}</label>
              <select required name="season" value={soilData.season} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium">
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
            disabled={isLoading || Object.values(fieldErrors).some(err => err !== '')}
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
