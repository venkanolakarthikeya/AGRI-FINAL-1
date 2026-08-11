import React, { useEffect, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
  language?: string;
  location: string;
  setLocation: (loc: string) => void;
  placeholder?: string;
}

interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
}

export function LocationAutocomplete({ location, setLocation, placeholder, language = "English" }: LocationAutocompleteProps) {
  const [query, setQuery] = useState(location);
  const [suggestions, setSuggestions] = useState<NominatimPlace[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query === location) {
      setSuggestions([]);
      setErrorMsg(null);
      return;
    }
    
    // Only search if query is at least 3 chars to save API calls
    if (query.length < 3) {
      return;
    }

    const timer = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=${language === "Hindi" ? "hi" : language === "Telugu" ? "te" : "en"}`, {
        headers: {
          'User-Agent': 'AgriApp/1.0 (hackathon)'
        }
      })
      .then(res => res.json())
      .then((data: NominatimPlace[]) => {
        setSuggestions(data);
        setErrorMsg(null);
        setShowDropdown(true);
      })
      .catch(err => {
        console.error("Error fetching places:", err);
        setErrorMsg("An error occurred while fetching places. Please try again.");
        setShowDropdown(true);
      });
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [query, location]);

  const handleSelect = (place: NominatimPlace) => {
    // Using display_name which contains the full formatted address
    const address = place.display_name;
    setQuery(address);
    setLocation(address);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value === '') {
            setLocation('');
          }
        }}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      />

      {showDropdown && (suggestions.length > 0 || errorMsg) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {errorMsg && (
             <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-100 last:border-0 rounded-t-xl">
               {errorMsg}
             </div>
          )}
          {suggestions.map(place => {
             const parts = place.display_name.split(', ');
             const title = parts[0];
             const subtitle = parts.slice(1).join(', ');
             return (
               <button
                 key={place.place_id}
                 onClick={() => handleSelect(place)}
                 className="w-full text-left px-4 py-3 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none transition-colors border-b border-slate-50 last:border-0"
               >
                 <div className="font-medium text-slate-800 text-sm">{title}</div>
                 <div className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</div>
               </button>
             );
          })}
        </div>
      )}
    </div>
  );
}
