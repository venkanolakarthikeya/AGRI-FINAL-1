import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Thermometer, Wind, AlertTriangle, Sun, Moon } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface WeatherProps {
  location: string;
  language: Language;
}

export function Weather({ location, language }: WeatherProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // 1. Geocode the location string using Nominatim
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&accept-language=${language === "Hindi" ? "hi" : language === "Telugu" ? "te" : "en"}`);
        const geoData = await geoRes.json();
        
        if (!geoData || geoData.length === 0) {
          throw new Error('Location not found');
        }
        
        const { lat, lon } = geoData[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        // 2. Fetch weather data
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&hourly=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto&models=best_match`);
        const data = await weatherRes.json();
        
        setWeatherData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">{t(language, 'weather.loading')} {location}...</div>;
  }

  if (error || !weatherData) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100">
        {error || t(language, 'weather.error')}
      </div>
    );
  }

  const current = weatherData.current;
  const daily = weatherData.daily;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <CloudSun className="w-5 h-5 text-blue-500" />
          </div>
          {t(language, 'weather.title')}
        </h2>
      </div>

      {current.temperature_2m > 35 && (
        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
          <div>
            <h3 className="font-bold text-red-800 text-sm">{t(language, 'weather.heatWarning')}</h3>
            <p className="text-red-600 text-xs mt-1 leading-relaxed">{t(language, 'weather.heatDesc')}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Current Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:col-span-1 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">{t(language, 'weather.current')}</p>
          <div className="flex justify-center mb-4">
            <CloudSun className="w-16 h-16 text-slate-300" />
          </div>
          <div className="text-5xl font-black text-slate-800 mb-6 text-center">
            {Math.round(current.temperature_2m)}°<span className="text-2xl font-normal text-slate-400">C</span>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 mt-auto">
            <div className="flex flex-col bg-slate-50 p-2.5 rounded-xl border border-slate-100 justify-center text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight mb-1 break-words">{t(language, 'weather.humidity')}</p>
              <p className="font-bold text-slate-800">{current.relative_humidity_2m}%</p>
            </div>
            <div className="flex flex-col bg-slate-50 p-2.5 rounded-xl border border-slate-100 justify-center text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight mb-1 break-words">{t(language, 'weather.wind')}</p>
              <p className="font-bold text-slate-800">{current.wind_speed_10m} km/h</p>
            </div>
            <div className="flex flex-col bg-slate-50 p-2.5 rounded-xl border border-slate-100 justify-center text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight mb-1 break-words">{t(language, 'weather.precip')}</p>
              <p className="font-bold text-slate-800">{current.precipitation} mm</p>
            </div>
            <div className="flex flex-col bg-slate-50 p-2.5 rounded-xl border border-slate-100 justify-center text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight mb-1 break-words">{t(language, 'weather.uvMax')}</p>
              <p className="font-bold text-slate-800">{daily.uv_index_max?.[0] || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Other Metrics */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center h-full">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mb-3">
                <Droplets className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider leading-snug mb-3 w-full break-words whitespace-normal">{t(language, 'weather.et')}</p>
              <div className="mb-3">
                <span className="text-3xl font-black text-slate-800">4.2</span>
                <span className="text-slate-500 text-xs ml-1 block mt-1">mm/day</span>
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed mt-auto">{t(language, 'weather.etDesc')}</p>
           </div>
           
           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center h-full">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mb-3">
                <Thermometer className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider leading-snug mb-3 w-full break-words whitespace-normal">{t(language, 'weather.soilTemp')}</p>
              <div className="mb-3">
                <span className="text-3xl font-black text-slate-800">{Math.round(current.temperature_2m - 2)}°</span>
                <span className="text-slate-500 text-xs ml-1 block mt-1">C</span>
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed mt-auto">{t(language, 'weather.soilTempDesc')}</p>
           </div>

           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center h-full">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mb-3">
                <Sun className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider leading-snug mb-3 w-full break-words whitespace-normal">{t(language, 'weather.solar')}</p>
              <div className="mb-3">
                <span className="text-3xl font-black text-slate-800">22.5</span>
                <span className="text-slate-500 text-xs ml-1 block mt-1">MJ/m²</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider leading-relaxed mt-auto">{t(language, 'weather.solarDesc')}</p>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5">{t(language, 'weather.outlook')}</h3>
        <div className="divide-y divide-slate-100">
           {daily.time.map((time: string, i: number) => {
             const date = new Date(time);
             const dayName = i === 0 ? t(language, 'weather.today') : date.toLocaleDateString('en-US', { weekday: 'short' });
             return (
               <div key={time} className="py-3 flex items-center justify-between gap-4 text-sm">
                 <div className="w-16 font-bold text-slate-700">{dayName}</div>
                 <div className="flex items-center gap-2 text-slate-400">
                   <Sun className="w-4 h-4" />
                 </div>
                 <div className="font-bold text-slate-800 w-24 text-right">
                    {Math.round(daily.temperature_2m_max[i])}° <span className="text-slate-400 font-normal text-xs">/ {Math.round(daily.temperature_2m_min[i])}°</span>
                 </div>
                 <div className="flex-1 hidden md:block">
                    {daily.precipitation_sum[i] > 5 ? (
                      <div className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs w-max ml-auto font-medium">
                        {t(language, 'weather.rainExpected')}: {daily.precipitation_sum[i]}mm
                      </div>
                    ) : (
                      <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg text-xs w-max ml-auto font-medium">
                        {t(language, 'weather.optimalWork')}
                      </div>
                    )}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

    </div>
  );
}
