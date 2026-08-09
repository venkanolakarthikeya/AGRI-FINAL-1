import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSoilData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              <input required type="number" name="n" value={soilData.n} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 90" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-700 mb-1.5 ml-1">{t(language, 'soil.phosphorus')}</label>
              <input required type="number" name="p" value={soilData.p} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 42" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-amber-700 mb-1.5 ml-1">{t(language, 'soil.potassium')}</label>
              <input required type="number" name="k" value={soilData.k} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 43" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-purple-700 mb-1.5 ml-1">{t(language, 'soil.ph')}</label>
              <input required type="number" step="0.1" name="ph" value={soilData.ph} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 6.5" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider mt-4">{t(language, 'soil.climate')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.temp')}</label>
              <input required type="number" step="0.1" name="temperature" value={soilData.temperature} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 28" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.humidity')}</label>
              <input required type="number" name="humidity" value={soilData.humidity} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 82" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">{t(language, 'soil.rainfall')}</label>
              <input required type="number" name="rainfall" value={soilData.rainfall} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 200" />
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
            disabled={isLoading}
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
