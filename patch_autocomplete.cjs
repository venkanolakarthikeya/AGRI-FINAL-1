const fs = require('fs');

let code = fs.readFileSync('src/components/LocationAutocomplete.tsx', 'utf8');

code = code.replace(
    '  placeholder?: string;',
    '  placeholder?: string;\n  onSelectCoordinates?: (lat: string, lon: string) => void;'
);

code = code.replace(
    'export function LocationAutocomplete({ location, setLocation, placeholder, language = "English" }: LocationAutocompleteProps) {',
    'export function LocationAutocomplete({ location, setLocation, placeholder, language = "English", onSelectCoordinates }: LocationAutocompleteProps) {'
);

code = code.replace(
    '    setLocation(address);\n    setShowDropdown(false);',
    '    setLocation(address);\n    setShowDropdown(false);\n    if (onSelectCoordinates) {\n      onSelectCoordinates(place.lat, place.lon);\n    }'
);

fs.writeFileSync('src/components/LocationAutocomplete.tsx', code);

let soilCode = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');

soilCode = soilCode.replace(
    '                language={language}\n              />',
    '                language={language}\n                onSelectCoordinates={(lat, lon) => fetchWeather(lat, lon)}\n              />'
);

fs.writeFileSync('src/components/SoilForm.tsx', soilCode);

